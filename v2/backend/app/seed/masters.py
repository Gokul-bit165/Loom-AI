"""
Loom AI v2 — master data seed.

Populates: unit, shed, loom_type, style, style_unit_crimp_monthly,
shift_master, employee, reason_code, cost_master, loom (ATM ONLY —
vendor units carry no loom rows, design correction §1.1), and
vendor_unit_monthly_summary (the only data vendor units get).

DATA-QUALITY NOTE (flagged, not silently resolved): the source brief's
role-count table (63 WEAVER + 5 TRAINING-WEAVER + 18 FABRIC_CHECKER +
8 LOADMAN + 6 SHIFT_FITTER + 3 HEAD_FITTER + 4 KNOTTER + 3 GAITER +
3 ELECTRICIAN + 2 OILER + 2 QUALITY_CHECKER + 6 SWEEPER) sums to 123, not
the "137 weaving employees" stated alongside it. This seed uses the
role-count table as ground truth (123 employees) since it is the more
specific, itemized figure, and does NOT pad to 137 with invented rows.
Similarly, the grade-count table (49 G1+, 24 G2, 23 G1, 9 G2+, 5 G3,
5 G4, 2 G3+, 2 G5, 2 G6+, 1 G6) sums to 122, one short of 123 — the last
employee seeded (a SWEEPER) is left with grade=None rather than forcing a
122nd grade onto a role the source data didn't grade.

The mapping from grade code to "N-Looms + X% standard" band is NOT given
explicitly in the source brief (only four example bands: "8-Looms+97.5%",
"7-Looms+97%", "6-Looms+97.5%", "5-Looms+97%", trainee "4-Looms+97%").
This seed uses a documented, deterministic assumption (higher grade ->
more looms) and should be corrected against the mill's real grade
standard sheet when available.
"""
from __future__ import annotations

import datetime
from decimal import Decimal

from sqlalchemy.orm import Session

from app.db_models import (
    CostMaster,
    DataSource,
    Employee,
    EmployeeGrade,
    EmployeeRole,
    Loom,
    LoomMake,
    LoomType,
    RateSource,
    ReasonCategory,
    ReasonCode,
    Shed,
    ShiftMaster,
    Style,
    StyleUnitCrimpMonthly,
    Unit,
    VendorUnitMonthlySummary,
)

DEFAULT_REVENUE_PER_METRE = Decimal("40.00")  # ESTIMATED placeholder — see design note §1.2

# ── Units ────────────────────────────────────────────────────────────────

UNITS = [
    {"code": "ATM", "name": "Ashok Textile Mills (P) Ltd", "is_own_unit": True},
    {"code": "CVF", "name": "CVF (job-work partner)", "is_own_unit": False},
    {"code": "SKT", "name": "SKT (job-work partner)", "is_own_unit": False},
    {"code": "VPN", "name": "VPN (job-work partner)", "is_own_unit": False},
    {"code": "METRO", "name": "METRO (job-work partner)", "is_own_unit": False},
    {"code": "TPN", "name": "TPN (job-work partner)", "is_own_unit": False},
]

# ── Loom types ───────────────────────────────────────────────────────────

LOOM_TYPES = [
    {"loom_type_code": "810", "make": LoomMake.TSUDAKOMA, "description": "Tsudakoma ZAX 810 Airjet"},
    {"loom_type_code": "910", "make": LoomMake.TSUDAKOMA, "description": "Tsudakoma ZAX 910 Airjet"},
    {"loom_type_code": "340", "make": LoomMake.SULZER, "description": "Sulzer 340"},
    {"loom_type_code": "280", "make": LoomMake.SULZER, "description": "Sulzer 280"},
    {"loom_type_code": "TS", "make": LoomMake.SULZER, "description": "Sulzer TS"},
    {"loom_type_code": "SZ", "make": LoomMake.SULZER, "description": "Sulzer SZ"},
]
AIRJET_TYPES = ["810", "910"]
SULZER_TYPES = ["340", "280", "TS", "SZ"]

# ── Shift master ─────────────────────────────────────────────────────────

SHIFTS = [
    {"code": "1", "start_time": datetime.time(6, 0), "end_time": datetime.time(14, 0), "crosses_midnight": False},
    {"code": "2", "start_time": datetime.time(14, 0), "end_time": datetime.time(22, 0), "crosses_midnight": False},
    {"code": "3", "start_time": datetime.time(22, 0), "end_time": datetime.time(6, 0), "crosses_midnight": True},
]
# Shift systematic-gap factor, normalized so shift 1 = 1.0, derived from
# the mill's own Daily Preparatory Report figures (89.48 / 91.18 / 88.03).
SHIFT_EFF_FACTOR = {"1": 89.48 / 89.48, "2": 91.18 / 89.48, "3": 88.03 / 89.48}

