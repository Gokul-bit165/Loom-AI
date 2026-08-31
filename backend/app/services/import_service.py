"""
Loom AI — Daily Shift Data Import & Template Service.
Supports Excel (.xlsx) and CSV templates and uploads for Shift 1, 2, 3 data.
"""
from __future__ import annotations

import io
from datetime import date, datetime
from typing import Any
import pandas as pd

from sqlalchemy import select, text
from sqlalchemy.orm import Session

from app.database import SessionLocal, engine
from app.db_models import (
    BreakdownEvent,
    FabricMaster,
    ImportBatch,
    Machine,
    ProductionLog,
    RevenueLog,
)


DEFAULT_FABRIC_STYLES = [
    "30s VSF Plain",
    "60s Excel 4/1 Satin",
    "40s Cotton Twill",
    "80s Micro Modal",
]

DEFAULT_STYLE_RATES = {
    "30s VSF Plain": 1.27,
    "60s Excel 4/1 Satin": 1.84,
    "40s Cotton Twill": 1.45,
    "80s Micro Modal": 2.15,
}


def get_template_dataframe(target_date: str | None = None, session: Session | None = None) -> pd.DataFrame:
    """
    Builds a template DataFrame with 3 rows (Shift 1, 2, 3) per machine for the target date.
    """
    if not target_date:
        target_date = date.today().isoformat()

    # Query machines from DB if session provided, else use canonical list
    machines_list = []
    if session:
        machines = session.scalars(select(Machine).where(Machine.active.is_(True)).order_by(Machine.machine_id)).all()
        for m in machines:
            machines_list.append({
                "machine_id": m.machine_id,
                "department": m.department,
                "machine_type": m.machine_type,
            })

    if not machines_list:
        # Default sample machines if DB is empty
        for i in range(1, 11):
            machines_list.append({"machine_id": f"TOY-{i:02d}", "department": "Weaving", "machine_type": "Airjet"})
        for i in range(1, 6):
            machines_list.append({"machine_id": f"SUL-{i:02d}", "department": "Weaving", "machine_type": "Sulzer"})
        for i in range(1, 11):
            machines_list.append({"machine_id": f"TSU-{i:02d}", "department": "Weaving", "machine_type": "Tsudakoma"})

    rows = []
    for idx, m in enumerate(machines_list):
        style = DEFAULT_FABRIC_STYLES[idx % len(DEFAULT_FABRIC_STYLES)]
        rate = DEFAULT_STYLE_RATES.get(style, 1.27)

        for shift in [1, 2, 3]:
            # Provide sample numbers that user can edit
            target_qty = 200.0 if m["department"] == "Weaving" else 500.0
            actual_qty = round(target_qty * (0.88 + (shift * 0.03)), 1)
            running_hrs = 7.5 if shift != 3 else 7.0
            warp_brk = 1 if shift == 1 else 0
            weft_brk = 2 if shift == 3 else 1
            downtime_min = 30 if shift == 3 else (15 if shift == 1 else 0)
            breakdown_reason = "Weft Break" if shift == 3 else ("Warp Tension" if shift == 1 else "")
            revenue = round(actual_qty * rate, 2)

            rows.append({
                "date": target_date,
                "shift": shift,
                "machine_id": m["machine_id"],
                "department": m["department"],
                "machine_type": m["machine_type"],
                "fabric_style": style,
                "target_qty": target_qty,
                "actual_qty": actual_qty,
                "running_hours": running_hrs,
                "warp_breaks": warp_brk,
                "weft_breaks": weft_brk,
                "downtime_minutes": downtime_min,
                "breakdown_reason": breakdown_reason,
                "revenue": revenue,
            })

    return pd.DataFrame(rows)


def generate_template_bytes(format_type: str = "xlsx", target_date: str | None = None) -> tuple[bytes, str, str]:
    """
    Generates Excel (.xlsx) or CSV template bytes.
    Returns: (bytes, media_type, filename)
    """
    with SessionLocal() as session:
        df = get_template_dataframe(target_date, session)

    date_str = target_date or date.today().isoformat()
    if format_type.lower() in ["xlsx", "excel"]:
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine="openpyxl") as writer:
            df.to_excel(writer, index=False, sheet_name="Shift_Production_Data")
        output.seek(0)
        return (
            output.getvalue(),
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            f"loom_ai_shift_template_{date_str}.xlsx",
        )
    else:
        csv_str = df.to_csv(index=False)
        return (
            csv_str.encode("utf-8"),
            "text/csv; charset=utf-8",
            f"loom_ai_shift_template_{date_str}.csv",
        )


