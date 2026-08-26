# Loom AI — FastAPI REST API Documentation

The Loom AI API delivers deterministic analytics for plant managers across three core operational questions:
- **Q1**: Production vs Target Variance (`/api/production/variance`)
- **Q5**: Breakdown & Downtime Rankings (`/api/breakdown/ranking`)
- **Q21**: Revenue & Loss Summary (`/api/revenue/summary`)
- **Assistant**: Natural Language Q&A Router (`/api/ask`)

---

## 1. Architectural Contract

```
Client (Next.js / cURL)
        ↓
FastAPI Router (app/routers/)
        ↓
Service Layer (app/services/)
        ↓
Deterministic Analytics Engine (app/analytics/)
        ↓
PostgreSQL Database
```

* **No LLM Math**: Metrics and percentages are computed purely by deterministic Python/SQL functions.
* **Standard Envelope**: Every successful response provides `data`, `metadata`, and `data_quality`.
* **Consistent Errors**: All error responses return `{ "error": { "code": "...", "message": "...", "details": {} } }`.

---

## 2. API Endpoints

### Health Check

* **`GET /health`** or **`GET /api/health`**
* **Response `200 OK`**:
  ```json
  {
    "status": "healthy",
    "database": "connected"
  }
  ```

---

### Q1 — Production vs Target

* **`GET /api/production/variance`**
* **Query Parameters**:
  | Parameter | Type | Required | Description |
  |---|---|---|---|
  | `date` | string | No | `YYYY-MM-DD` (defaults to latest date in database) |
  | `department` | string | No | Filter by department (e.g. `Weaving`, `Spinning`) |
  | `machine_type` | string | No | Filter by machine type (e.g. `Toyota`, `RingFrame`) |
  | `machine_id` | string | No | Filter by machine ID (e.g. `TOY-01`, `RF-11`) |
  | `shift` | integer | No | Filter by shift (`1`, `2`, or `3`) |

* **Success Response `200 OK`**:
  ```json
  {
    "data": {
      "has_data": true,
      "summary": {
        "date": "2026-08-29",
        "total_target": 1888200.0,
        "total_actual": 1765471.0,
        "variance_qty": -122729.0,
        "variance_pct": -6.5,
        "average_efficiency": 93.5,
        "previous_day_actual": 1761895.0,
        "change_vs_previous_day_pct": 0.2
      },
      "machine_performance": [
        {
          "machine_id": "TOY-08",
          "machine_type": "Toyota",
          "department": "Weaving",
          "granularity": "synthetic_loom_number",
          "target": 65100.0,
          "actual": 49971.0,
          "variance": -15129.0,
          "efficiency": 76.76,
          "performance_status": "CRITICAL",
          "evidence": { "production_log_ids": [15878, 15908, 15938] }
        }
      ],
      "shift_performance": [
        { "shift": 1, "target": 629400.0, "actual": 589718.0, "variance": -39682.0, "efficiency": 93.7 },
        { "shift": 2, "target": 629400.0, "actual": 587638.0, "variance": -41762.0, "efficiency": 93.36 },
        { "shift": 3, "target": 629400.0, "actual": 588115.0, "variance": -41285.0, "efficiency": 93.44 }
      ],
      "previous_day_comparison": {
        "current_date": "2026-08-29",
        "previous_date": "2026-08-28",
        "current_actual": 1765471.0,
        "previous_actual": 1761895.0,
        "change_qty": 3576.0,
        "change_pct": 0.2
      }
    },
    "metadata": {
      "date": "2026-08-29",
      "generated_at": "2026-08-26T20:55:00Z",
      "dataset": "synthetic",
      "source_type": "synthetic"
    },
    "data_quality": {
      "records_analyzed": 177,
      "machines_counted": 59,
      "is_demo": true,
      "dataset_label": "Synthetic Grounded Factory V1"
    }
  }
  ```

---

### Q5 — Breakdown & Downtime

* **`GET /api/breakdown/ranking`**
* **Query Parameters**:
  | Parameter | Type | Required | Description |
  |---|---|---|---|
  | `period` | string | No | `today` (default) or `month` |
  | `date` | string | No | `YYYY-MM-DD` |
  | `department` | string | No | Filter by department |
  | `machine_type` | string | No | Filter by machine type |
  | `machine_id` | string | No | Filter by machine ID |