# ── Styles (real, from July-2026 Vendor MRM) ────────────────────────────
# picks_per_metre derived from the style code's own pick density
# (design correction #3), not a generic construction default:
#   picks_per_metre = picks_per_inch * 39.3701

STYLES = [
    {
        "style_code": '30s VSF X 30s VSF /66X55&43&57-63" Plain',
        "loom_type_code": "810", "warp_ends": 4140, "reed_pick": "66x55",
        "width_inch": Decimal("63"), "weave_construction": "Plain", "picks_per_inch": 55,
        "std_crimp_pct": Decimal("5.48"), "std_rpm": Decimal("650"), "std_efficiency_pct": Decimal("90.0"),
        "crimp_by_unit": {"ATM": Decimal("5.48"), "CVF": Decimal("4.64"), "SKT": Decimal("4.98"), "VPN": Decimal("4.21"), "TPN": Decimal("5.08")},
    },
    {
        "style_code": '30s VSF X 30s VOT /68X57-48" Plain',
        "loom_type_code": "340", "warp_ends": 4806, "reed_pick": "68x57",
        "width_inch": Decimal("48"), "weave_construction": "Plain", "picks_per_inch": 57,
        "std_crimp_pct": Decimal("6.78"), "std_rpm": Decimal("220"), "std_efficiency_pct": Decimal("87.0"),
        "crimp_by_unit": {"METRO": Decimal("6.78")},
    },
    {
        "style_code": '30s VSF Slub X 30s VSF Slub /90X68-63" Plain',
        "loom_type_code": "280", "warp_ends": 5904, "reed_pick": "90x68",
        "width_inch": Decimal("63"), "weave_construction": "Plain", "picks_per_inch": 68,
        "std_crimp_pct": Decimal("10.25"), "std_rpm": Decimal("210"), "std_efficiency_pct": Decimal("86.0"),
        "crimp_by_unit": {"ATM": Decimal("10.25")},
    },
    {
        "style_code": '20s Excel VOT X 20s Excel VOT /56X52-63" Plain',
        "loom_type_code": "910", "warp_ends": 3528, "reed_pick": "56x52",
        "width_inch": Decimal("63"), "weave_construction": "Plain", "picks_per_inch": 52,
        "std_crimp_pct": Decimal("11.59"), "std_rpm": Decimal("640"), "std_efficiency_pct": Decimal("88.0"),
        "crimp_by_unit": {"ATM": Decimal("11.59")},
    },
    {
        "style_code": '12s VSF Slub X 12s VSF Slub /56X44-63" Plain',
        "loom_type_code": "TS", "warp_ends": 3528, "reed_pick": "56x44",
        "width_inch": Decimal("63"), "weave_construction": "Plain", "picks_per_inch": 44,
        "std_crimp_pct": Decimal("13.42"), "std_rpm": Decimal("200"), "std_efficiency_pct": Decimal("85.0"),
        "crimp_by_unit": {"ATM": Decimal("13.42")},
    },
    {
        "style_code": '40s VOT X 40s VOT /132X80&84-63" Satin',
        "loom_type_code": "810", "warp_ends": 8448, "reed_pick": "132x80",
        "width_inch": Decimal("63"), "weave_construction": "Satin", "picks_per_inch": 80,
        "std_crimp_pct": Decimal("5.69"), "std_rpm": Decimal("620"), "std_efficiency_pct": Decimal("87.0"),
        "crimp_by_unit": {"ATM": Decimal("5.69"), "CVF": Decimal("4.43")},
    },
    {
        "style_code": '30s VSF X 30s VSF /92X67-63" Plain',
        "loom_type_code": "910", "warp_ends": 5808, "reed_pick": "92x67",
        "width_inch": Decimal("63"), "weave_construction": "Plain", "picks_per_inch": 67,
        "std_crimp_pct": Decimal("10.69"), "std_rpm": Decimal("630"), "std_efficiency_pct": Decimal("88.0"),
        "crimp_by_unit": {"SKT": Decimal("10.69"), "TPN": Decimal("9.79")},
    },
    {
        "style_code": '60s Excel X 40s Vortex /165X110-133" 4/1 Satin',
        "loom_type_code": "810", "warp_ends": 21784, "reed_pick": "165x110",
        "width_inch": Decimal("133"), "weave_construction": "4/1 Satin", "picks_per_inch": 110,
        "std_crimp_pct": Decimal("8.09"), "std_rpm": Decimal("560"), "std_efficiency_pct": Decimal("84.0"),
        "crimp_by_unit": {"ATM": Decimal("8.09"), "CVF": Decimal("6.93")},
    },
    {
        "style_code": '60s Excel X 60s Excel /195X91-122" 4/1 Satin',
        "loom_type_code": "910", "warp_ends": 23840, "reed_pick": "195x91",
        "width_inch": Decimal("122"), "weave_construction": "4/1 Satin", "picks_per_inch": 91,
        "std_crimp_pct": Decimal("5.21"), "std_rpm": Decimal("570"), "std_efficiency_pct": Decimal("85.0"),
        "crimp_by_unit": {"ATM": Decimal("5.21")},
    },
    {
        "style_code": '20s OE X 21s Cotton Flax /56X44-63" Plain',
        "loom_type_code": "810", "warp_ends": 3618, "reed_pick": "56x44",
        "width_inch": Decimal("63"), "weave_construction": "Plain", "picks_per_inch": 44,
        "std_crimp_pct": Decimal("8.71"), "std_rpm": Decimal("640"), "std_efficiency_pct": Decimal("89.0"),
        "crimp_by_unit": {"ATM": Decimal("8.71")},
    },
]