def process_uploaded_shift_file(
    file_bytes: bytes,
    filename: str,
    user_name: str = "operator",
) -> dict[str, Any]:
    """
    Parses and ingests uploaded Excel or CSV shift data into PostgreSQL.
    Upserts production_logs so existing shifts for that date are updated.
    """
    # 1. Read file into pandas
    try:
        if filename.endswith(".xlsx") or filename.endswith(".xls"):
            df = pd.read_excel(io.BytesIO(file_bytes))
        else:
            # Try utf-8, fallback to latin-1
            try:
                df = pd.read_csv(io.BytesIO(file_bytes), encoding="utf-8")
            except UnicodeDecodeError:
                df = pd.read_csv(io.BytesIO(file_bytes), encoding="latin-1")
    except Exception as e:
        raise ValueError(f"Could not read uploaded file: {e}")

    # Normalize column names (strip, lowercase)
    df.columns = [str(c).strip().lower().replace(" ", "_") for c in df.columns]

    required_cols = {"date", "shift", "machine_id", "target_qty", "actual_qty"}
    missing = required_cols - set(df.columns)
    if missing:
        raise ValueError(f"Missing required columns in uploaded file: {', '.join(missing)}")

    # Clean and parse rows
    df["date"] = pd.to_datetime(df["date"]).dt.date
    df["shift"] = df["shift"].astype(int)
    df["machine_id"] = df["machine_id"].astype(str).str.strip().str.upper()
    df["target_qty"] = pd.to_numeric(df["target_qty"], errors="coerce").fillna(0.0)
    df["actual_qty"] = pd.to_numeric(df["actual_qty"], errors="coerce").fillna(0.0)

    # Optional columns with smart defaults
    if "department" not in df.columns:
        df["department"] = "Weaving"
    else:
        df["department"] = df["department"].fillna("Weaving").astype(str).str.strip()

    if "machine_type" not in df.columns:
        df["machine_type"] = "Airjet"
    else:
        df["machine_type"] = df["machine_type"].fillna("Airjet").astype(str).str.strip()

    if "fabric_style" not in df.columns:
        df["fabric_style"] = "30s VSF Plain"
    else:
        df["fabric_style"] = df["fabric_style"].fillna("30s VSF Plain").astype(str).str.strip()

    if "running_hours" not in df.columns:
        df["running_hours"] = 8.0
    else:
        df["running_hours"] = pd.to_numeric(df["running_hours"], errors="coerce").fillna(8.0)

    if "warp_breaks" not in df.columns:
        df["warp_breaks"] = 0
    else:
        df["warp_breaks"] = pd.to_numeric(df["warp_breaks"], errors="coerce").fillna(0).astype(int)

    if "weft_breaks" not in df.columns:
        df["weft_breaks"] = 0
    else:
        df["weft_breaks"] = pd.to_numeric(df["weft_breaks"], errors="coerce").fillna(0).astype(int)

    if "downtime_minutes" not in df.columns:
        df["downtime_minutes"] = 0
    else:
        df["downtime_minutes"] = pd.to_numeric(df["downtime_minutes"], errors="coerce").fillna(0).astype(int)

    if "breakdown_reason" not in df.columns:
        df["breakdown_reason"] = ""
    else:
        df["breakdown_reason"] = df["breakdown_reason"].fillna("").astype(str).str.strip()

    if "revenue" not in df.columns:
        df["revenue"] = df.apply(
            lambda r: round(float(r["actual_qty"]) * DEFAULT_STYLE_RATES.get(r["fabric_style"], 1.27), 2),
            axis=1,
        )
    else:
        df["revenue"] = pd.to_numeric(df["revenue"], errors="coerce").fillna(0.0)

    # Ingestion into Database
    with SessionLocal() as session:
        # Create import batch
        batch = ImportBatch(
            source_file=filename,
            source_type="real",
            is_demo=False,
            dataset_label=f"Daily Shift Import: {filename}",
            imported_by=user_name,
            notes=f"Uploaded {len(df)} shift records across shifts {sorted(df['shift'].unique())}",
        )
        session.add(batch)
        session.flush()

        prod_count = 0
        breakdown_count = 0
        revenue_count = 0
        machines_set = set()
        dates_set = set()

        for _, row in df.iterrows():
            row_date: date = row["date"]
            row_shift: int = int(row["shift"])
            m_id: str = row["machine_id"]
            dept: str = row["department"]
            m_type: str = row["machine_type"]
            style: str = row["fabric_style"]
            target_q: float = max(0.0, float(row["target_qty"]))
            actual_q: float = max(0.0, float(row["actual_qty"]))
            running_h: float = float(row["running_hours"])
            warp_b: int = int(row["warp_breaks"])
            weft_b: int = int(row["weft_breaks"])
            downtime_m: int = int(row["downtime_minutes"])
            bd_reason: str = row["breakdown_reason"]
            rev: float = float(row["revenue"])

            machines_set.add(m_id)
            dates_set.add(row_date.isoformat())

            # 1. Ensure machine exists
            machine = session.get(Machine, m_id)
            if not machine:
                machine = Machine(
                    machine_id=m_id,
                    unit="Unit I",
                    department=dept,
                    machine_type=m_type,
                    granularity="real_grounded",
                    source_type="real",
                    status="ACTIVE",
                    active=True,
                )
                session.add(machine)
                session.flush()

            # 2. Ensure fabric style exists
            fabric = session.get(FabricMaster, style)
            if not fabric:
                fabric = FabricMaster(
                    fabric_style_id=style,
                    fabric_style_name=style,
                    standard_rate_per_meter=DEFAULT_STYLE_RATES.get(style, 1.27),
                )
                session.add(fabric)
                session.flush()

            # Calculate efficiency (clamped 0 - 110)
            eff = (actual_q / target_q * 100.0) if target_q > 0 else 0.0
            eff = min(110.0, max(0.0, eff))

            # 3. Upsert Production Log
            existing_prod = session.scalar(
                select(ProductionLog).where(
                    ProductionLog.machine_id == m_id,
                    ProductionLog.date == row_date,
                    ProductionLog.shift == row_shift,
                )
            )

            if existing_prod:
                existing_prod.target_qty = target_q
                existing_prod.actual_qty = actual_q
                existing_prod.efficiency_pct = round(eff, 2)
                existing_prod.running_hours = running_h
                existing_prod.warp_break_count = warp_b
                existing_prod.weft_break_count = weft_b
                existing_prod.fabric_style_id = style
                existing_prod.import_batch_id = batch.id
                existing_prod.data_source = "EXCEL_UPLOAD"
                prod_obj = existing_prod
            else:
                prod_obj = ProductionLog(
                    date=row_date,
                    shift=row_shift,
                    machine_id=m_id,
                    fabric_style_id=style,
                    target_qty=target_q,
                    actual_qty=actual_q,
                    efficiency_pct=round(eff, 2),
                    running_hours=running_h,
                    available_hours=8.0,
                    warp_break_count=warp_b,
                    weft_break_count=weft_b,
                    data_source="EXCEL_UPLOAD",
                    import_batch_id=batch.id,
                )
                session.add(prod_obj)
                session.flush()

            prod_count += 1

            # 4. Insert Breakdown Event if downtime reported
            if downtime_m > 0 and bd_reason:
                bd_event = BreakdownEvent(
                    date=row_date,
                    shift=row_shift,
                    machine_id=m_id,
                    production_id=prod_obj.id,
                    reason=bd_reason,
                    breakdown_category="MECHANICAL" if "warp" in bd_reason.lower() or "weft" in bd_reason.lower() else "OTHER",
                    duration_minutes=downtime_m,
                    source_type="real",
                    data_source="OPERATOR",
                    import_batch_id=batch.id,
                )
                session.add(bd_event)
                breakdown_count += 1

            # 5. Insert Revenue Log
            if rev > 0:
                rev_log = RevenueLog(
                    date=row_date,
                    shift=row_shift,
                    machine_id=m_id,
                    fabric_style=style,
                    revenue=rev,
                    source_type="real",
                    import_batch_id=batch.id,
                )
                session.add(rev_log)
                revenue_count += 1

        # Update batch stats
        batch.production_accepted = prod_count
        batch.breakdown_accepted = breakdown_count
        batch.revenue_accepted = revenue_count
        session.commit()
        saved_batch_id = batch.id

    return {
        "status": "success",
        "batch_id": saved_batch_id,
        "filename": filename,
        "dates_covered": sorted(list(dates_set)),
        "shifts_covered": sorted([int(s) for s in df["shift"].unique()]),
        "unique_machines": len(machines_set),
        "production_records_ingested": prod_count,
        "breakdown_events_ingested": breakdown_count,
        "revenue_records_ingested": revenue_count,
        "total_actual_quantity": round(float(df["actual_qty"].sum()), 2),
        "total_target_quantity": round(float(df["target_qty"].sum()), 2),
        "total_downtime_minutes": int(df["downtime_minutes"].sum()),
    }