* **Success Response `200 OK`**:
  ```json
  {
    "data": {
      "has_data": true,
      "period_info": { "period": "today", "start_date": "2026-08-29", "end_date": "2026-08-29" },
      "total_downtime_minutes": 2698,
      "total_events": 42,
      "highest_downtime_machine": {
        "machine_id": "SUL-04",
        "machine_type": "Sulzer",
        "department": "Weaving",
        "granularity": "synthetic_loom_number",
        "event_count": 4,
        "downtime_minutes": 416,
        "average_event_duration": 104.0,
        "percentage_of_total_downtime": 15.42,
        "evidence": { "breakdown_event_ids": [2167, 2170, 4343] }
      },
      "lowest_downtime_machine": {
        "machine_id": "TSU-01",
        "downtime_minutes": 14,
        "percentage_of_total_downtime": 0.52
      },
      "reason_ranking": [
        { "reason": "Full cleaning work", "event_count": 10, "total_downtime_minutes": 1064 },
        { "reason": "Bobbin shortage", "event_count": 6, "total_downtime_minutes": 526 }
      ],
      "recurring_reasons": [
        { "reason": "Full cleaning work", "event_count": 10, "total_downtime_minutes": 1064 }
      ]
    },
    "metadata": {
      "date": "2026-08-29",
      "period": "today",
      "generated_at": "2026-08-26T20:55:00Z",
      "dataset": "synthetic"
    },
    "data_quality": {
      "records_analyzed": 42,
      "is_demo": true,
      "dataset_label": "Synthetic Grounded Factory V1"
    }
  }
  ```

---

### Q21 — Revenue & Loss

* **`GET /api/revenue/summary`**
* **Query Parameters**:
  | Parameter | Type | Required | Description |
  |---|---|---|---|
  | `date` | string | No | `YYYY-MM-DD` |
  | `department` | string | No | Filter by department |
  | `machine_id` | string | No | Filter by machine ID |
  | `fabric_style` | string | No | Filter by fabric style |

* **Success Response `200 OK`**:
  ```json
  {
    "data": {
      "has_data": true,
      "summary": {
        "date": "2026-08-29",
        "today_revenue": 592446.2,
        "mtd_revenue": 17259235.26,
        "previous_day_revenue": 580573.48,
        "change_vs_previous_day_pct": 2.04,
        "mtd_start_date": "2026-08-01"
      },
      "best_machine": { "machine_id": "TOY-01", "total_revenue": 29644.36, "percentage_of_total": 5.0 },
      "worst_machine": { "machine_id": "SUL-03", "total_revenue": 3100.34, "percentage_of_total": 0.52 },
      "best_style": { "fabric_style": "Liveaco Compact", "total_revenue": 235393.6, "percentage_of_total": 39.73 },
      "worst_style": { "fabric_style": "Excel Slub", "total_revenue": 174838.18, "percentage_of_total": 29.51 },
      "revenue_loss": {
        "revenue_loss_available": false,
        "reason": "Deterministic revenue loss calculation requires standard order book rates, contracted delivery penalties, and margin profiles per loom. Raw production logs do not record customer pricing commitments. To maintain trust and avoid fabricating numbers, revenue loss is marked unavailable."
      }
    },
    "metadata": {
      "date": "2026-08-29",
      "generated_at": "2026-08-26T20:55:00Z",
      "dataset": "synthetic",
      "source_type": "derived"
    },
    "data_quality": {
      "records_analyzed": 180,
      "is_demo": true,
      "dataset_label": "Synthetic Grounded Factory V1"
    }
  }
  ```

---

### Natural Language Assistant (/api/ask)

* **`POST /api/ask`**
* **Request Body**:
  ```json
  {
    "question": "Which machine had the highest downtime today?",
    "date": "2026-08-29"
  }
  ```

* **Success Response `200 OK`**:
  ```json
  {
    "intent": "Q5_BREAKDOWN",
    "question": "Which machine had the highest downtime today?",
    "answer_payload": { ... },
    "metadata": { ... },
    "data_quality": { ... },
    "narration": "Deterministic metrics retrieved. LLM narration integration will be enabled in Phase 3."
  }
  ```

---

## 3. Error Responses

All error responses strictly adhere to the structured error envelope:

### Invalid Date Format (`400 Bad Request`)
```json
{
  "error": {
    "code": "INVALID_DATE_FORMAT",
    "message": "Invalid date '2026-99-99'. Expected YYYY-MM-DD format (e.g. 2026-08-29).",
    "details": {}
  }
}
```

### Invalid Period (`400 Bad Request`)
```json
{
  "error": {
    "code": "INVALID_PERIOD",
    "message": "Invalid period 'decade'. Allowed values are 'today' or 'month'.",
    "details": {}
  }
}
```

### Request Validation Failure (`422 Unprocessable Entity`)
```json
{
  "error": {
    "code": "REQUEST_VALIDATION_ERROR",
    "message": "Invalid request parameter or payload structure.",
    "details": {
      "validation_errors": [
        {
          "field": "body -> question",
          "message": "String should have at least 2 characters",
          "type": "string_too_short"
        }
      ]
    }
  }
}
```

---

## 4. Running the API Locally

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Interactive OpenAPI Docs:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