# ── Reason codes ─────────────────────────────────────────────────────────

REASON_CODES = [
    ("WARP_BREAK", "Warp break", "நூல் அறுதல் (வார்ப்)", ReasonCategory.MATERIAL),
    ("WEFT_BREAK", "Weft break", "நூல் அறுதல் (ஊடு)", ReasonCategory.MATERIAL),
    ("SORT_BEAM_CHANGE", "Sort/beam change", "பீம் மாற்றம்", ReasonCategory.PLANNED),
    ("KNOTTING", "Knotting", "முடிச்சு போடுதல்", ReasonCategory.PLANNED),
    ("GAITING", "Gaiting", "கெய்டிங்", ReasonCategory.PLANNED),
    ("WEFT_FEEDER_FAULT", "Weft feeder fault", "ஊடு ஊட்டி பழுது", ReasonCategory.MECHANICAL),
    ("AIR_PRESSURE_LOW", "Air pressure low", "காற்றழுத்தம் குறைவு", ReasonCategory.UTILITY),
    ("POWER_FAILURE", "Power failure", "மின் தடை", ReasonCategory.ELECTRICAL),
    ("VOLTAGE_FLUCTUATION", "Voltage fluctuation", "மின்னழுத்த ஏற்ற இறக்கம்", ReasonCategory.ELECTRICAL),
    ("PREVENTIVE_MAINTENANCE", "Preventive maintenance", "தடுப்பு பராமரிப்பு", ReasonCategory.PLANNED),
    ("MECHANICAL_BREAKDOWN", "Mechanical breakdown", "இயந்திர பழுது", ReasonCategory.MECHANICAL),
    ("ELECTRICAL_BREAKDOWN", "Electrical breakdown", "மின் பழுது", ReasonCategory.ELECTRICAL),
    ("NO_WEAVER", "No weaver (absenteeism)", "நெசவாளர் இல்லை", ReasonCategory.MANPOWER),
    ("ROLL_DOFFING", "Fabric roll doffing", "துணி ரோல் அகற்றுதல்", ReasonCategory.PLANNED),
]

# ── Employees ────────────────────────────────────────────────────────────
# See module docstring for the documented 123-vs-137 and 122-vs-123
# data-quality notes.

ROLE_COUNTS = [
    (EmployeeRole.WEAVER, 63),
    (EmployeeRole.TRAINING_WEAVER, 5),
    (EmployeeRole.FABRIC_CHECKER, 18),
    (EmployeeRole.LOADMAN, 8),
    (EmployeeRole.SHIFT_FITTER, 6),
    (EmployeeRole.HEAD_FITTER, 3),
    (EmployeeRole.KNOTTER, 4),
    (EmployeeRole.GAITER, 3),
    (EmployeeRole.ELECTRICIAN, 3),
    (EmployeeRole.OILER, 2),
    (EmployeeRole.QUALITY_CHECKER, 2),
    (EmployeeRole.SWEEPER, 6),
]
TOTAL_EMPLOYEES = sum(n for _, n in ROLE_COUNTS)  # 123, documented mismatch vs brief's "137"

GRADE_COUNTS = [
    (EmployeeGrade.G1_PLUS, 49),
    (EmployeeGrade.G2, 24),
    (EmployeeGrade.G1, 23),
    (EmployeeGrade.G2_PLUS, 9),
    (EmployeeGrade.G3, 5),
    (EmployeeGrade.G4, 5),
    (EmployeeGrade.G3_PLUS, 2),
    (EmployeeGrade.G5, 2),
    (EmployeeGrade.G6_PLUS, 2),
    (EmployeeGrade.G6, 1),
]
TOTAL_GRADED = sum(n for _, n in GRADE_COUNTS)  # 122

# Documented assumption (design note §1's "auth/roles" ambiguity list
# extended): grade -> (std_looms, std_efficiency_pct) band, deterministic,
# not given explicitly in the source brief beyond 4 example bands.
GRADE_BAND = {
    EmployeeGrade.G6_PLUS: (8, Decimal("97.5")),
    EmployeeGrade.G6: (8, Decimal("97.5")),
    EmployeeGrade.G5: (7, Decimal("97.0")),
    EmployeeGrade.G4: (6, Decimal("97.5")),
    EmployeeGrade.G3_PLUS: (6, Decimal("97.5")),
    EmployeeGrade.G3: (6, Decimal("97.5")),
    EmployeeGrade.G2_PLUS: (5, Decimal("97.0")),
    EmployeeGrade.G2: (5, Decimal("97.0")),
    EmployeeGrade.G1_PLUS: (4, Decimal("97.0")),
    EmployeeGrade.G1: (4, Decimal("97.0")),
}
TRAINEE_BAND = (4, Decimal("97.0"))

FIRST_NAMES = (
    # Tamil
    ["Muthu", "Karthik", "Selvam", "Ramesh", "Suresh", "Kannan", "Murugan", "Palani",
     "Velu", "Rajan", "Senthil", "Balu", "Ganesan", "Mani", "Sundar", "Arul",
     "Lakshmi", "Meena", "Kalaivani", "Vasanthi", "Devi", "Priya", "Saroja", "Geetha"]
    # Hindi
    + ["Ramesh", "Suresh", "Rakesh", "Vijay", "Anil", "Sunil", "Manoj", "Ashok",
       "Sunita", "Kavita", "Anjali", "Pooja", "Rekha", "Sarita", "Meera", "Usha"]
    # Odia
    + ["Bijay", "Debasis", "Prasant", "Rabindra", "Sanjay", "Subhas", "Tapan", "Umesh",
       "Basanti", "Jharana", "Kabita", "Manasi", "Nirmala", "Sabita", "Snehalata", "Urmila"]
)
LAST_NAMES = ["Kumar", "Raj", "Naidu", "Reddy", "Nair", "Das", "Behera", "Sahoo",
              "Pillai", "Iyer", "Sharma", "Verma", "Singh", "Gupta", "Rao", "Chandra"]


def _employee_names(n: int) -> list[str]:
    names: list[str] = []
    i = 0
    while len(names) < n:
        first = FIRST_NAMES[i % len(FIRST_NAMES)]
        last = LAST_NAMES[(i // len(FIRST_NAMES)) % len(LAST_NAMES)]
        candidate = f"{first} {last}"
        if candidate not in names:
            names.append(candidate)
        i += 1
    return names


def seed_masters(session: Session) -> dict:
    """Idempotent: safe to call multiple times without duplicating rows."""
    unit_by_code = _get_or_create_units(session)
    _get_or_create_loom_types(session)
    _get_or_create_shifts(session)
    _get_or_create_reason_codes(session)
    _get_or_create_cost_master(session, unit_by_code)
    style_by_code = _get_or_create_styles(session)
    _get_or_create_crimp_reference(session, style_by_code, unit_by_code)
    atm_looms = _get_or_create_atm_looms(session, unit_by_code["ATM"])
    employees = _get_or_create_employees(session, unit_by_code["ATM"])
    _get_or_create_vendor_summaries(session, unit_by_code)
    session.commit()
    return {
        "units": unit_by_code,
        "styles": style_by_code,
        "atm_looms": atm_looms,
        "employees": employees,
    }


def _get_or_create_units(session: Session) -> dict[str, Unit]:
    result = {}
    for u in UNITS:
        existing = session.query(Unit).filter_by(code=u["code"]).one_or_none()
        if existing is None:
            existing = Unit(**u)
            session.add(existing)
            session.flush()
        result[u["code"]] = existing
    return result


def _get_or_create_loom_types(session: Session) -> None:
    for lt in LOOM_TYPES:
        existing = session.query(LoomType).filter_by(loom_type_code=lt["loom_type_code"]).one_or_none()
        if existing is None:
            session.add(LoomType(**lt))
    session.flush()


def _get_or_create_shifts(session: Session) -> None:
    for s in SHIFTS:
        existing = session.query(ShiftMaster).filter_by(code=s["code"]).one_or_none()
        if existing is None:
            session.add(ShiftMaster(**s, scheduled_minutes=480))
    session.flush()


def _get_or_create_reason_codes(session: Session) -> None:
    for code, en, ta, cat in REASON_CODES:
        existing = session.query(ReasonCode).filter_by(code=code).one_or_none()
        if existing is None:
            session.add(ReasonCode(code=code, label_en=en, label_ta=ta, category=cat))
    session.flush()


def _get_or_create_cost_master(session: Session, units: dict[str, Unit]) -> None:
    existing = session.query(CostMaster).filter_by(unit_id=None).one_or_none()
    if existing is None:
        session.add(
            CostMaster(
                unit_id=None,
                effective_from=datetime.date(2026, 1, 1),
                rate_per_kwh=Decimal("8.50"),
                yarn_rate_per_kg=None,
                source=RateSource.ESTIMATED,
            )
        )
    session.flush()


def _get_or_create_styles(session: Session) -> dict[str, Style]:
    result = {}
    for s in STYLES:
        existing = session.query(Style).filter_by(style_code=s["style_code"]).one_or_none()
        if existing is None:
            picks_per_metre = (Decimal(s["picks_per_inch"]) * Decimal("39.3701")).quantize(Decimal("0.001"))
            existing = Style(
                style_code=s["style_code"],
                loom_type_code=s["loom_type_code"],
                warp_ends=s["warp_ends"],
                reed_pick=s["reed_pick"],
                width_inch=s["width_inch"],
                weave_construction=s["weave_construction"],
                picks_per_metre=picks_per_metre,
                std_crimp_pct=s["std_crimp_pct"],
                std_rpm=s["std_rpm"],
                std_efficiency_pct=s["std_efficiency_pct"],
                revenue_per_metre=DEFAULT_REVENUE_PER_METRE,
                revenue_rate_source=RateSource.ESTIMATED,
            )
            session.add(existing)
            session.flush()
        result[s["style_code"]] = existing
    return result


def _get_or_create_crimp_reference(session: Session, styles: dict[str, Style], units: dict[str, Unit]) -> None:
    month = datetime.date(2026, 7, 1)
    for s in STYLES:
        style = styles[s["style_code"]]
        for unit_code, crimp in s["crimp_by_unit"].items():
            unit = units[unit_code]
            existing = (
                session.query(StyleUnitCrimpMonthly)
                .filter_by(style_id=style.style_id, unit_id=unit.unit_id, month=month)
                .one_or_none()
            )
            if existing is None:
                session.add(
                    StyleUnitCrimpMonthly(
                        style_id=style.style_id, unit_id=unit.unit_id, month=month,
                        crimp_pct=crimp, source=RateSource.CONFIRMED,
                    )
                )
    session.flush()


def _get_or_create_atm_looms(session: Session, atm: Unit) -> list[Loom]:
    existing = session.query(Loom).filter_by(unit_id=atm.unit_id).all()
    if existing:
        return existing

    shed_a = Shed(unit_id=atm.unit_id, code="AIRJET", name="Airjet Shed")
    shed_b = Shed(unit_id=atm.unit_id, code="SULZER", name="Sulzer Shed")
    session.add_all([shed_a, shed_b])
    session.flush()

    looms: list[Loom] = []
    for i in range(1, 169):  # 168 airjet
        loom_type = AIRJET_TYPES[i % len(AIRJET_TYPES)]
        looms.append(
            Loom(
                unit_id=atm.unit_id, shed_id=shed_a.shed_id, loom_no=f"AJ-{i:03d}",
                loom_type_code=loom_type, active=True, register_confirmed=False,
                source=DataSource.DEMO,
            )
        )
    for i in range(1, 25):  # 24 Sulzer
        loom_type = SULZER_TYPES[i % len(SULZER_TYPES)]
        looms.append(
            Loom(
                unit_id=atm.unit_id, shed_id=shed_b.shed_id, loom_no=f"SZ-{i:03d}",
                loom_type_code=loom_type, active=True, register_confirmed=False,
                source=DataSource.DEMO,
            )
        )
    session.add_all(looms)
    session.flush()
    return looms


def _get_or_create_employees(session: Session, atm: Unit) -> list[Employee]:
    existing = session.query(Employee).filter_by(unit_id=atm.unit_id).all()
    if existing:
        return existing

    names = _employee_names(TOTAL_EMPLOYEES)
    grades_flat: list[EmployeeGrade | None] = []
    for grade, count in GRADE_COUNTS:
        grades_flat.extend([grade] * count)
    # One employee short of a grade (122 grades / 123 employees, see
    # module docstring) — pad with None, assigned to the last employee.
    grades_flat.extend([None] * (TOTAL_EMPLOYEES - len(grades_flat)))

    employees: list[Employee] = []
    idx = 0
    for role, count in ROLE_COUNTS:
        for _ in range(count):
            grade = grades_flat[idx] if idx < len(grades_flat) else None
            if grade is not None:
                std_looms, std_eff = GRADE_BAND[grade]
            elif role == EmployeeRole.TRAINING_WEAVER:
                std_looms, std_eff = TRAINEE_BAND
            else:
                std_looms, std_eff = (None, None)
            employees.append(
                Employee(
                    unit_id=atm.unit_id,
                    employee_code=f"EMP-{idx + 1:04d}",
                    name=names[idx],
                    role=role,
                    grade=grade,
                    std_looms=std_looms,
                    std_efficiency_pct=std_eff,
                    active=True,
                    source=DataSource.DEMO,
                )
            )
            idx += 1
    session.add_all(employees)
    session.flush()
    return employees


# Real July-2026 Vendor MRM figures. This is the ONLY table populated for
# vendor units in v2 — no per-loom rows are fabricated (design note §1.1).
VENDOR_SUMMARY = {
    "VPN":   {"eff": Decimal("93.9"), "kpd": Decimal("15287"), "mpd": Decimal("8448"),
              "warp_hr": Decimal("0.56"), "weft_hr": Decimal("1.36"),
              "month_kp": Decimal("473905"), "month_m": Decimal("261892"), "rolls": 381},
    "CVF":   {"eff": Decimal("90.6"), "kpd": Decimal("152985"), "mpd": Decimal("66287"),
              "warp_hr": Decimal("0.90"), "weft_hr": Decimal("2.01"),
              "month_kp": Decimal("4742548"), "month_m": Decimal("2054906"), "rolls": 3354},
    "SKT":   {"eff": Decimal("87.2"), "kpd": Decimal("39304"), "mpd": Decimal("16124"),
              "warp_hr": Decimal("0.97"), "weft_hr": Decimal("3.25"),
              "month_kp": Decimal("1218425"), "month_m": Decimal("499839"), "rolls": 1019},
    "METRO": {"eff": Decimal("84.3"), "kpd": Decimal("13662"), "mpd": Decimal("6177"),
              "warp_hr": Decimal("0.81"), "weft_hr": Decimal("0.58"),
              "month_kp": Decimal("423515"), "month_m": Decimal("191497"), "rolls": 277},
    "TPN":   {"eff": Decimal("83.7"), "kpd": Decimal("12074"), "mpd": Decimal("4501"),
              "warp_hr": Decimal("0.72"), "weft_hr": Decimal("0.92"),
              "month_kp": Decimal("374280"), "month_m": Decimal("139530"), "rolls": 255},
}


def _get_or_create_vendor_summaries(session: Session, units: dict[str, Unit]) -> None:
    month = datetime.date(2026, 7, 1)
    for code, data in VENDOR_SUMMARY.items():
        unit = units[code]
        existing = (
            session.query(VendorUnitMonthlySummary)
            .filter_by(unit_id=unit.unit_id, month=month)
            .one_or_none()
        )
        if existing is None:
            session.add(
                VendorUnitMonthlySummary(
                    unit_id=unit.unit_id, month=month,
                    efficiency_pct=data["eff"],
                    kilo_picks_day_avg=data["kpd"], metres_day_avg=data["mpd"],
                    warp_breaks_per_hr=data["warp_hr"], weft_breaks_per_hr=data["weft_hr"],
                    month_kilo_picks=data["month_kp"], month_metres=data["month_m"],
                    month_rolls=data["rolls"], source="CSV_IMPORT",
                )
            )
    session.flush()
