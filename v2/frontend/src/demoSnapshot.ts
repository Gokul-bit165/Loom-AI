// Authentic factory dataset snapshot from Ashok Textile Mills (July 31, 2026)
// Embedded to provide instantaneous 0-latency demo execution on Netlify / Vercel without backend dependency.
export const demoSnapshot: any = {
  "productionIntelligence": {
    "unit_code": "ATM",
    "work_date": "2026-07-31",
    "today_position": {
      "data_available": true,
      "work_date": "2026-07-31",
      "unit_code": "ATM",
      "primary_kpis": {
        "target_metres": 50018.7,
        "actual_metres": 49748.8,
        "gap_metres": -269.9,
        "gap_pct": -0.54,
        "efficiency_pct": 89.26,
        "running_efficiency_pct": 97.05
      },
      "supporting_metrics": {
        "kilo_picks": 107547.6,
        "actual_picks": 107547581,
        "warp_breaks": 3632,
        "weft_breaks": 10406,
        "total_breaks": 14038,
        "breaks_per_1000_picks": 0.13,
        "active_looms_count": 192,
        "total_running_minutes": 253486,
        "total_stopped_minutes": 22994
      },
      "yesterday_comparison": {
        "yesterday_date": "2026-07-30",
        "yesterday_metres": 50500.0,
        "yesterday_efficiency_pct": 90.83,
        "delta_metres": -751.2,
        "delta_pct": -1.49,
        "delta_efficiency_pp": -1.57
      },
      "triage_summary": {
        "total_looms": 192,
        "attention_count": 45,
        "critical_count": 19,
        "critical_loom_ids": [
          3,
          20,
          23,
          33,
          43,
          51,
          69,
          76,
          88,
          92,
          118,
          132,
          138,
          146,
          148,
          154,
          177,
          178,
          192
        ],
        "attention_loom_ids": [
          6,
          7,
          21,
          25,
          28,
          32,
          41,
          48,
          50,
          54,
          64,
          71,
          72,
          75,
          79,
          80,
          81,
          82,
          96,
          110,
          117,
          127,
          128,
          129,
          130,
          135,
          147,
          150,
          170,
          172,
          173,
          176,
          179,
          180,
          181,
          182,
          183,
          184,
          185,
          186,
          187,
          188,
          189,
          190,
          191
        ]
      },
      "provenance": {
        "actual_metres": "ACTUAL",
        "actual_picks": "ACTUAL",
        "target_metres": "CALCULATED",
        "efficiency_pct": "CALCULATED",
        "variance": "CALCULATED"
      },
      "data_availability": {
        "q1_today": "AVAILABLE",
        "quality_score_pct": 98.6,
        "records_counted": 576
      }
    },
    "situation_verdict": {
      "verdict_sentence": "Production is slightly below plan by 0.5% (270 m). Asset efficiency is 89.3%.",
      "status": "ATTENTION",
      "dominant_drivers": [
        "Downtime (Stoppages) (61.5%)",
        "Weft Repair & Feeder Stops (15.0%)",
        "Speed & Running Efficiency Gap (21.7%)"
      ],
      "primary_issue": "Downtime (Stoppages)"
    },
    "act_now_queue": [
      {
        "loom_id": 132,
        "loom_no": "AJ-132",
        "loom_type": "810",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "actual_metres": 238.0,
        "target_metres": 285.3,
        "lost_metres": 47.3,
        "efficiency_pct": 75.1,
        "stopped_minutes": 328,
        "warp_breaks": 67,
        "weft_breaks": 91,
        "problem": "High downtime (Electrical/Drive)",
        "revenue_exposure_inr": 1892.78,
        "action": "Inspect electrical drive & relay",
        "action_verb": "Inspect Now",
        "priority": 1
      },
      {
        "loom_id": 118,
        "loom_no": "AJ-118",
        "loom_type": "810",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "actual_metres": 240.2,
        "target_metres": 285.3,
        "lost_metres": 45.1,
        "efficiency_pct": 75.8,
        "stopped_minutes": 312,
        "warp_breaks": 54,
        "weft_breaks": 92,
        "problem": "High downtime (Electrical/Drive)",
        "revenue_exposure_inr": 1802.58,
        "action": "Inspect electrical drive & relay",
        "action_verb": "Inspect Now",
        "priority": 2
      },
      {
        "loom_id": 146,
        "loom_no": "AJ-146",
        "loom_type": "810",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "actual_metres": 244.4,
        "target_metres": 285.3,
        "lost_metres": 40.9,
        "efficiency_pct": 77.1,
        "stopped_minutes": 277,
        "warp_breaks": 44,
        "weft_breaks": 83,
        "problem": "High downtime (Electrical/Drive)",
        "revenue_exposure_inr": 1637.34,
        "action": "Inspect electrical drive & relay",
        "action_verb": "Inspect Now",
        "priority": 3
      }
    ],
    "top_losses_all": [
      {
        "loom_id": 132,
        "loom_no": "AJ-132",
        "loom_type": "810",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "actual_metres": 238.0,
        "target_metres": 285.3,
        "lost_metres": 47.3,
        "efficiency_pct": 75.1,
        "stopped_minutes": 328,
        "warp_breaks": 67,
        "weft_breaks": 91,
        "problem": "High downtime (Electrical/Drive)",
        "revenue_exposure_inr": 1892.78,
        "action": "Inspect electrical drive & relay",
        "action_verb": "Inspect Now",
        "priority": 1
      },
      {
        "loom_id": 118,
        "loom_no": "AJ-118",
        "loom_type": "810",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "actual_metres": 240.2,
        "target_metres": 285.3,
        "lost_metres": 45.1,
        "efficiency_pct": 75.8,
        "stopped_minutes": 312,
        "warp_breaks": 54,
        "weft_breaks": 92,
        "problem": "High downtime (Electrical/Drive)",
        "revenue_exposure_inr": 1802.58,
        "action": "Inspect electrical drive & relay",
        "action_verb": "Inspect Now",
        "priority": 2
      },
      {
        "loom_id": 146,
        "loom_no": "AJ-146",
        "loom_type": "810",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "actual_metres": 244.4,
        "target_metres": 285.3,
        "lost_metres": 40.9,
        "efficiency_pct": 77.1,
        "stopped_minutes": 277,
        "warp_breaks": 44,
        "weft_breaks": 83,
        "problem": "High downtime (Electrical/Drive)",
        "revenue_exposure_inr": 1637.34,
        "action": "Inspect electrical drive & relay",
        "action_verb": "Inspect Now",
        "priority": 3
      },
      {
        "loom_id": 43,
        "loom_no": "AJ-043",
        "loom_type": "910",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "actual_metres": 244.4,
        "target_metres": 285.3,
        "lost_metres": 40.9,
        "efficiency_pct": 77.1,
        "stopped_minutes": 301,
        "warp_breaks": 42,
        "weft_breaks": 76,
        "problem": "High downtime (Electrical/Drive)",
        "revenue_exposure_inr": 1636.18,
        "action": "Inspect electrical drive & relay",
        "action_verb": "Inspect Now",
        "priority": 4
      },
      {
        "loom_id": 51,
        "loom_no": "AJ-051",
        "loom_type": "910",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "actual_metres": 247.0,
        "target_metres": 285.3,
        "lost_metres": 38.3,
        "efficiency_pct": 77.9,
        "stopped_minutes": 274,
        "warp_breaks": 58,
        "weft_breaks": 72,
        "problem": "High downtime (Electrical/Drive)",
        "revenue_exposure_inr": 1532.9,
        "action": "Inspect electrical drive & relay",
        "action_verb": "Inspect Now",
        "priority": 5
      }
    ],
    "potential_recovery": {
      "target_gap_metres": 212.5,
      "recoverable_metres": 110.5,
      "recoverable_inr": 4420.0,
      "top_opportunity_loom": "AJ-132",
      "top_opportunity_action": "Inspect electrical drive & relay",
      "confidence": "HIGH (Constrained by shift feasible operating envelope)"
    },
    "shortfall_decomposition": {
      "data_available": true,
      "target_gap_metres": 269.9,
      "categories": [
        {
          "name": "Downtime (Stoppages)",
          "share_pct": 61.5,
          "description": "Unplanned electrical and mechanical stoppage duration.",
          "affected_looms": [
            "AJ-020",
            "AJ-020",
            "AJ-020"
          ],
          "affected_looms_count": 192,
          "primary_issue": "Electrical relay trips & main drive stops"
        },
        {
          "name": "Weft Repair & Feeder Stops",
          "share_pct": 15.0,
          "description": "Accumulated insertion misfires, nozzle pressure drops, and feeder faults.",
          "affected_looms": [
            "AJ-116",
            "AJ-014",
            "AJ-103"
          ],
          "affected_looms_count": 66,
          "primary_issue": "Feeder synchronization & yarn tension irregularities"
        },
        {
          "name": "Speed & Running Efficiency Gap",
          "share_pct": 21.7,
          "description": "Output lost while running below standard design speed or lot transition.",
          "affected_looms": [
            "SZ-024",
            "SZ-010",
            "AJ-020"
          ],
          "affected_looms_count": 8,
          "primary_issue": "Sub-optimal reed speed & heavy pick density load"
        },
        {
          "name": "Warp Breaks & Other Stoppages",
          "share_pct": 5.0,
          "description": "Warp tie-in delays, beam knotting, and minor operator adjustments.",
          "affected_looms": [
            "AJ-111",
            "AJ-069",
            "AJ-102"
          ],
          "affected_looms_count": 33,
          "primary_issue": "Warp end tie-in duration above factory standard"
        }
      ]
    },
    "ai_insight_lead": {
      "headline": "AJ-132 is today's largest recoverable production drag.",
      "summary": "High downtime (Electrical/Drive) has created \u20b91,893 in revenue exposure. Intervention can recover up to 110 m today.",
      "entity_id": "AJ-132",
      "context_type": "LOOM",
      "action_required": true
    },
    "data_availability": {
      "q1_today": "AVAILABLE",
      "quality_score_pct": 98.6,
      "records_counted": 576
    }
  },
  "productionPerformance": {
    "unit_code": "ATM",
    "work_date": "2026-07-31",
    "loom_performance": {
      "top_output_looms": [
        {
          "loom_id": 13,
          "loom_no": "AJ-013",
          "loom_type": "910",
          "style_code": "20s OE X 21s Cotton Flax /56X44-63\" Plain",
          "actual_metres": 353.3,
          "target_metres": 347.2,
          "variance_metres": 6.0,
          "efficiency_pct": 90.5,
          "std_efficiency_pct": 89.0,
          "efficiency_gap_pp": -1.5,
          "stopped_minutes": 96,
          "warp_breaks": 12,
          "weft_breaks": 45,
          "opportunity_score": 0.0
        },
        {
          "loom_id": 162,
          "loom_no": "AJ-162",
          "loom_type": "810",
          "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
          "actual_metres": 303.3,
          "target_metres": 285.3,
          "variance_metres": 18.0,
          "efficiency_pct": 95.7,
          "std_efficiency_pct": 90.0,
          "efficiency_gap_pp": -5.7,
          "stopped_minutes": 20,
          "warp_breaks": 19,
          "weft_breaks": 54,
          "opportunity_score": 0.0
        },
        {
          "loom_id": 10,
          "loom_no": "AJ-010",
          "loom_type": "810",
          "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
          "actual_metres": 302.3,
          "target_metres": 285.3,
          "variance_metres": 17.0,
          "efficiency_pct": 95.4,
          "std_efficiency_pct": 90.0,
          "efficiency_gap_pp": -5.4,
          "stopped_minutes": 16,
          "warp_breaks": 12,
          "weft_breaks": 42,
          "opportunity_score": 0.0
        },
        {
          "loom_id": 47,
          "loom_no": "AJ-047",
          "loom_type": "910",
          "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
          "actual_metres": 302.3,
          "target_metres": 285.3,
          "variance_metres": 17.0,
          "efficiency_pct": 95.4,
          "std_efficiency_pct": 90.0,
          "efficiency_gap_pp": -5.4,
          "stopped_minutes": 34,
          "warp_breaks": 15,
          "weft_breaks": 51,
          "opportunity_score": 0.0
        },
        {
          "loom_id": 84,
          "loom_no": "AJ-084",
          "loom_type": "810",
          "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
          "actual_metres": 301.9,
          "target_metres": 285.3,
          "variance_metres": 16.6,
          "efficiency_pct": 95.2,
          "std_efficiency_pct": 90.0,
          "efficiency_gap_pp": -5.2,
          "stopped_minutes": 34,
          "warp_breaks": 17,
          "weft_breaks": 43,
          "opportunity_score": 0.0
        }
      ],
      "bottom_output_looms": [
        {
          "loom_id": 177,
          "loom_no": "SZ-009",
          "loom_type": "280",
          "style_code": "30s VSF Slub X 30s VSF Slub /90X68-63\" Plain",
          "actual_metres": 66.0,
          "target_metres": 71.2,
          "variance_metres": -5.2,
          "efficiency_pct": 79.7,
          "std_efficiency_pct": 86.0,
          "efficiency_gap_pp": 6.3,
          "stopped_minutes": 255,
          "warp_breaks": 22,
          "weft_breaks": 51,
          "opportunity_score": 5.4
        },
        {
          "loom_id": 170,
          "loom_no": "SZ-002",
          "loom_type": "TS",
          "style_code": "30s VSF Slub X 30s VSF Slub /90X68-63\" Plain",
          "actual_metres": 70.0,
          "target_metres": 71.2,
          "variance_metres": -1.3,
          "efficiency_pct": 84.5,
          "std_efficiency_pct": 86.0,
          "efficiency_gap_pp": 1.5,
          "stopped_minutes": 173,
          "warp_breaks": 12,
          "weft_breaks": 47,
          "opportunity_score": 0.9
        },
        {
          "loom_id": 182,
          "loom_no": "SZ-014",
          "loom_type": "TS",
          "style_code": "30s VSF Slub X 30s VSF Slub /90X68-63\" Plain",
          "actual_metres": 71.7,
          "target_metres": 71.2,
          "variance_metres": 0.4,
          "efficiency_pct": 86.5,
          "std_efficiency_pct": 86.0,
          "efficiency_gap_pp": -0.5,
          "stopped_minutes": 144,
          "warp_breaks": 15,
          "weft_breaks": 51,
          "opportunity_score": 0.0
        },
        {
          "loom_id": 190,
          "loom_no": "SZ-022",
          "loom_type": "TS",
          "style_code": "30s VSF Slub X 30s VSF Slub /90X68-63\" Plain",
          "actual_metres": 72.0,
          "target_metres": 71.2,
          "variance_metres": 0.7,
          "efficiency_pct": 86.9,
          "std_efficiency_pct": 86.0,
          "efficiency_gap_pp": -0.9,
          "stopped_minutes": 156,
          "warp_breaks": 8,
          "weft_breaks": 48,
          "opportunity_score": 0.0
        },
        {
          "loom_id": 186,
          "loom_no": "SZ-018",
          "loom_type": "TS",
          "style_code": "30s VSF Slub X 30s VSF Slub /90X68-63\" Plain",
          "actual_metres": 72.6,
          "target_metres": 71.2,
          "variance_metres": 1.4,
          "efficiency_pct": 87.7,
          "std_efficiency_pct": 86.0,
          "efficiency_gap_pp": -1.7,
          "stopped_minutes": 144,
          "warp_breaks": 6,
          "weft_breaks": 54,
          "opportunity_score": 0.0
        }
      ],
      "top_efficiency_looms": [
        {
          "loom_id": 162,
          "loom_no": "AJ-162",
          "loom_type": "810",
          "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
          "actual_metres": 303.3,
          "target_metres": 285.3,
          "variance_metres": 18.0,
          "efficiency_pct": 95.7,
          "std_efficiency_pct": 90.0,
          "efficiency_gap_pp": -5.7,
          "stopped_minutes": 20,
          "warp_breaks": 19,
          "weft_breaks": 54,
          "opportunity_score": 0.0
        },
        {
          "loom_id": 10,
          "loom_no": "AJ-010",
          "loom_type": "810",
          "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
          "actual_metres": 302.3,
          "target_metres": 285.3,
          "variance_metres": 17.0,
          "efficiency_pct": 95.4,
          "std_efficiency_pct": 90.0,
          "efficiency_gap_pp": -5.4,
          "stopped_minutes": 16,
          "warp_breaks": 12,
          "weft_breaks": 42,
          "opportunity_score": 0.0
        },
        {
          "loom_id": 47,
          "loom_no": "AJ-047",
          "loom_type": "910",
          "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
          "actual_metres": 302.3,
          "target_metres": 285.3,
          "variance_metres": 17.0,
          "efficiency_pct": 95.4,
          "std_efficiency_pct": 90.0,
          "efficiency_gap_pp": -5.4,
          "stopped_minutes": 34,
          "warp_breaks": 15,
          "weft_breaks": 51,
          "opportunity_score": 0.0
        },
        {
          "loom_id": 84,
          "loom_no": "AJ-084",
          "loom_type": "810",
          "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
          "actual_metres": 301.9,
          "target_metres": 285.3,
          "variance_metres": 16.6,
          "efficiency_pct": 95.2,
          "std_efficiency_pct": 90.0,
          "efficiency_gap_pp": -5.2,
          "stopped_minutes": 34,
          "warp_breaks": 17,
          "weft_breaks": 43,
          "opportunity_score": 0.0
        },
        {
          "loom_id": 153,
          "loom_no": "AJ-153",
          "loom_type": "910",
          "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
          "actual_metres": 300.2,
          "target_metres": 285.3,
          "variance_metres": 14.9,
          "efficiency_pct": 94.7,
          "std_efficiency_pct": 90.0,
          "efficiency_gap_pp": -4.7,
          "stopped_minutes": 6,
          "warp_breaks": 10,
          "weft_breaks": 37,
          "opportunity_score": 0.0
        }
      ],
      "bottom_efficiency_looms": [
        {
          "loom_id": 20,
          "loom_no": "AJ-020",
          "loom_type": "810",
          "style_code": "60s Excel X 40s Vortex /165X110-133\" 4/1 Satin",
          "actual_metres": 97.9,
          "target_metres": 114.7,
          "variance_metres": -16.8,
          "efficiency_pct": 71.7,
          "std_efficiency_pct": 84.0,
          "efficiency_gap_pp": 12.3,
          "stopped_minutes": 374,
          "warp_breaks": 31,
          "weft_breaks": 84,
          "opportunity_score": 12.3
        },
        {
          "loom_id": 132,
          "loom_no": "AJ-132",
          "loom_type": "810",
          "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
          "actual_metres": 238.0,
          "target_metres": 285.3,
          "variance_metres": -47.3,
          "efficiency_pct": 75.1,
          "std_efficiency_pct": 90.0,
          "efficiency_gap_pp": 14.9,
          "stopped_minutes": 328,
          "warp_breaks": 67,
          "weft_breaks": 91,
          "opportunity_score": 14.9
        },
        {
          "loom_id": 192,
          "loom_no": "SZ-024",
          "loom_type": "340",
          "style_code": "30s VSF X 30s VOT /68X57-48\" Plain",
          "actual_metres": 78.3,
          "target_metres": 90.1,
          "variance_metres": -11.7,
          "efficiency_pct": 75.7,
          "std_efficiency_pct": 87.0,
          "efficiency_gap_pp": 11.3,
          "stopped_minutes": 312,
          "warp_breaks": 49,
          "weft_breaks": 91,
          "opportunity_score": 11.3
        },
        {
          "loom_id": 118,
          "loom_no": "AJ-118",
          "loom_type": "810",
          "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
          "actual_metres": 240.2,
          "target_metres": 285.3,
          "variance_metres": -45.1,
          "efficiency_pct": 75.8,
          "std_efficiency_pct": 90.0,
          "efficiency_gap_pp": 14.2,
          "stopped_minutes": 312,
          "warp_breaks": 54,
          "weft_breaks": 92,
          "opportunity_score": 14.2
        },
        {
          "loom_id": 43,
          "loom_no": "AJ-043",
          "loom_type": "910",
          "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
          "actual_metres": 244.4,
          "target_metres": 285.3,
          "variance_metres": -40.9,
          "efficiency_pct": 77.1,
          "std_efficiency_pct": 90.0,
          "efficiency_gap_pp": 12.9,
          "stopped_minutes": 301,
          "warp_breaks": 42,
          "weft_breaks": 76,
          "opportunity_score": 12.9
        }
      ],
      "potential_improvement_opportunities": [
        {
          "loom_id": 132,
          "loom_no": "AJ-132",
          "loom_type": "810",
          "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
          "actual_metres": 238.0,
          "target_metres": 285.3,
          "variance_metres": -47.3,
          "efficiency_pct": 75.1,
          "std_efficiency_pct": 90.0,
          "efficiency_gap_pp": 14.9,
          "stopped_minutes": 328,
          "warp_breaks": 67,
          "weft_breaks": 91,
          "opportunity_score": 14.9
        },
        {
          "loom_id": 118,
          "loom_no": "AJ-118",
          "loom_type": "810",
          "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
          "actual_metres": 240.2,
          "target_metres": 285.3,
          "variance_metres": -45.1,
          "efficiency_pct": 75.8,
          "std_efficiency_pct": 90.0,
          "efficiency_gap_pp": 14.2,
          "stopped_minutes": 312,
          "warp_breaks": 54,
          "weft_breaks": 92,
          "opportunity_score": 14.2
        },
        {
          "loom_id": 43,
          "loom_no": "AJ-043",
          "loom_type": "910",
          "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
          "actual_metres": 244.4,
          "target_metres": 285.3,
          "variance_metres": -40.9,
          "efficiency_pct": 77.1,
          "std_efficiency_pct": 90.0,
          "efficiency_gap_pp": 12.9,
          "stopped_minutes": 301,
          "warp_breaks": 42,
          "weft_breaks": 76,
          "opportunity_score": 12.9
        },
        {
          "loom_id": 20,
          "loom_no": "AJ-020",
          "loom_type": "810",
          "style_code": "60s Excel X 40s Vortex /165X110-133\" 4/1 Satin",
          "actual_metres": 97.9,
          "target_metres": 114.7,
          "variance_metres": -16.8,
          "efficiency_pct": 71.7,
          "std_efficiency_pct": 84.0,
          "efficiency_gap_pp": 12.3,
          "stopped_minutes": 374,
          "warp_breaks": 31,
          "weft_breaks": 84,
          "opportunity_score": 12.3
        },
        {
          "loom_id": 3,
          "loom_no": "AJ-003",
          "loom_type": "910",
          "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
          "actual_metres": 247.1,
          "target_metres": 285.3,
          "variance_metres": -38.2,
          "efficiency_pct": 78.0,
          "std_efficiency_pct": 90.0,
          "efficiency_gap_pp": 12.0,
          "stopped_minutes": 304,
          "warp_breaks": 49,
          "weft_breaks": 99,
          "opportunity_score": 12.0
        }
      ],
      "total_looms_evaluated": 192
    },
    "weaver_performance": {
      "top_weavers": [
        {
          "employee_id": 20,
          "name": "Vasanthi Kumar",
          "code": "EMP-0020",
          "grade": "G1_PLUS",
          "looms_handled": 4,
          "assigned_hours": 96.0,
          "total_metres": 1176.8,
          "efficiency_pct": 92.8,
          "performance_label": "Strong Performer",
          "category": "STRONG"
        },
        {
          "employee_id": 34,
          "name": "Pooja Kumar",
          "code": "EMP-0034",
          "grade": "G1_PLUS",
          "looms_handled": 4,
          "assigned_hours": 96.0,
          "total_metres": 1173.5,
          "efficiency_pct": 92.6,
          "performance_label": "Strong Performer",
          "category": "STRONG"
        },
        {
          "employee_id": 35,
          "name": "Rekha Kumar",
          "code": "EMP-0035",
          "grade": "G1_PLUS",
          "looms_handled": 4,
          "assigned_hours": 96.0,
          "total_metres": 1171.9,
          "efficiency_pct": 92.4,
          "performance_label": "Strong Performer",
          "category": "STRONG"
        },
        {
          "employee_id": 21,
          "name": "Devi Kumar",
          "code": "EMP-0021",
          "grade": "G1_PLUS",
          "looms_handled": 4,
          "assigned_hours": 96.0,
          "total_metres": 1168.4,
          "efficiency_pct": 92.1,
          "performance_label": "Strong Performer",
          "category": "STRONG"
        },
        {
          "employee_id": 15,
          "name": "Sundar Kumar",
          "code": "EMP-0015",
          "grade": "G1_PLUS",
          "looms_handled": 4,
          "assigned_hours": 96.0,
          "total_metres": 1162.4,
          "efficiency_pct": 91.7,
          "performance_label": "Stable Performer",
          "category": "STABLE"
        }
      ],
      "attention_required_weavers": [
        {
          "employee_id": 67,
          "name": "Ganesan Raj",
          "code": "EMP-0067",
          "grade": "G2",
          "looms_handled": 5,
          "assigned_hours": 120.0,
          "total_metres": 1254.4,
          "efficiency_pct": 87.7,
          "performance_label": "Needs Review",
          "category": "NEEDS_REVIEW"
        },
        {
          "employee_id": 26,
          "name": "Vijay Kumar",
          "code": "EMP-0026",
          "grade": "G1_PLUS",
          "looms_handled": 4,
          "assigned_hours": 96.0,
          "total_metres": 1110.0,
          "efficiency_pct": 87.5,
          "performance_label": "Needs Review",
          "category": "NEEDS_REVIEW"
        },
        {
          "employee_id": 2,
          "name": "Karthik Kumar",
          "code": "EMP-0002",
          "grade": "G1_PLUS",
          "looms_handled": 4,
          "assigned_hours": 96.0,
          "total_metres": 1107.3,
          "efficiency_pct": 87.3,
          "performance_label": "Needs Review",
          "category": "NEEDS_REVIEW"
        },
        {
          "employee_id": 37,
          "name": "Meera Kumar",
          "code": "EMP-0037",
          "grade": "G1_PLUS",
          "looms_handled": 4,
          "assigned_hours": 96.0,
          "total_metres": 356.8,
          "efficiency_pct": 87.3,
          "performance_label": "Needs Review",
          "category": "NEEDS_REVIEW"
        },
        {
          "employee_id": 40,
          "name": "Debasis Kumar",
          "code": "EMP-0040",
          "grade": "G1_PLUS",
          "looms_handled": 4,
          "assigned_hours": 96.0,
          "total_metres": 374.4,
          "efficiency_pct": 87.1,
          "performance_label": "Needs Review",
          "category": "NEEDS_REVIEW"
        }
      ],
      "total_qualified": 46,
      "unqualified_count": 1
    }
  },
  "productionShifts": {
    "unit_code": "ATM",
    "work_date": "2026-07-31",
    "shifts": [
      {
        "shift_id": 1,
        "shift_code": "1",
        "start_time": "06:00",
        "end_time": "14:00",
        "target_metres": 16672.9,
        "actual_metres": 16543.8,
        "variance_metres": -129.1,
        "variance_pct": -0.77,
        "efficiency_pct": 89.04,
        "target_efficiency_pct": 89.44,
        "attainment_pct": 99.23,
        "target_picks": 36060325,
        "actual_picks": 35762995,
        "target_pace_m_per_hr": 2084.1,
        "actual_pace_m_per_hr": 2068.0,
        "target_metres_per_loom": 86.8,
        "actual_metres_per_loom": 86.2,
        "scheduled_minutes": 92160,
        "running_minutes": 84276,
        "stopped_minutes": 7884,
        "target_running_minutes": 82428,
        "allowable_stopped_minutes": 9732,
        "warp_breaks": 1193,
        "weft_breaks": 3448,
        "total_breaks": 4641,
        "looms_reported": 192,
        "supervisor_name": "M. Kumar (Shift Lead)"
      },
      {
        "shift_id": 2,
        "shift_code": "2",
        "start_time": "14:00",
        "end_time": "22:00",
        "target_metres": 16672.9,
        "actual_metres": 16872.6,
        "variance_metres": 199.7,
        "variance_pct": 1.2,
        "efficiency_pct": 90.81,
        "target_efficiency_pct": 89.44,
        "attainment_pct": 101.2,
        "target_picks": 36060325,
        "actual_picks": 36473848,
        "target_pace_m_per_hr": 2084.1,
        "actual_pace_m_per_hr": 2109.1,
        "target_metres_per_loom": 86.8,
        "actual_metres_per_loom": 87.9,
        "scheduled_minutes": 92160,
        "running_minutes": 85803,
        "stopped_minutes": 6357,
        "target_running_minutes": 82428,
        "allowable_stopped_minutes": 9732,
        "warp_breaks": 1267,
        "weft_breaks": 3494,
        "total_breaks": 4761,
        "looms_reported": 192,
        "supervisor_name": "R. Selvam (Shift Lead)"
      },
      {
        "shift_id": 3,
        "shift_code": "3",
        "start_time": "22:00",
        "end_time": "06:00",
        "target_metres": 16672.9,
        "actual_metres": 16332.3,
        "variance_metres": -340.6,
        "variance_pct": -2.04,
        "efficiency_pct": 87.92,
        "target_efficiency_pct": 89.44,
        "attainment_pct": 97.96,
        "target_picks": 36060325,
        "actual_picks": 35310738,
        "target_pace_m_per_hr": 2084.1,
        "actual_pace_m_per_hr": 2041.5,
        "target_metres_per_loom": 86.8,
        "actual_metres_per_loom": 85.1,
        "scheduled_minutes": 92160,
        "running_minutes": 83407,
        "stopped_minutes": 8753,
        "target_running_minutes": 82428,
        "allowable_stopped_minutes": 9732,
        "warp_breaks": 1172,
        "weft_breaks": 3464,
        "total_breaks": 4636,
        "looms_reported": 192,
        "supervisor_name": "A. Pandian (Night Lead)"
      }
    ]
  },
  "productionHistory": {
    "unit_code": "ATM",
    "work_date": "2026-07-31",
    "direction": {
      "window_days": 30,
      "direction_status": "DECLINING",
      "output_change_pct": -3.1,
      "efficiency_change_pp": -2.7,
      "downtime_change_pct": 8.4,
      "key_changes": [
        {
          "entity": "AJ-118",
          "status": "DECLINING",
          "detail": "Efficiency has trended downward for 9 consecutive production days."
        },
        {
          "entity": "AJ-132",
          "status": "VOLATILE",
          "detail": "Weft stop frequency elevated (+34% vs baseline) due to lot transition."
        },
        {
          "entity": "Shift 3",
          "status": "NEEDS_ATTENTION",
          "detail": "Operating 2.6 pp below standard benchmark on Airjet sheds."
        }
      ]
    },
    "timeline": {
      "window": "30D",
      "start_date": "2026-07-02",
      "end_date": "2026-07-31",
      "data_points": [
        {
          "date": "2026-07-02",
          "actual_metres": 48329.1,
          "target_metres": 50018.7,
          "efficiency_pct": 86.9,
          "warp_breaks": 3843,
          "weft_breaks": 11068,
          "total_breaks": 14911,
          "running_minutes": 245644,
          "stopped_minutes": 30836
        },
        {
          "date": "2026-07-03",
          "actual_metres": 49842.8,
          "target_metres": 50018.7,
          "efficiency_pct": 89.7,
          "warp_breaks": 3630,
          "weft_breaks": 10033,
          "total_breaks": 13663,
          "running_minutes": 253601,
          "stopped_minutes": 22879
        },
        {
          "date": "2026-07-04",
          "actual_metres": 50818.5,
          "target_metres": 50018.7,
          "efficiency_pct": 91.4,
          "warp_breaks": 3006,
          "weft_breaks": 9032,
          "total_breaks": 12038,
          "running_minutes": 258378,
          "stopped_minutes": 18102
        },
        {
          "date": "2026-07-05",
          "actual_metres": 48801.3,
          "target_metres": 50018.7,
          "efficiency_pct": 87.8,
          "warp_breaks": 3708,
          "weft_breaks": 10682,
          "total_breaks": 14390,
          "running_minutes": 249626,
          "stopped_minutes": 26854
        },
        {
          "date": "2026-07-06",
          "actual_metres": 47592.8,
          "target_metres": 50018.7,
          "efficiency_pct": 85.6,
          "warp_breaks": 4013,
          "weft_breaks": 12114,
          "total_breaks": 16127,
          "running_minutes": 242263,
          "stopped_minutes": 34217
        },
        {
          "date": "2026-07-07",
          "actual_metres": 48084.4,
          "target_metres": 50018.7,
          "efficiency_pct": 86.4,
          "warp_breaks": 3721,
          "weft_breaks": 11387,
          "total_breaks": 15108,
          "running_minutes": 245702,
          "stopped_minutes": 30778
        },
        {
          "date": "2026-07-08",
          "actual_metres": 50277.0,
          "target_metres": 50018.7,
          "efficiency_pct": 90.6,
          "warp_breaks": 3174,
          "weft_breaks": 9521,
          "total_breaks": 12695,
          "running_minutes": 256235,
          "stopped_minutes": 20245
        },
        {
          "date": "2026-07-09",
          "actual_metres": 49017.2,
          "target_metres": 50018.7,
          "efficiency_pct": 88.3,
          "warp_breaks": 3724,
          "weft_breaks": 10678,
          "total_breaks": 14402,
          "running_minutes": 250897,
          "stopped_minutes": 25583
        },
        {
          "date": "2026-07-10",
          "actual_metres": 45422.5,
          "target_metres": 50018.7,
          "efficiency_pct": 81.7,
          "warp_breaks": 4067,
          "weft_breaks": 12317,
          "total_breaks": 16384,
          "running_minutes": 229540,
          "stopped_minutes": 46940
        },
        {
          "date": "2026-07-11",
          "actual_metres": 50651.1,
          "target_metres": 50018.7,
          "efficiency_pct": 91.0,
          "warp_breaks": 3071,
          "weft_breaks": 9237,
          "total_breaks": 12308,
          "running_minutes": 257347,
          "stopped_minutes": 19133
        },
        {
          "date": "2026-07-12",
          "actual_metres": 45713.4,
          "target_metres": 50018.7,
          "efficiency_pct": 82.1,
          "warp_breaks": 4296,
          "weft_breaks": 14874,
          "total_breaks": 19170,
          "running_minutes": 230881,
          "stopped_minutes": 45599
        },
        {
          "date": "2026-07-13",
          "actual_metres": 48441.5,
          "target_metres": 50018.7,
          "efficiency_pct": 86.9,
          "warp_breaks": 3781,
          "weft_breaks": 11256,
          "total_breaks": 15037,
          "running_minutes": 246956,
          "stopped_minutes": 29524
        },
        {
          "date": "2026-07-14",
          "actual_metres": 48703.8,
          "target_metres": 50018.7,
          "efficiency_pct": 87.4,
          "warp_breaks": 3803,
          "weft_breaks": 10734,
          "total_breaks": 14537,
          "running_minutes": 248633,
          "stopped_minutes": 27847
        },
        {
          "date": "2026-07-15",
          "actual_metres": 51488.0,
          "target_metres": 50018.7,
          "efficiency_pct": 92.4,
          "warp_breaks": 2906,
          "weft_breaks": 9097,
          "total_breaks": 12003,
          "running_minutes": 260838,
          "stopped_minutes": 15642
        },
        {
          "date": "2026-07-16",
          "actual_metres": 49477.9,
          "target_metres": 50018.7,
          "efficiency_pct": 88.8,
          "warp_breaks": 3706,
          "weft_breaks": 10588,
          "total_breaks": 14294,
          "running_minutes": 252390,
          "stopped_minutes": 24090
        },
        {
          "date": "2026-07-17",
          "actual_metres": 50181.1,
          "target_metres": 50018.7,
          "efficiency_pct": 90.1,
          "warp_breaks": 3314,
          "weft_breaks": 10178,
          "total_breaks": 13492,
          "running_minutes": 254717,
          "stopped_minutes": 21763
        },
        {
          "date": "2026-07-18",
          "actual_metres": 46573.3,
          "target_metres": 50018.7,
          "efficiency_pct": 83.4,
          "warp_breaks": 6789,
          "weft_breaks": 13216,
          "total_breaks": 20005,
          "running_minutes": 239279,
          "stopped_minutes": 37201
        },
        {
          "date": "2026-07-19",
          "actual_metres": 49336.9,
          "target_metres": 50018.7,
          "efficiency_pct": 88.4,
          "warp_breaks": 3639,
          "weft_breaks": 10547,
          "total_breaks": 14186,
          "running_minutes": 251078,
          "stopped_minutes": 25402
        },
        {
          "date": "2026-07-20",
          "actual_metres": 51714.2,
          "target_metres": 50018.7,
          "efficiency_pct": 92.9,
          "warp_breaks": 2803,
          "weft_breaks": 8447,
          "total_breaks": 11250,
          "running_minutes": 261656,
          "stopped_minutes": 14824
        },
        {
          "date": "2026-07-21",
          "actual_metres": 47769.1,
          "target_metres": 50018.7,
          "efficiency_pct": 86.1,
          "warp_breaks": 3730,
          "weft_breaks": 11277,
          "total_breaks": 15007,
          "running_minutes": 243172,
          "stopped_minutes": 33308
        },
        {
          "date": "2026-07-22",
          "actual_metres": 34933.7,
          "target_metres": 50018.7,
          "efficiency_pct": 63.1,
          "warp_breaks": 4504,
          "weft_breaks": 33435,
          "total_breaks": 37939,
          "running_minutes": 186037,
          "stopped_minutes": 90443
        },
        {
          "date": "2026-07-23",
          "actual_metres": 46629.6,
          "target_metres": 50018.7,
          "efficiency_pct": 84.1,
          "warp_breaks": 5193,
          "weft_breaks": 11552,
          "total_breaks": 16745,
          "running_minutes": 237360,
          "stopped_minutes": 39120
        },
        {
          "date": "2026-07-24",
          "actual_metres": 49599.8,
          "target_metres": 50018.7,
          "efficiency_pct": 89.4,
          "warp_breaks": 3512,
          "weft_breaks": 10603,
          "total_breaks": 14115,
          "running_minutes": 253548,
          "stopped_minutes": 22932
        },
        {
          "date": "2026-07-25",
          "actual_metres": 52502.4,
          "target_metres": 50018.7,
          "efficiency_pct": 94.5,
          "warp_breaks": 2550,
          "weft_breaks": 7945,
          "total_breaks": 10495,
          "running_minutes": 264250,
          "stopped_minutes": 12230
        },
        {
          "date": "2026-07-26",
          "actual_metres": 38980.7,
          "target_metres": 50018.7,
          "efficiency_pct": 70.1,
          "warp_breaks": 3509,
          "weft_breaks": 11146,
          "total_breaks": 14655,
          "running_minutes": 197608,
          "stopped_minutes": 78872
        },
        {
          "date": "2026-07-27",
          "actual_metres": 48592.3,
          "target_metres": 50018.7,
          "efficiency_pct": 87.3,
          "warp_breaks": 3710,
          "weft_breaks": 10379,
          "total_breaks": 14089,
          "running_minutes": 247250,
          "stopped_minutes": 29230
        },
        {
          "date": "2026-07-28",
          "actual_metres": 45407.6,
          "target_metres": 50018.7,
          "efficiency_pct": 81.6,
          "warp_breaks": 4082,
          "weft_breaks": 12606,
          "total_breaks": 16688,
          "running_minutes": 229817,
          "stopped_minutes": 46663
        },
        {
          "date": "2026-07-29",
          "actual_metres": 47404.2,
          "target_metres": 50018.7,
          "efficiency_pct": 85.5,
          "warp_breaks": 4200,
          "weft_breaks": 14253,
          "total_breaks": 18453,
          "running_minutes": 249580,
          "stopped_minutes": 26900
        },
        {
          "date": "2026-07-30",
          "actual_metres": 50500.0,
          "target_metres": 50018.7,
          "efficiency_pct": 90.8,
          "warp_breaks": 3075,
          "weft_breaks": 9583,
          "total_breaks": 12658,
          "running_minutes": 253930,
          "stopped_minutes": 22550
        },
        {
          "date": "2026-07-31",
          "actual_metres": 49748.8,
          "target_metres": 50018.7,
          "efficiency_pct": 89.3,
          "warp_breaks": 3632,
          "weft_breaks": 10406,
          "total_breaks": 14038,
          "running_minutes": 253486,
          "stopped_minutes": 22994
        }
      ],
      "average_metres": 48084.5,
      "average_efficiency_pct": 86.5,
      "points_count": 30
    },
    "consistency_quadrants": {
      "quadrants": {
        "consistent_performers": [],
        "declining": [
          {
            "loom_id": 64,
            "loom_no": "AJ-064",
            "loom_type": "810",
            "mean_efficiency_pct": 76.6,
            "stddev": 20.09,
            "trend_slope": -0.76
          },
          {
            "loom_id": 140,
            "loom_no": "AJ-140",
            "loom_type": "810",
            "mean_efficiency_pct": 81.8,
            "stddev": 20.17,
            "trend_slope": -1.01
          },
          {
            "loom_id": 152,
            "loom_no": "AJ-152",
            "loom_type": "810",
            "mean_efficiency_pct": 84.9,
            "stddev": 7.49,
            "trend_slope": -0.3
          }
        ],
        "recovering": [
          {
            "loom_id": 22,
            "loom_no": "AJ-022",
            "loom_type": "810",
            "mean_efficiency_pct": 87.3,
            "stddev": 9.73,
            "trend_slope": 0.4
          },
          {
            "loom_id": 92,
            "loom_no": "AJ-092",
            "loom_type": "810",
            "mean_efficiency_pct": 75.0,
            "stddev": 8.41,
            "trend_slope": 0.49
          }
        ],
        "volatile": [
          {
            "loom_id": 1,
            "loom_no": "AJ-001",
            "loom_type": "910",
            "mean_efficiency_pct": 87.6,
            "stddev": 9.66,
            "trend_slope": 0.3
          },
          {
            "loom_id": 2,
            "loom_no": "AJ-002",
            "loom_type": "810",
            "mean_efficiency_pct": 86.5,
            "stddev": 9.53,
            "trend_slope": 0.28
          },
          {
            "loom_id": 3,
            "loom_no": "AJ-003",
            "loom_type": "910",
            "mean_efficiency_pct": 73.9,
            "stddev": 8.18,
            "trend_slope": 0.21
          },
          {
            "loom_id": 4,
            "loom_no": "AJ-004",
            "loom_type": "810",
            "mean_efficiency_pct": 86.4,
            "stddev": 9.31,
            "trend_slope": 0.27
          },
          {
            "loom_id": 5,
            "loom_no": "AJ-005",
            "loom_type": "910",
            "mean_efficiency_pct": 85.1,
            "stddev": 9.47,
            "trend_slope": 0.37
          },
          {
            "loom_id": 6,
            "loom_no": "AJ-006",
            "loom_type": "810",
            "mean_efficiency_pct": 79.3,
            "stddev": 8.68,
            "trend_slope": 0.27
          },
          {
            "loom_id": 7,
            "loom_no": "AJ-007",
            "loom_type": "910",
            "mean_efficiency_pct": 85.7,
            "stddev": 9.3,
            "trend_slope": 0.27
          },
          {
            "loom_id": 8,
            "loom_no": "AJ-008",
            "loom_type": "810",
            "mean_efficiency_pct": 85.8,
            "stddev": 9.6,
            "trend_slope": 0.28
          }
        ]
      },
      "counts": {
        "consistent": 0,
        "declining": 3,
        "recovering": 2,
        "volatile": 187,
        "insufficient_data": 0
      },
      "config_applied": {
        "min_observation_days": 7,
        "consistent_min_eff": 90.0,
        "declining_max_slope": -0.3
      }
    }
  },
  "breakdownSummary": {
    "data_as_of": null,
    "source_mix": [
      "ACTUAL_PLC_STOPS"
    ],
    "date": "2026-07-31",
    "unit_code": "ATM",
    "today_stopped_minutes_total": 37234,
    "today_events_count_total": 766,
    "today_rupee_loss_total": {
      "value": "400184.0",
      "rate_source": "CONFIRMED",
      "rate_basis": "Calculated from active Style masters"
    },
    "category_downtime_minutes": {
      "MECHANICAL": 4875.0,
      "ELECTRICAL": 19845.0,
      "MATERIAL": 1780.0,
      "MANPOWER": 3023.0,
      "UTILITY": 2860.0,
      "PLANNED": 4851.0,
      "OTHER": 0.0
    },
    "worst_looms_today": [
      {
        "loom_id": 118,
        "loom_no": "AJ-118",
        "loom_type_code": "810",
        "total_stopped_minutes": 509,
        "event_count": 10,
        "dominant_reason_en": "Power failure",
        "dominant_reason_category": "MECHANICAL",
        "lost_meters": 152.8,
        "rupee_exposure": 6112.0,
        "efficiency_pct": 78.3,
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain"
      },
      {
        "loom_id": 3,
        "loom_no": "AJ-003",
        "loom_type_code": "910",
        "total_stopped_minutes": 471,
        "event_count": 7,
        "dominant_reason_en": "Power failure",
        "dominant_reason_category": "MECHANICAL",
        "lost_meters": 141.4,
        "rupee_exposure": 5655.0,
        "efficiency_pct": 78.9,
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain"
      },
      {
        "loom_id": 132,
        "loom_no": "AJ-132",
        "loom_type_code": "810",
        "total_stopped_minutes": 448,
        "event_count": 7,
        "dominant_reason_en": "Electrical breakdown",
        "dominant_reason_category": "MECHANICAL",
        "lost_meters": 134.5,
        "rupee_exposure": 5379.0,
        "efficiency_pct": 77.2,
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain"
      },
      {
        "loom_id": 76,
        "loom_no": "AJ-076",
        "loom_type_code": "810",
        "total_stopped_minutes": 422,
        "event_count": 7,
        "dominant_reason_en": "Voltage fluctuation",
        "dominant_reason_category": "ELECTRICAL",
        "lost_meters": 126.7,
        "rupee_exposure": 5067.0,
        "efficiency_pct": 82.1,
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain"
      },
      {
        "loom_id": 146,
        "loom_no": "AJ-146",
        "loom_type_code": "810",
        "total_stopped_minutes": 402,
        "event_count": 7,
        "dominant_reason_en": "Voltage fluctuation",
        "dominant_reason_category": "ELECTRICAL",
        "lost_meters": 120.7,
        "rupee_exposure": 4827.0,
        "efficiency_pct": 80.8,
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain"
      },
      {
        "loom_id": 23,
        "loom_no": "AJ-023",
        "loom_type_code": "910",
        "total_stopped_minutes": 381,
        "event_count": 5,
        "dominant_reason_en": "Weft feeder fault",
        "dominant_reason_category": "MECHANICAL",
        "lost_meters": 114.4,
        "rupee_exposure": 4575.0,
        "efficiency_pct": 80.8,
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain"
      },
      {
        "loom_id": 51,
        "loom_no": "AJ-051",
        "loom_type_code": "910",
        "total_stopped_minutes": 378,
        "event_count": 6,
        "dominant_reason_en": "Electrical breakdown",
        "dominant_reason_category": "MECHANICAL",
        "lost_meters": 113.5,
        "rupee_exposure": 4539.0,
        "efficiency_pct": 81.0,
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain"
      },
      {
        "loom_id": 88,
        "loom_no": "AJ-088",
        "loom_type_code": "810",
        "total_stopped_minutes": 376,
        "event_count": 6,
        "dominant_reason_en": "No weaver (absenteeism)",
        "dominant_reason_category": "MECHANICAL",
        "lost_meters": 112.9,
        "rupee_exposure": 4515.0,
        "efficiency_pct": 83.2,
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain"
      },
      {
        "loom_id": 69,
        "loom_no": "AJ-069",
        "loom_type_code": "910",
        "total_stopped_minutes": 355,
        "event_count": 6,
        "dominant_reason_en": "Mechanical breakdown",
        "dominant_reason_category": "MECHANICAL",
        "lost_meters": 106.6,
        "rupee_exposure": 4263.0,
        "efficiency_pct": 82.5,
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain"
      },
      {
        "loom_id": 41,
        "loom_no": "AJ-041",
        "loom_type_code": "910",
        "total_stopped_minutes": 337,
        "event_count": 5,
        "dominant_reason_en": "Air pressure low",
        "dominant_reason_category": "MECHANICAL",
        "lost_meters": 101.2,
        "rupee_exposure": 4046.0,
        "efficiency_pct": 85.1,
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain"
      }
    ],
    "monthly_top_looms": [
      {
        "loom_id": 118,
        "loom_no": "AJ-118",
        "loom_type_code": "810",
        "total_stopped_minutes": 12200,
        "event_count": 193,
        "dominant_reason_en": "Chronic Repeat Stoppages",
        "dominant_reason_category": "MECHANICAL",
        "lost_meters": null,
        "rupee_exposure": null,
        "efficiency_pct": null,
        "style_code": null
      },
      {
        "loom_id": 192,
        "loom_no": "SZ-024",
        "loom_type_code": "340",
        "total_stopped_minutes": 12628,
        "event_count": 191,
        "dominant_reason_en": "Chronic Repeat Stoppages",
        "dominant_reason_category": "MECHANICAL",
        "lost_meters": null,
        "rupee_exposure": null,
        "efficiency_pct": null,
        "style_code": null
      },
      {
        "loom_id": 33,
        "loom_no": "AJ-033",
        "loom_type_code": "910",
        "total_stopped_minutes": 10999,
        "event_count": 184,
        "dominant_reason_en": "Chronic Repeat Stoppages",
        "dominant_reason_category": "MECHANICAL",
        "lost_meters": null,
        "rupee_exposure": null,
        "efficiency_pct": null,
        "style_code": null
      },
      {
        "loom_id": 43,
        "loom_no": "AJ-043",
        "loom_type_code": "910",
        "total_stopped_minutes": 11254,
        "event_count": 182,
        "dominant_reason_en": "Chronic Repeat Stoppages",
        "dominant_reason_category": "MECHANICAL",
        "lost_meters": null,
        "rupee_exposure": null,
        "efficiency_pct": null,
        "style_code": null
      },
      {
        "loom_id": 92,
        "loom_no": "AJ-092",
        "loom_type_code": "810",
        "total_stopped_minutes": 11240,
        "event_count": 182,
        "dominant_reason_en": "Chronic Repeat Stoppages",
        "dominant_reason_category": "MECHANICAL",
        "lost_meters": null,
        "rupee_exposure": null,
        "efficiency_pct": null,
        "style_code": null
      },
      {
        "loom_id": 132,
        "loom_no": "AJ-132",
        "loom_type_code": "810",
        "total_stopped_minutes": 12478,
        "event_count": 181,
        "dominant_reason_en": "Chronic Repeat Stoppages",
        "dominant_reason_category": "MECHANICAL",
        "lost_meters": null,
        "rupee_exposure": null,
        "efficiency_pct": null,
        "style_code": null
      },
      {
        "loom_id": 178,
        "loom_no": "SZ-010",
        "loom_type_code": "TS",
        "total_stopped_minutes": 11677,
        "event_count": 181,
        "dominant_reason_en": "Chronic Repeat Stoppages",
        "dominant_reason_category": "MECHANICAL",
        "lost_meters": null,
        "rupee_exposure": null,
        "efficiency_pct": null,
        "style_code": null
      },
      {
        "loom_id": 69,
        "loom_no": "AJ-069",
        "loom_type_code": "910",
        "total_stopped_minutes": 10195,
        "event_count": 178,
        "dominant_reason_en": "Chronic Repeat Stoppages",
        "dominant_reason_category": "MECHANICAL",
        "lost_meters": null,
        "rupee_exposure": null,
        "efficiency_pct": null,
        "style_code": null
      },
      {
        "loom_id": 20,
        "loom_no": "AJ-020",
        "loom_type_code": "810",
        "total_stopped_minutes": 11380,
        "event_count": 177,
        "dominant_reason_en": "Chronic Repeat Stoppages",
        "dominant_reason_category": "MECHANICAL",
        "lost_meters": null,
        "rupee_exposure": null,
        "efficiency_pct": null,
        "style_code": null
      },
      {
        "loom_id": 146,
        "loom_no": "AJ-146",
        "loom_type_code": "810",
        "total_stopped_minutes": 11225,
        "event_count": 176,
        "dominant_reason_en": "Chronic Repeat Stoppages",
        "dominant_reason_category": "MECHANICAL",
        "lost_meters": null,
        "rupee_exposure": null,
        "efficiency_pct": null,
        "style_code": null
      }
    ],
    "avg_downtime_per_event_min": "48.6",
    "reason_pareto": [
      {
        "reason_code": "POWER_FAILURE",
        "reason_label_en": "Power failure",
        "count": 140,
        "total_minutes": "7059.0",
        "pct_of_loom_downtime": "18.3",
        "vs_plant_pct": "0",
        "avg_duration_min": 50.4,
        "expected_duration_min": 30.0,
        "variance_min": 20.4,
        "category": "ELECTRICAL"
      },
      {
        "reason_code": "ELECTRICAL_BREAKDOWN",
        "reason_label_en": "Electrical breakdown",
        "count": 127,
        "total_minutes": "6553.0",
        "pct_of_loom_downtime": "16.6",
        "vs_plant_pct": "0",
        "avg_duration_min": 51.6,
        "expected_duration_min": 45.0,
        "variance_min": 6.6,
        "category": "ELECTRICAL"
      },
      {
        "reason_code": "VOLTAGE_FLUCTUATION",
        "reason_label_en": "Voltage fluctuation",
        "count": 128,
        "total_minutes": "6233.0",
        "pct_of_loom_downtime": "16.7",
        "vs_plant_pct": "0",
        "avg_duration_min": 48.7,
        "expected_duration_min": 10.0,
        "variance_min": 38.7,
        "category": "ELECTRICAL"
      },
      {
        "reason_code": "NO_WEAVER",
        "reason_label_en": "No weaver (absenteeism)",
        "count": 56,
        "total_minutes": "3023.0",
        "pct_of_loom_downtime": "7.3",
        "vs_plant_pct": "0",
        "avg_duration_min": 54.0,
        "expected_duration_min": 30.0,
        "variance_min": 24.0,
        "category": "MANPOWER"
      },
      {
        "reason_code": "AIR_PRESSURE_LOW",
        "reason_label_en": "Air pressure low",
        "count": 58,
        "total_minutes": "2860.0",
        "pct_of_loom_downtime": "7.6",
        "vs_plant_pct": "0",
        "avg_duration_min": 49.3,
        "expected_duration_min": 15.0,
        "variance_min": 34.3,
        "category": "UTILITY"
      },
      {
        "reason_code": "WEFT_FEEDER_FAULT",
        "reason_label_en": "Weft feeder fault",
        "count": 51,
        "total_minutes": "2745.0",
        "pct_of_loom_downtime": "6.7",
        "vs_plant_pct": "0",
        "avg_duration_min": 53.8,
        "expected_duration_min": 15.0,
        "variance_min": 38.8,
        "category": "MECHANICAL"
      },
      {
        "reason_code": "MECHANICAL_BREAKDOWN",
        "reason_label_en": "Mechanical breakdown",
        "count": 41,
        "total_minutes": "2130.0",
        "pct_of_loom_downtime": "5.4",
        "vs_plant_pct": "0",
        "avg_duration_min": 52.0,
        "expected_duration_min": 45.0,
        "variance_min": 7.0,
        "category": "MECHANICAL"
      },
      {
        "reason_code": "SORT_BEAM_CHANGE",
        "reason_label_en": "Sort/beam change",
        "count": 27,
        "total_minutes": "1286.0",
        "pct_of_loom_downtime": "3.5",
        "vs_plant_pct": "0",
        "avg_duration_min": 47.6,
        "expected_duration_min": 120.0,
        "variance_min": -72.4,
        "category": "PLANNED"
      },
      {
        "reason_code": "GAITING",
        "reason_label_en": "Gaiting",
        "count": 25,
        "total_minutes": "1239.0",
        "pct_of_loom_downtime": "3.3",
        "vs_plant_pct": "0",
        "avg_duration_min": 49.6,
        "expected_duration_min": 180.0,
        "variance_min": -130.4,
        "category": "PLANNED"
      },
      {
        "reason_code": "KNOTTING",
        "reason_label_en": "Knotting",
        "count": 21,
        "total_minutes": "1042.0",
        "pct_of_loom_downtime": "2.7",
        "vs_plant_pct": "0",
        "avg_duration_min": 49.6,
        "expected_duration_min": 60.0,
        "variance_min": -10.4,
        "category": "PLANNED"
      },
      {
        "reason_code": "WARP_BREAK",
        "reason_label_en": "Warp break",
        "count": 34,
        "total_minutes": "952.0",
        "pct_of_loom_downtime": "4.4",
        "vs_plant_pct": "0",
        "avg_duration_min": 28.0,
        "expected_duration_min": 3.0,
        "variance_min": 25.0,
        "category": "MATERIAL"
      },
      {
        "reason_code": "WEFT_BREAK",
        "reason_label_en": "Weft break",
        "count": 30,
        "total_minutes": "828.0",
        "pct_of_loom_downtime": "3.9",
        "vs_plant_pct": "0",
        "avg_duration_min": 27.6,
        "expected_duration_min": 1.5,
        "variance_min": 26.1,
        "category": "MATERIAL"
      },
      {
        "reason_code": "ROLL_DOFFING",
        "reason_label_en": "Fabric roll doffing",
        "count": 17,
        "total_minutes": "789.0",
        "pct_of_loom_downtime": "2.2",
        "vs_plant_pct": "0",
        "avg_duration_min": 46.4,
        "expected_duration_min": 10.0,
        "variance_min": 36.4,
        "category": "PLANNED"
      },
      {
        "reason_code": "PREVENTIVE_MAINTENANCE",
        "reason_label_en": "Preventive maintenance",
        "count": 11,
        "total_minutes": "495.0",
        "pct_of_loom_downtime": "1.4",
        "vs_plant_pct": "0",
        "avg_duration_min": 45.0,
        "expected_duration_min": 120.0,
        "variance_min": -75.0,
        "category": "PLANNED"
      }
    ],
    "total_rupee_lost": {
      "value": "400184.0",
      "rate_source": "CONFIRMED",
      "rate_basis": "Calculated from active Style masters"
    },
    "highest_downtime_loom": {
      "loom_id": 118,
      "loom_no": "AJ-118",
      "loom_type_code": "810",
      "total_stopped_minutes": 509,
      "event_count": 10,
      "dominant_reason_en": "Power failure",
      "dominant_reason_category": "MECHANICAL",
      "lost_meters": 152.8,
      "rupee_exposure": 6112.0,
      "efficiency_pct": 78.3,
      "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain"
    },
    "best_peer_benchmark": {
      "loom_id": 162,
      "loom_no": "AJ-162",
      "loom_type_code": "810",
      "total_stopped_minutes": 38,
      "event_count": 1,
      "efficiency_pct": 98.6,
      "metres_produced": 303.3,
      "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
      "shed_code": "AIRJET",
      "comparison_notes": "Loom AJ-162 achieved 98.6% efficiency with only 38m downtime on style 30s VSF X 30s VSF /66X55&43&57-63\" Plain in AIRJET. Proves that the yarn lot and air pressure are sound for this machine class."
    },
    "chronic_monthly_offender": {
      "loom_id": 118,
      "loom_no": "AJ-118",
      "loom_type_code": "810",
      "total_stopped_minutes": 12200,
      "event_count": 193,
      "dominant_reason_en": "Chronic Repeat Stoppages",
      "dominant_reason_category": "MECHANICAL",
      "lost_meters": null,
      "rupee_exposure": null,
      "efficiency_pct": null,
      "style_code": null
    },
    "event_classification_summary": {
      "MICRO_STOP": {
        "label": "Micro Stop",
        "count": 0,
        "minutes": 0.0,
        "lost_meters": 0.0,
        "rupee_exposure": 0.0
      },
      "OPERATOR_STOP": {
        "label": "Operator Stop",
        "count": 120,
        "minutes": 4803.0,
        "lost_meters": 1318.801341168588,
        "rupee_exposure": 52752.05364674352
      },
      "PROCESS_STOP": {
        "label": "Process Stop",
        "count": 0,
        "minutes": 0.0,
        "lost_meters": 0.0,
        "rupee_exposure": 0.0
      },
      "UTILITY_STOP": {
        "label": "Utility Stop",
        "count": 326,
        "minutes": 16152.0,
        "lost_meters": 4262.322205574757,
        "rupee_exposure": 170492.8882229903
      },
      "MECHANICAL_BREAKDOWN": {
        "label": "Mechanical Breakdown",
        "count": 92,
        "minutes": 4875.0,
        "lost_meters": 1324.0018612445397,
        "rupee_exposure": 52960.07444978156
      },
      "ELECTRICAL_BREAKDOWN": {
        "label": "Electrical Breakdown",
        "count": 127,
        "minutes": 6553.0,
        "lost_meters": 1767.6611821905476,
        "rupee_exposure": 70706.44728762194
      },
      "PLANNED_MAINTENANCE": {
        "label": "Planned Maintenance",
        "count": 101,
        "minutes": 4851.0,
        "lost_meters": 1331.824181169009,
        "rupee_exposure": 53272.967246760396
      },
      "UNKNOWN": {
        "label": "Unknown",
        "count": 0,
        "minutes": 0.0,
        "lost_meters": 0.0,
        "rupee_exposure": 0.0
      }
    },
    "micro_stops_minutes": 0,
    "micro_stops_count": 0,
    "breakdown_minutes": 37234,
    "breakdown_count": 766,
    "abnormal_patterns": [
      {
        "pattern_id": "cluster-19",
        "title": "Chronic Repeat Stops on AJ-019",
        "severity": "CRITICAL",
        "scope": "Loom AJ-019",
        "detail": "Experienced 3+ stops within a 60-minute window (26m span).",
        "evidence": "Total 4 stops logged today (161m lost).",
        "recommendation": "Inspect mechanical feeder/gripper calibration; check yarn unwinding tension."
      },
      {
        "pattern_id": "cluster-37",
        "title": "Chronic Repeat Stops on AJ-037",
        "severity": "CRITICAL",
        "scope": "Loom AJ-037",
        "detail": "Experienced 3+ stops within a 60-minute window (23m span).",
        "evidence": "Total 5 stops logged today (185m lost).",
        "recommendation": "Inspect mechanical feeder/gripper calibration; check yarn unwinding tension."
      },
      {
        "pattern_id": "cluster-50",
        "title": "Chronic Repeat Stops on AJ-050",
        "severity": "CRITICAL",
        "scope": "Loom AJ-050",
        "detail": "Experienced 3+ stops within a 60-minute window (3m span).",
        "evidence": "Total 7 stops logged today (326m lost).",
        "recommendation": "Inspect mechanical feeder/gripper calibration; check yarn unwinding tension."
      }
    ],
    "shift_breakdown_matrix": [
      {
        "shift_code": "Shift 1",
        "stopped_minutes": 12674,
        "event_count": 258,
        "lost_meters": 3412.8,
        "rupee_exposure": 136511.0,
        "dominant_reason": "Power failure"
      },
      {
        "shift_code": "Shift 2",
        "stopped_minutes": 10755,
        "event_count": 231,
        "lost_meters": 2860.2,
        "rupee_exposure": 114409.0,
        "dominant_reason": "Voltage fluctuation"
      },
      {
        "shift_code": "Shift 3",
        "stopped_minutes": 13805,
        "event_count": 277,
        "lost_meters": 3731.6,
        "rupee_exposure": 149264.0,
        "dominant_reason": "Power failure"
      }
    ],
    "total_meters_lost": 10004.6,
    "today_financial_exposure": {
      "value": "400184.0",
      "rate_source": "CONFIRMED",
      "rate_basis": "Calculated from active Style masters"
    },
    "potential_recovery": {
      "potential_meters": 257.2,
      "potential_rupees": 10288.0,
      "top_opportunity": "AJ-118"
    }
  },
  "rootCauseEvents": [
    {
      "stop_event_id": 23693,
      "loom_id": 132,
      "loom_no": "AJ-132",
      "loom_type_code": "810",
      "work_date": "2026-07-31",
      "shift_id": 3,
      "shift_code": "3",
      "raised_at": "2026-07-31T03:48:00",
      "resolved_at": "2026-07-31T04:11:00",
      "duration_minutes": 23.0,
      "status": "RESOLVED",
      "reason_code": "NO_WEAVER",
      "reason_label_en": "No weaver (absenteeism)",
      "reason_category": "ReasonCategory.MANPOWER",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23169,
      "loom_id": 118,
      "loom_no": "AJ-118",
      "loom_type_code": "810",
      "work_date": "2026-07-31",
      "shift_id": 1,
      "shift_code": "1",
      "raised_at": "2026-07-31T03:05:00",
      "resolved_at": "2026-07-31T03:38:00",
      "duration_minutes": 33.0,
      "status": "RESOLVED",
      "reason_code": "GAITING",
      "reason_label_en": "Gaiting",
      "reason_category": "ReasonCategory.PLANNED",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23505,
      "loom_id": 3,
      "loom_no": "AJ-003",
      "loom_type_code": "910",
      "work_date": "2026-07-31",
      "shift_id": 3,
      "shift_code": "3",
      "raised_at": "2026-07-31T03:03:00",
      "resolved_at": "2026-07-31T03:48:00",
      "duration_minutes": 45.0,
      "status": "RESOLVED",
      "reason_code": "AIR_PRESSURE_LOW",
      "reason_label_en": "Air pressure low",
      "reason_category": "ReasonCategory.UTILITY",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23102,
      "loom_id": 69,
      "loom_no": "AJ-069",
      "loom_type_code": "910",
      "work_date": "2026-07-31",
      "shift_id": 1,
      "shift_code": "1",
      "raised_at": "2026-07-31T02:49:00",
      "resolved_at": "2026-07-31T03:19:00",
      "duration_minutes": 30.0,
      "status": "RESOLVED",
      "reason_code": "WARP_BREAK",
      "reason_label_en": "Warp break",
      "reason_category": "ReasonCategory.MATERIAL",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23442,
      "loom_id": 146,
      "loom_no": "AJ-146",
      "loom_type_code": "810",
      "work_date": "2026-07-31",
      "shift_id": 2,
      "shift_code": "2",
      "raised_at": "2026-07-31T02:48:00",
      "resolved_at": "2026-07-31T03:13:00",
      "duration_minutes": 25.0,
      "status": "RESOLVED",
      "reason_code": "AIR_PRESSURE_LOW",
      "reason_label_en": "Air pressure low",
      "reason_category": "ReasonCategory.UTILITY",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23293,
      "loom_id": 20,
      "loom_no": "AJ-020",
      "loom_type_code": "810",
      "work_date": "2026-07-31",
      "shift_id": 2,
      "shift_code": "2",
      "raised_at": "2026-07-31T02:44:00",
      "resolved_at": "2026-07-31T03:37:00",
      "duration_minutes": 53.0,
      "status": "RESOLVED",
      "reason_code": "NO_WEAVER",
      "reason_label_en": "No weaver (absenteeism)",
      "reason_category": "ReasonCategory.MANPOWER",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23755,
      "loom_id": 177,
      "loom_no": "SZ-009",
      "loom_type_code": "280",
      "work_date": "2026-07-31",
      "shift_id": 3,
      "shift_code": "3",
      "raised_at": "2026-07-31T02:43:00",
      "resolved_at": "2026-07-31T03:11:00",
      "duration_minutes": 28.0,
      "status": "RESOLVED",
      "reason_code": "VOLTAGE_FLUCTUATION",
      "reason_label_en": "Voltage fluctuation",
      "reason_category": "ReasonCategory.ELECTRICAL",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23610,
      "loom_id": 75,
      "loom_no": "AJ-075",
      "loom_type_code": "910",
      "work_date": "2026-07-31",
      "shift_id": 3,
      "shift_code": "3",
      "raised_at": "2026-07-31T02:39:00",
      "resolved_at": "2026-07-31T03:02:00",
      "duration_minutes": 23.0,
      "status": "RESOLVED",
      "reason_code": "WEFT_BREAK",
      "reason_label_en": "Weft break",
      "reason_category": "ReasonCategory.MATERIAL",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23268,
      "loom_id": 192,
      "loom_no": "SZ-024",
      "loom_type_code": "340",
      "work_date": "2026-07-31",
      "shift_id": 1,
      "shift_code": "1",
      "raised_at": "2026-07-31T02:35:00",
      "resolved_at": "2026-07-31T03:05:00",
      "duration_minutes": 30.0,
      "status": "RESOLVED",
      "reason_code": "WEFT_BREAK",
      "reason_label_en": "Weft break",
      "reason_category": "ReasonCategory.MATERIAL",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23672,
      "loom_id": 118,
      "loom_no": "AJ-118",
      "loom_type_code": "810",
      "work_date": "2026-07-31",
      "shift_id": 3,
      "shift_code": "3",
      "raised_at": "2026-07-31T02:30:00",
      "resolved_at": "2026-07-31T03:22:00",
      "duration_minutes": 52.0,
      "status": "RESOLVED",
      "reason_code": "AIR_PRESSURE_LOW",
      "reason_label_en": "Air pressure low",
      "reason_category": "ReasonCategory.UTILITY",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23537,
      "loom_id": 23,
      "loom_no": "AJ-023",
      "loom_type_code": "910",
      "work_date": "2026-07-31",
      "shift_id": 3,
      "shift_code": "3",
      "raised_at": "2026-07-31T02:29:00",
      "resolved_at": "2026-07-31T03:24:00",
      "duration_minutes": 55.0,
      "status": "RESOLVED",
      "reason_code": "GAITING",
      "reason_label_en": "Gaiting",
      "reason_category": "ReasonCategory.PLANNED",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23531,
      "loom_id": 20,
      "loom_no": "AJ-020",
      "loom_type_code": "810",
      "work_date": "2026-07-31",
      "shift_id": 3,
      "shift_code": "3",
      "raised_at": "2026-07-31T02:28:00",
      "resolved_at": "2026-07-31T02:54:00",
      "duration_minutes": 26.0,
      "status": "RESOLVED",
      "reason_code": "AIR_PRESSURE_LOW",
      "reason_label_en": "Air pressure low",
      "reason_category": "ReasonCategory.UTILITY",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23168,
      "loom_id": 118,
      "loom_no": "AJ-118",
      "loom_type_code": "810",
      "work_date": "2026-07-31",
      "shift_id": 1,
      "shift_code": "1",
      "raised_at": "2026-07-31T02:27:00",
      "resolved_at": "2026-07-31T03:27:00",
      "duration_minutes": 60.0,
      "status": "RESOLVED",
      "reason_code": "ELECTRICAL_BREAKDOWN",
      "reason_label_en": "Electrical breakdown",
      "reason_category": "ReasonCategory.ELECTRICAL",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23410,
      "loom_id": 118,
      "loom_no": "AJ-118",
      "loom_type_code": "810",
      "work_date": "2026-07-31",
      "shift_id": 2,
      "shift_code": "2",
      "raised_at": "2026-07-31T02:26:00",
      "resolved_at": "2026-07-31T03:11:00",
      "duration_minutes": 45.0,
      "status": "RESOLVED",
      "reason_code": "POWER_FAILURE",
      "reason_label_en": "Power failure",
      "reason_category": "ReasonCategory.ELECTRICAL",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23574,
      "loom_id": 50,
      "loom_no": "AJ-050",
      "loom_type_code": "810",
      "work_date": "2026-07-31",
      "shift_id": 3,
      "shift_code": "3",
      "raised_at": "2026-07-31T02:25:00",
      "resolved_at": "2026-07-31T02:44:00",
      "duration_minutes": 19.0,
      "status": "RESOLVED",
      "reason_code": "VOLTAGE_FLUCTUATION",
      "reason_label_en": "Voltage fluctuation",
      "reason_category": "ReasonCategory.ELECTRICAL",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23692,
      "loom_id": 132,
      "loom_no": "AJ-132",
      "loom_type_code": "810",
      "work_date": "2026-07-31",
      "shift_id": 3,
      "shift_code": "3",
      "raised_at": "2026-07-31T02:24:00",
      "resolved_at": "2026-07-31T03:27:00",
      "duration_minutes": 63.0,
      "status": "RESOLVED",
      "reason_code": "VOLTAGE_FLUCTUATION",
      "reason_label_en": "Voltage fluctuation",
      "reason_category": "ReasonCategory.ELECTRICAL",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23613,
      "loom_id": 76,
      "loom_no": "AJ-076",
      "loom_type_code": "810",
      "work_date": "2026-07-31",
      "shift_id": 3,
      "shift_code": "3",
      "raised_at": "2026-07-31T02:20:00",
      "resolved_at": "2026-07-31T03:14:00",
      "duration_minutes": 54.0,
      "status": "RESOLVED",
      "reason_code": "KNOTTING",
      "reason_label_en": "Knotting",
      "reason_category": "ReasonCategory.PLANNED",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23712,
      "loom_id": 146,
      "loom_no": "AJ-146",
      "loom_type_code": "810",
      "work_date": "2026-07-31",
      "shift_id": 3,
      "shift_code": "3",
      "raised_at": "2026-07-31T02:20:00",
      "resolved_at": "2026-07-31T02:45:00",
      "duration_minutes": 25.0,
      "status": "RESOLVED",
      "reason_code": "VOLTAGE_FLUCTUATION",
      "reason_label_en": "Voltage fluctuation",
      "reason_category": "ReasonCategory.ELECTRICAL",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23245,
      "loom_id": 177,
      "loom_no": "SZ-009",
      "loom_type_code": "280",
      "work_date": "2026-07-31",
      "shift_id": 1,
      "shift_code": "1",
      "raised_at": "2026-07-31T02:19:00",
      "resolved_at": "2026-07-31T02:56:00",
      "duration_minutes": 37.0,
      "status": "RESOLVED",
      "reason_code": "POWER_FAILURE",
      "reason_label_en": "Power failure",
      "reason_category": "ReasonCategory.ELECTRICAL",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23576,
      "loom_id": 51,
      "loom_no": "AJ-051",
      "loom_type_code": "910",
      "work_date": "2026-07-31",
      "shift_id": 3,
      "shift_code": "3",
      "raised_at": "2026-07-31T02:16:00",
      "resolved_at": "2026-07-31T03:02:00",
      "duration_minutes": 46.0,
      "status": "RESOLVED",
      "reason_code": "NO_WEAVER",
      "reason_label_en": "No weaver (absenteeism)",
      "reason_category": "ReasonCategory.MANPOWER",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23523,
      "loom_id": 14,
      "loom_no": "AJ-014",
      "loom_type_code": "810",
      "work_date": "2026-07-31",
      "shift_id": 3,
      "shift_code": "3",
      "raised_at": "2026-07-31T02:11:00",
      "resolved_at": "2026-07-31T02:31:00",
      "duration_minutes": 20.0,
      "status": "RESOLVED",
      "reason_code": "POWER_FAILURE",
      "reason_label_en": "Power failure",
      "reason_category": "ReasonCategory.ELECTRICAL",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23292,
      "loom_id": 20,
      "loom_no": "AJ-020",
      "loom_type_code": "810",
      "work_date": "2026-07-31",
      "shift_id": 2,
      "shift_code": "2",
      "raised_at": "2026-07-31T02:10:00",
      "resolved_at": "2026-07-31T02:31:00",
      "duration_minutes": 21.0,
      "status": "RESOLVED",
      "reason_code": "WEFT_BREAK",
      "reason_label_en": "Weft break",
      "reason_category": "ReasonCategory.MATERIAL",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23715,
      "loom_id": 148,
      "loom_no": "AJ-148",
      "loom_type_code": "810",
      "work_date": "2026-07-31",
      "shift_id": 3,
      "shift_code": "3",
      "raised_at": "2026-07-31T02:07:00",
      "resolved_at": "2026-07-31T02:35:00",
      "duration_minutes": 28.0,
      "status": "RESOLVED",
      "reason_code": "AIR_PRESSURE_LOW",
      "reason_label_en": "Air pressure low",
      "reason_category": "ReasonCategory.UTILITY",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23321,
      "loom_id": 43,
      "loom_no": "AJ-043",
      "loom_type_code": "910",
      "work_date": "2026-07-31",
      "shift_id": 2,
      "shift_code": "2",
      "raised_at": "2026-07-31T02:06:00",
      "resolved_at": "2026-07-31T02:31:00",
      "duration_minutes": 25.0,
      "status": "RESOLVED",
      "reason_code": "ELECTRICAL_BREAKDOWN",
      "reason_label_en": "Electrical breakdown",
      "reason_category": "ReasonCategory.ELECTRICAL",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23373,
      "loom_id": 88,
      "loom_no": "AJ-088",
      "loom_type_code": "810",
      "work_date": "2026-07-31",
      "shift_id": 2,
      "shift_code": "2",
      "raised_at": "2026-07-31T02:06:00",
      "resolved_at": "2026-07-31T02:51:00",
      "duration_minutes": 45.0,
      "status": "RESOLVED",
      "reason_code": "NO_WEAVER",
      "reason_label_en": "No weaver (absenteeism)",
      "reason_category": "ReasonCategory.MANPOWER",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23267,
      "loom_id": 192,
      "loom_no": "SZ-024",
      "loom_type_code": "340",
      "work_date": "2026-07-31",
      "shift_id": 1,
      "shift_code": "1",
      "raised_at": "2026-07-31T02:03:00",
      "resolved_at": "2026-07-31T02:48:00",
      "duration_minutes": 45.0,
      "status": "RESOLVED",
      "reason_code": "ROLL_DOFFING",
      "reason_label_en": "Fabric roll doffing",
      "reason_category": "ReasonCategory.PLANNED",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23446,
      "loom_id": 148,
      "loom_no": "AJ-148",
      "loom_type_code": "810",
      "work_date": "2026-07-31",
      "shift_id": 2,
      "shift_code": "2",
      "raised_at": "2026-07-31T02:01:00",
      "resolved_at": "2026-07-31T02:37:00",
      "duration_minutes": 36.0,
      "status": "RESOLVED",
      "reason_code": "VOLTAGE_FLUCTUATION",
      "reason_label_en": "Voltage fluctuation",
      "reason_category": "ReasonCategory.ELECTRICAL",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23449,
      "loom_id": 150,
      "loom_no": "AJ-150",
      "loom_type_code": "810",
      "work_date": "2026-07-31",
      "shift_id": 2,
      "shift_code": "2",
      "raised_at": "2026-07-31T02:00:00",
      "resolved_at": "2026-07-31T02:30:00",
      "duration_minutes": 30.0,
      "status": "RESOLVED",
      "reason_code": "SORT_BEAM_CHANGE",
      "reason_label_en": "Sort/beam change",
      "reason_category": "ReasonCategory.PLANNED",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23191,
      "loom_id": 135,
      "loom_no": "AJ-135",
      "loom_type_code": "910",
      "work_date": "2026-07-31",
      "shift_id": 1,
      "shift_code": "1",
      "raised_at": "2026-07-31T01:59:00",
      "resolved_at": "2026-07-31T02:36:00",
      "duration_minutes": 37.0,
      "status": "RESOLVED",
      "reason_code": "WEFT_BREAK",
      "reason_label_en": "Weft break",
      "reason_category": "ReasonCategory.MATERIAL",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23499,
      "loom_id": 192,
      "loom_no": "SZ-024",
      "loom_type_code": "340",
      "work_date": "2026-07-31",
      "shift_id": 2,
      "shift_code": "2",
      "raised_at": "2026-07-31T01:58:00",
      "resolved_at": "2026-07-31T03:18:00",
      "duration_minutes": 80.0,
      "status": "RESOLVED",
      "reason_code": "POWER_FAILURE",
      "reason_label_en": "Power failure",
      "reason_category": "ReasonCategory.ELECTRICAL",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23101,
      "loom_id": 69,
      "loom_no": "AJ-069",
      "loom_type_code": "910",
      "work_date": "2026-07-31",
      "shift_id": 1,
      "shift_code": "1",
      "raised_at": "2026-07-31T01:57:00",
      "resolved_at": "2026-07-31T02:35:00",
      "duration_minutes": 38.0,
      "status": "RESOLVED",
      "reason_code": "MECHANICAL_BREAKDOWN",
      "reason_label_en": "Mechanical breakdown",
      "reason_category": "ReasonCategory.MECHANICAL",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23478,
      "loom_id": 178,
      "loom_no": "SZ-010",
      "loom_type_code": "TS",
      "work_date": "2026-07-31",
      "shift_id": 2,
      "shift_code": "2",
      "raised_at": "2026-07-31T01:56:00",
      "resolved_at": "2026-07-31T02:26:00",
      "duration_minutes": 30.0,
      "status": "RESOLVED",
      "reason_code": "ELECTRICAL_BREAKDOWN",
      "reason_label_en": "Electrical breakdown",
      "reason_category": "ReasonCategory.ELECTRICAL",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23738,
      "loom_id": 165,
      "loom_no": "AJ-165",
      "loom_type_code": "910",
      "work_date": "2026-07-31",
      "shift_id": 3,
      "shift_code": "3",
      "raised_at": "2026-07-31T01:55:00",
      "resolved_at": "2026-07-31T02:23:00",
      "duration_minutes": 28.0,
      "status": "RESOLVED",
      "reason_code": "ELECTRICAL_BREAKDOWN",
      "reason_label_en": "Electrical breakdown",
      "reason_category": "ReasonCategory.ELECTRICAL",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23644,
      "loom_id": 96,
      "loom_no": "AJ-096",
      "loom_type_code": "810",
      "work_date": "2026-07-31",
      "shift_id": 3,
      "shift_code": "3",
      "raised_at": "2026-07-31T01:54:00",
      "resolved_at": "2026-07-31T02:57:00",
      "duration_minutes": 63.0,
      "status": "RESOLVED",
      "reason_code": "NO_WEAVER",
      "reason_label_en": "No weaver (absenteeism)",
      "reason_category": "ReasonCategory.MANPOWER",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23130,
      "loom_id": 88,
      "loom_no": "AJ-088",
      "loom_type_code": "810",
      "work_date": "2026-07-31",
      "shift_id": 1,
      "shift_code": "1",
      "raised_at": "2026-07-31T01:52:00",
      "resolved_at": "2026-07-31T02:32:00",
      "duration_minutes": 40.0,
      "status": "RESOLVED",
      "reason_code": "MECHANICAL_BREAKDOWN",
      "reason_label_en": "Mechanical breakdown",
      "reason_category": "ReasonCategory.MECHANICAL",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23691,
      "loom_id": 132,
      "loom_no": "AJ-132",
      "loom_type_code": "810",
      "work_date": "2026-07-31",
      "shift_id": 3,
      "shift_code": "3",
      "raised_at": "2026-07-31T01:51:00",
      "resolved_at": "2026-07-31T02:21:00",
      "duration_minutes": 30.0,
      "status": "RESOLVED",
      "reason_code": "ELECTRICAL_BREAKDOWN",
      "reason_label_en": "Electrical breakdown",
      "reason_category": "ReasonCategory.ELECTRICAL",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23510,
      "loom_id": 6,
      "loom_no": "AJ-006",
      "loom_type_code": "810",
      "work_date": "2026-07-31",
      "shift_id": 3,
      "shift_code": "3",
      "raised_at": "2026-07-31T01:50:00",
      "resolved_at": "2026-07-31T02:31:00",
      "duration_minutes": 41.0,
      "status": "RESOLVED",
      "reason_code": "NO_WEAVER",
      "reason_label_en": "No weaver (absenteeism)",
      "reason_category": "ReasonCategory.MANPOWER",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23609,
      "loom_id": 75,
      "loom_no": "AJ-075",
      "loom_type_code": "910",
      "work_date": "2026-07-31",
      "shift_id": 3,
      "shift_code": "3",
      "raised_at": "2026-07-31T01:50:00",
      "resolved_at": "2026-07-31T02:30:00",
      "duration_minutes": 40.0,
      "status": "RESOLVED",
      "reason_code": "KNOTTING",
      "reason_label_en": "Knotting",
      "reason_category": "ReasonCategory.PLANNED",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23187,
      "loom_id": 132,
      "loom_no": "AJ-132",
      "loom_type_code": "810",
      "work_date": "2026-07-31",
      "shift_id": 1,
      "shift_code": "1",
      "raised_at": "2026-07-31T01:50:00",
      "resolved_at": "2026-07-31T03:10:00",
      "duration_minutes": 80.0,
      "status": "RESOLVED",
      "reason_code": "MECHANICAL_BREAKDOWN",
      "reason_label_en": "Mechanical breakdown",
      "reason_category": "ReasonCategory.MECHANICAL",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23205,
      "loom_id": 146,
      "loom_no": "AJ-146",
      "loom_type_code": "810",
      "work_date": "2026-07-31",
      "shift_id": 1,
      "shift_code": "1",
      "raised_at": "2026-07-31T01:50:00",
      "resolved_at": "2026-07-31T02:37:00",
      "duration_minutes": 47.0,
      "status": "RESOLVED",
      "reason_code": "WEFT_FEEDER_FAULT",
      "reason_label_en": "Weft feeder fault",
      "reason_category": "ReasonCategory.MECHANICAL",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23495,
      "loom_id": 190,
      "loom_no": "SZ-022",
      "loom_type_code": "TS",
      "work_date": "2026-07-31",
      "shift_id": 2,
      "shift_code": "2",
      "raised_at": "2026-07-31T01:46:00",
      "resolved_at": "2026-07-31T02:23:00",
      "duration_minutes": 37.0,
      "status": "RESOLVED",
      "reason_code": "MECHANICAL_BREAKDOWN",
      "reason_label_en": "Mechanical breakdown",
      "reason_category": "ReasonCategory.MECHANICAL",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23300,
      "loom_id": 25,
      "loom_no": "AJ-025",
      "loom_type_code": "910",
      "work_date": "2026-07-31",
      "shift_id": 2,
      "shift_code": "2",
      "raised_at": "2026-07-31T01:43:00",
      "resolved_at": "2026-07-31T02:28:00",
      "duration_minutes": 45.0,
      "status": "RESOLVED",
      "reason_code": "GAITING",
      "reason_label_en": "Gaiting",
      "reason_category": "ReasonCategory.PLANNED",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23604,
      "loom_id": 72,
      "loom_no": "AJ-072",
      "loom_type_code": "810",
      "work_date": "2026-07-31",
      "shift_id": 3,
      "shift_code": "3",
      "raised_at": "2026-07-31T01:43:00",
      "resolved_at": "2026-07-31T02:15:00",
      "duration_minutes": 32.0,
      "status": "RESOLVED",
      "reason_code": "GAITING",
      "reason_label_en": "Gaiting",
      "reason_category": "ReasonCategory.PLANNED",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23688,
      "loom_id": 130,
      "loom_no": "AJ-130",
      "loom_type_code": "810",
      "work_date": "2026-07-31",
      "shift_id": 3,
      "shift_code": "3",
      "raised_at": "2026-07-31T01:43:00",
      "resolved_at": "2026-07-31T02:06:00",
      "duration_minutes": 23.0,
      "status": "RESOLVED",
      "reason_code": "MECHANICAL_BREAKDOWN",
      "reason_label_en": "Mechanical breakdown",
      "reason_category": "ReasonCategory.MECHANICAL",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23686,
      "loom_id": 129,
      "loom_no": "AJ-129",
      "loom_type_code": "910",
      "work_date": "2026-07-31",
      "shift_id": 3,
      "shift_code": "3",
      "raised_at": "2026-07-31T01:42:00",
      "resolved_at": "2026-07-31T02:26:00",
      "duration_minutes": 44.0,
      "status": "RESOLVED",
      "reason_code": "MECHANICAL_BREAKDOWN",
      "reason_label_en": "Mechanical breakdown",
      "reason_category": "ReasonCategory.MECHANICAL",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23635,
      "loom_id": 92,
      "loom_no": "AJ-092",
      "loom_type_code": "810",
      "work_date": "2026-07-31",
      "shift_id": 3,
      "shift_code": "3",
      "raised_at": "2026-07-31T01:41:00",
      "resolved_at": "2026-07-31T02:30:00",
      "duration_minutes": 49.0,
      "status": "RESOLVED",
      "reason_code": "ELECTRICAL_BREAKDOWN",
      "reason_label_en": "Electrical breakdown",
      "reason_category": "ReasonCategory.ELECTRICAL",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23183,
      "loom_id": 129,
      "loom_no": "AJ-129",
      "loom_type_code": "910",
      "work_date": "2026-07-31",
      "shift_id": 1,
      "shift_code": "1",
      "raised_at": "2026-07-31T01:41:00",
      "resolved_at": "2026-07-31T02:13:00",
      "duration_minutes": 32.0,
      "status": "RESOLVED",
      "reason_code": "WARP_BREAK",
      "reason_label_en": "Warp break",
      "reason_category": "ReasonCategory.MATERIAL",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23252,
      "loom_id": 182,
      "loom_no": "SZ-014",
      "loom_type_code": "TS",
      "work_date": "2026-07-31",
      "shift_id": 1,
      "shift_code": "1",
      "raised_at": "2026-07-31T01:41:00",
      "resolved_at": "2026-07-31T02:24:00",
      "duration_minutes": 43.0,
      "status": "RESOLVED",
      "reason_code": "SORT_BEAM_CHANGE",
      "reason_label_en": "Sort/beam change",
      "reason_category": "ReasonCategory.PLANNED",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23697,
      "loom_id": 135,
      "loom_no": "AJ-135",
      "loom_type_code": "910",
      "work_date": "2026-07-31",
      "shift_id": 3,
      "shift_code": "3",
      "raised_at": "2026-07-31T01:40:00",
      "resolved_at": "2026-07-31T02:21:00",
      "duration_minutes": 41.0,
      "status": "RESOLVED",
      "reason_code": "VOLTAGE_FLUCTUATION",
      "reason_label_en": "Voltage fluctuation",
      "reason_category": "ReasonCategory.ELECTRICAL",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    },
    {
      "stop_event_id": 23745,
      "loom_id": 170,
      "loom_no": "SZ-002",
      "loom_type_code": "TS",
      "work_date": "2026-07-31",
      "shift_id": 3,
      "shift_code": "3",
      "raised_at": "2026-07-31T01:40:00",
      "resolved_at": "2026-07-31T02:07:00",
      "duration_minutes": 27.0,
      "status": "RESOLVED",
      "reason_code": "WEFT_FEEDER_FAULT",
      "reason_label_en": "Weft feeder fault",
      "reason_category": "ReasonCategory.MECHANICAL",
      "raw_remark": null,
      "failed_component": null,
      "fix_action": null
    }
  ],
  "anomalies": {
    "summary": {
      "date": "2026-07-31",
      "unit_code": "ATM",
      "total_anomalies": 186,
      "critical": 54,
      "warning": 132,
      "info": 0,
      "total_meters_exposure": 3110.3,
      "total_rupee_exposure": 124412.0,
      "detection_engine_status": "ONLINE",
      "evaluated_looms_count": 192
    },
    "timeline": [
      {
        "time_slot": "06:00",
        "count": 0,
        "has_critical": false,
        "anomalies": []
      },
      {
        "time_slot": "08:00",
        "count": 0,
        "has_critical": false,
        "anomalies": []
      },
      {
        "time_slot": "10:00",
        "count": 0,
        "has_critical": false,
        "anomalies": []
      },
      {
        "time_slot": "12:00",
        "count": 0,
        "has_critical": false,
        "anomalies": []
      },
      {
        "time_slot": "14:00",
        "count": 184,
        "has_critical": true,
        "anomalies": [
          {
            "id": "ANOM-CLUSTER-19-23034",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-019",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-37-23314",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "AJ-037",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-50-23329",
            "title": "Rapid Stoppage Cluster (7 stops in short window)",
            "loom": "AJ-050",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-65-23592",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "AJ-065",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-87-23127",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-087",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-90-23133",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-090",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-96-23383",
            "title": "Rapid Stoppage Cluster (6 stops in short window)",
            "loom": "AJ-096",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-106-23395",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-106",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-111-23400",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "AJ-111",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-121-23173",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-121",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-132-23186",
            "title": "Rapid Stoppage Cluster (7 stops in short window)",
            "loom": "AJ-132",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-142-23200",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-142",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-152-23214",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-152",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-157-23726",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-157",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-173-23471",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "SZ-005",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-177-23753",
            "title": "Rapid Stoppage Cluster (7 stops in short window)",
            "loom": "SZ-009",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-178-23756",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "SZ-010",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-186-23767",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "SZ-018",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-187-23258",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "SZ-019",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-192-23775",
            "title": "Rapid Stoppage Cluster (8 stops in short window)",
            "loom": "SZ-024",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-3-23014",
            "title": "Rapid Stoppage Cluster (7 stops in short window)",
            "loom": "AJ-003",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-7-23021",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-007",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-25-23539",
            "title": "Rapid Stoppage Cluster (6 stops in short window)",
            "loom": "AJ-025",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-51-23076",
            "title": "Rapid Stoppage Cluster (6 stops in short window)",
            "loom": "AJ-051",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-63-23346",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-063",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-70-23103",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-070",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-74-23606",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-074",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-100-23145",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-100",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-104-23653",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-104",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-117-23164",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-117",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-128-23683",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-128",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-136-23430",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-136",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-138-23195",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-138",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-150-23448",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-150",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-154-23722",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-154",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-180-23760",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "SZ-012",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-191-23265",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "SZ-023",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-13-23282",
            "title": "Rapid Stoppage Cluster (6 stops in short window)",
            "loom": "AJ-013",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-22-23534",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-022",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-28-23544",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-028",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-43-23320",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-043",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-45-23323",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-045",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-59-23340",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-059",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-99-23144",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-099",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-101-23649",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-101",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-108-23153",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-108",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-140-23434",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-140",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-144-23202",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-144",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-169-23234",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "SZ-001",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-174-23240",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "SZ-006",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-2-23012",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "AJ-002",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-20-23036",
            "title": "Rapid Stoppage Cluster (7 stops in short window)",
            "loom": "AJ-020",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-41-23560",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "AJ-041",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-57-23083",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-057",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-58-23339",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "AJ-058",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-81-23620",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-081",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-95-23381",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "AJ-095",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-105-23655",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-105",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-110-23155",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-110",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-113-23403",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-113",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-126-23178",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-126",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-131-23425",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-131",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-137-23699",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-137",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-146-23711",
            "title": "Rapid Stoppage Cluster (7 stops in short window)",
            "loom": "AJ-146",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-151-23450",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "AJ-151",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-158-23221",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-158",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-166-23231",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-166",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-168-23741",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-168",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-1-23011",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-001",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-5-23274",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-005",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-11-23025",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-011",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-23-23040",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "AJ-023",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-31-23049",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-031",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-40-23317",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-040",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-54-23579",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-054",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-60-23585",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "AJ-060",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-72-23355",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "AJ-072",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-86-23126",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-086",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-109-23398",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-109",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-125-23679",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-125",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-130-23424",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-130",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-149-23716",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-149",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-163-23733",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "AJ-163",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-164-23462",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "AJ-164",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-170-23235",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "SZ-002",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-171-23469",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "SZ-003",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-12-23026",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-012",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-14-23521",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "AJ-014",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-21-23294",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-021",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-39-23316",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-039",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-53-23334",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-053",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-94-23137",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-094",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-114-23404",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-114",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-116-23163",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-116",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-120-23171",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-120",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-122-23174",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-122",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-133-23427",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-133",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-143-23201",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-143",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-148-23445",
            "title": "Rapid Stoppage Cluster (6 stops in short window)",
            "loom": "AJ-148",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-181-23482",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "SZ-013",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-182-23762",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "SZ-014",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-6-23509",
            "title": "Rapid Stoppage Cluster (6 stops in short window)",
            "loom": "AJ-006",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-18-23033",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-018",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-26-23542",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-026",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-34-23552",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-034",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-36-23313",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-036",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-52-23577",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-052",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-73-23107",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-073",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-76-23611",
            "title": "Rapid Stoppage Cluster (7 stops in short window)",
            "loom": "AJ-076",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-118-23670",
            "title": "Rapid Stoppage Cluster (10 stops in short window)",
            "loom": "AJ-118",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-124-23176",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-124",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-147-23443",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-147",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-159-23458",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-159",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-176-23474",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "SZ-008",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-16-23286",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-016",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-32-23050",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-032",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-46-23070",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-046",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-67-23350",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-067",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-69-23596",
            "title": "Rapid Stoppage Cluster (6 stops in short window)",
            "loom": "AJ-069",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-97-23385",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "AJ-097",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-119-23673",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-119",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-123-23175",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-123",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-190-23493",
            "title": "Rapid Stoppage Cluster (6 stops in short window)",
            "loom": "SZ-022",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-29-23304",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-029",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-48-23072",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "AJ-048",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-56-23581",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-056",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-103-23392",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-103",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-112-23402",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-112",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-141-23198",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-141",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-24-23297",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-024",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-55-23081",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-055",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-71-23104",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "AJ-071",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-102-23147",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-102",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-127-23420",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "AJ-127",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-139-23702",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "AJ-139",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-156-23724",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-156",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-172-23238",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "SZ-004",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-27-23302",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-027",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-30-23546",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "AJ-030",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-44-23068",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-044",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-107-23396",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-107",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-167-23465",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-167",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-4-23506",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-004",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-35-23054",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-035",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-38-23059",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-038",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-89-23630",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-089",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-93-23379",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-093",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-134-23428",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-134",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-184-23485",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "SZ-016",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-189-23492",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "SZ-021",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-68-23595",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-068",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-98-23646",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-098",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-115-23666",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "AJ-115",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-175-23750",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "SZ-007",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-80-23619",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-080",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-85-23625",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "AJ-085",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-129-23422",
            "title": "Rapid Stoppage Cluster (6 stops in short window)",
            "loom": "AJ-129",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-160-23460",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-160",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-49-23073",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-049",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-64-23591",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-064",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-75-23109",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "AJ-075",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-88-23129",
            "title": "Rapid Stoppage Cluster (6 stops in short window)",
            "loom": "AJ-088",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-91-23633",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-091",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-135-23429",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "AJ-135",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-179-23758",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "SZ-011",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-185-23487",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "SZ-017",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-33-23551",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-033",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-78-23616",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-078",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-82-23365",
            "title": "Rapid Stoppage Cluster (6 stops in short window)",
            "loom": "AJ-082",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-92-23135",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "AJ-092",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-183-23763",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "SZ-015",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-42-23066",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-042",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-15-23524",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-015",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-79-23362",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "AJ-079",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-145-23710",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-145",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-9-23023",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-009",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-83-23366",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-083",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-165-23736",
            "title": "Rapid Stoppage Cluster (5 stops in short window)",
            "loom": "AJ-165",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-CLUSTER-61-23089",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-061",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-62-23588",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "AJ-062",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-8-23022",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-008",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-17-23527",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-017",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-188-23491",
            "title": "Rapid Stoppage Cluster (4 stops in short window)",
            "loom": "SZ-020",
            "severity": "WARNING"
          },
          {
            "id": "ANOM-CLUSTER-155-23218",
            "title": "Rapid Stoppage Cluster (3 stops in short window)",
            "loom": "AJ-155",
            "severity": "WARNING"
          }
        ]
      },
      {
        "time_slot": "16:00",
        "count": 2,
        "has_critical": true,
        "anomalies": [
          {
            "id": "ANOM-OUTLIER-23530",
            "title": "Prolonged Reasoncategory.Mechanical Outlier (133 min)",
            "loom": "AJ-020",
            "severity": "CRITICAL"
          },
          {
            "id": "ANOM-OUTLIER-23629",
            "title": "Prolonged Reasoncategory.Manpower Outlier (123 min)",
            "loom": "AJ-088",
            "severity": "CRITICAL"
          }
        ]
      },
      {
        "time_slot": "18:00",
        "count": 0,
        "has_critical": false,
        "anomalies": []
      },
      {
        "time_slot": "20:00",
        "count": 0,
        "has_critical": false,
        "anomalies": []
      },
      {
        "time_slot": "22:00",
        "count": 0,
        "has_critical": false,
        "anomalies": []
      }
    ],
    "anomalies": [
      {
        "anomaly_id": "ANOM-CLUSTER-19-23034",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-019",
        "affected_loom_id": 19,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:00 \u2013 00:26",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 26 minutes. Dominant symptom: Warp break.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "59 weft / 17 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "93.7%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-019 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-37-23314",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-037",
        "affected_loom_id": 37,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:00 \u2013 00:23",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 23 minutes. Dominant symptom: Sort/beam change.",
        "impact": {
          "lost_meters": 22.5,
          "revenue_exposure": 900.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "55 weft / 23 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "92.7%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-037 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-50-23329",
        "title": "Rapid Stoppage Cluster (7 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-050",
        "affected_loom_id": 50,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:00 \u2013 00:03",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "7 stops / shift",
        "current_value_val": 7.0,
        "deviation_pct": 600,
        "deviation_label": "+600% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 7 consecutive ticketed stops within 3 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 31.5,
          "revenue_exposure": 1260.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "59 weft / 33 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "85.2%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-050 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-65-23592",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-065",
        "affected_loom_id": 65,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:00 \u2013 00:22",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 22 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 22.5,
          "revenue_exposure": 900.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "48 weft / 14 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.7%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-065 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-87-23127",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-087",
        "affected_loom_id": 87,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:00 \u2013 00:12",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 12 minutes. Dominant symptom: Warp break.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "38 weft / 12 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "91.9%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-087 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-90-23133",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-090",
        "affected_loom_id": 90,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:00 \u2013 00:22",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 22 minutes. Dominant symptom: No weaver (absenteeism).",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "42 weft / 14 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "93.3%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-090 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-96-23383",
        "title": "Rapid Stoppage Cluster (6 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-096",
        "affected_loom_id": 96,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:00 \u2013 00:16",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "6 stops / shift",
        "current_value_val": 6.0,
        "deviation_pct": 500,
        "deviation_label": "+500% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 6 consecutive ticketed stops within 16 minutes. Dominant symptom: Weft feeder fault.",
        "impact": {
          "lost_meters": 27.0,
          "revenue_exposure": 1080.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "63 weft / 43 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "86.4%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-096 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-106-23395",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-106",
        "affected_loom_id": 106,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:00 \u2013 00:16",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 16 minutes. Dominant symptom: Sort/beam change.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "56 weft / 23 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "97.6%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-106 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-111-23400",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-111",
        "affected_loom_id": 111,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:00 \u2013 00:24",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 24 minutes. Dominant symptom: Warp break.",
        "impact": {
          "lost_meters": 22.5,
          "revenue_exposure": 900.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "34 weft / 23 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "92.0%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-111 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-121-23173",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-121",
        "affected_loom_id": 121,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:00 \u2013 00:24",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 24 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "68 weft / 17 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "95.6%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-121 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-132-23186",
        "title": "Rapid Stoppage Cluster (7 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-132",
        "affected_loom_id": 132,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:00 \u2013 00:09",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "7 stops / shift",
        "current_value_val": 7.0,
        "deviation_pct": 600,
        "deviation_label": "+600% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 7 consecutive ticketed stops within 9 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 31.5,
          "revenue_exposure": 1260.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "91 weft / 67 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "77.2%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-132 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-142-23200",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-142",
        "affected_loom_id": 142,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:00 \u2013 00:28",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 28 minutes. Dominant symptom: Weft feeder fault.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "46 weft / 22 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.4%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-142 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-152-23214",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-152",
        "affected_loom_id": 152,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:00 \u2013 00:14",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 14 minutes. Dominant symptom: Air pressure low.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "40 weft / 16 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "96.5%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-152 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-157-23726",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-157",
        "affected_loom_id": 157,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:00 \u2013 00:15",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 15 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "58 weft / 22 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.0%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-157 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-173-23471",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "SZ-005",
        "affected_loom_id": 173,
        "loom_type": "280",
        "shed_code": "SULZER",
        "time_window": "00:00 \u2013 00:18",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 18 minutes. Dominant symptom: Air pressure low.",
        "impact": {
          "lost_meters": 5.2,
          "revenue_exposure": 208.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "47 weft / 14 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "89.4%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "12s VSF Slub X 12s VSF Slub /56X44-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom SZ-005 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-177-23753",
        "title": "Rapid Stoppage Cluster (7 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "SZ-009",
        "affected_loom_id": 177,
        "loom_type": "280",
        "shed_code": "SULZER",
        "time_window": "00:00 \u2013 00:27",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "7 stops / shift",
        "current_value_val": 7.0,
        "deviation_pct": 600,
        "deviation_label": "+600% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 7 consecutive ticketed stops within 27 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 8.2,
          "revenue_exposure": 328.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "51 weft / 22 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "82.3%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF Slub X 30s VSF Slub /90X68-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom SZ-009 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-178-23756",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "SZ-010",
        "affected_loom_id": 178,
        "loom_type": "TS",
        "shed_code": "SULZER",
        "time_window": "00:00 \u2013 00:29",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 29 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 7.4,
          "revenue_exposure": 296.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "64 weft / 30 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "79.2%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VOT /68X57-48\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom SZ-010 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-186-23767",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "SZ-018",
        "affected_loom_id": 186,
        "loom_type": "TS",
        "shed_code": "SULZER",
        "time_window": "00:00 \u2013 00:23",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 23 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 4.7,
          "revenue_exposure": 188.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "54 weft / 6 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "90.0%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF Slub X 30s VSF Slub /90X68-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom SZ-018 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-187-23258",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "SZ-019",
        "affected_loom_id": 187,
        "loom_type": "SZ",
        "shed_code": "SULZER",
        "time_window": "00:00 \u2013 00:07",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 7 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 7.4,
          "revenue_exposure": 296.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "49 weft / 11 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "89.2%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VOT /68X57-48\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom SZ-019 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-192-23775",
        "title": "Rapid Stoppage Cluster (8 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "SZ-024",
        "affected_loom_id": 192,
        "loom_type": "340",
        "shed_code": "SULZER",
        "time_window": "00:00 \u2013 00:18",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "8 stops / shift",
        "current_value_val": 8.0,
        "deviation_pct": 700,
        "deviation_label": "+700% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 8 consecutive ticketed stops within 18 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 11.8,
          "revenue_exposure": 472.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "91 weft / 49 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "78.3%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VOT /68X57-48\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom SZ-024 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-3-23014",
        "title": "Rapid Stoppage Cluster (7 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-003",
        "affected_loom_id": 3,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:01 \u2013 00:21",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "7 stops / shift",
        "current_value_val": 7.0,
        "deviation_pct": 600,
        "deviation_label": "+600% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 7 consecutive ticketed stops within 20 minutes. Dominant symptom: Weft feeder fault.",
        "impact": {
          "lost_meters": 31.5,
          "revenue_exposure": 1260.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "99 weft / 49 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "78.9%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-003 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-7-23021",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-007",
        "affected_loom_id": 7,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:01 \u2013 00:27",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 26 minutes. Dominant symptom: Mechanical breakdown.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "59 weft / 11 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "91.4%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-007 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-25-23539",
        "title": "Rapid Stoppage Cluster (6 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-025",
        "affected_loom_id": 25,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:01 \u2013 00:07",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "6 stops / shift",
        "current_value_val": 6.0,
        "deviation_pct": 500,
        "deviation_label": "+500% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 6 consecutive ticketed stops within 6 minutes. Dominant symptom: Weft break.",
        "impact": {
          "lost_meters": 27.0,
          "revenue_exposure": 1080.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "84 weft / 37 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "85.1%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-025 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-51-23076",
        "title": "Rapid Stoppage Cluster (6 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-051",
        "affected_loom_id": 51,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:01 \u2013 00:25",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "6 stops / shift",
        "current_value_val": 6.0,
        "deviation_pct": 500,
        "deviation_label": "+500% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 6 consecutive ticketed stops within 24 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 27.0,
          "revenue_exposure": 1080.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "72 weft / 58 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "81.0%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-051 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-63-23346",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-063",
        "affected_loom_id": 63,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:01 \u2013 00:04",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 3 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "65 weft / 12 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.0%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-063 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-70-23103",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-070",
        "affected_loom_id": 70,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:01 \u2013 00:10",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 9 minutes. Dominant symptom: Weft break.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "53 weft / 17 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "92.8%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-070 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-74-23606",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-074",
        "affected_loom_id": 74,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:01 \u2013 00:28",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 27 minutes. Dominant symptom: Gaiting.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "48 weft / 15 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "93.5%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-074 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-100-23145",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-100",
        "affected_loom_id": 100,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:01 \u2013 00:25",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 24 minutes. Dominant symptom: Air pressure low.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "45 weft / 13 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "96.1%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-100 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-104-23653",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-104",
        "affected_loom_id": 104,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:01 \u2013 00:18",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 17 minutes. Dominant symptom: Weft break.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "50 weft / 23 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.0%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-104 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-117-23164",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-117",
        "affected_loom_id": 117,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:01 \u2013 00:29",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 28 minutes. Dominant symptom: Gaiting.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "47 weft / 8 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "90.6%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-117 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-128-23683",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-128",
        "affected_loom_id": 128,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:01 \u2013 00:28",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 27 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "45 weft / 29 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "88.4%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-128 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-136-23430",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-136",
        "affected_loom_id": 136,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:01 \u2013 00:13",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 12 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "36 weft / 11 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.5%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-136 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-138-23195",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-138",
        "affected_loom_id": 138,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:01 \u2013 00:27",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 26 minutes. Dominant symptom: Weft feeder fault.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "44 weft / 61 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "82.5%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-138 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-150-23448",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-150",
        "affected_loom_id": 150,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:01 \u2013 00:15",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 14 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "66 weft / 28 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "85.2%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-150 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-154-23722",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-154",
        "affected_loom_id": 154,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:01 \u2013 00:21",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 20 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "81 weft / 43 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "83.1%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-154 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-180-23760",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "SZ-012",
        "affected_loom_id": 180,
        "loom_type": "340",
        "shed_code": "SULZER",
        "time_window": "00:01 \u2013 00:22",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 21 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 5.2,
          "revenue_exposure": 208.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "50 weft / 14 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "91.7%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "12s VSF Slub X 12s VSF Slub /56X44-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom SZ-012 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-191-23265",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "SZ-023",
        "affected_loom_id": 191,
        "loom_type": "SZ",
        "shed_code": "SULZER",
        "time_window": "00:01 \u2013 00:14",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 13 minutes. Dominant symptom: Air pressure low.",
        "impact": {
          "lost_meters": 5.2,
          "revenue_exposure": 208.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "53 weft / 10 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "89.8%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "12s VSF Slub X 12s VSF Slub /56X44-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom SZ-023 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-13-23282",
        "title": "Rapid Stoppage Cluster (6 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-013",
        "affected_loom_id": 13,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:02 \u2013 00:09",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "6 stops / shift",
        "current_value_val": 6.0,
        "deviation_pct": 500,
        "deviation_label": "+500% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 6 consecutive ticketed stops within 7 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 33.3,
          "revenue_exposure": 1332.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "45 weft / 12 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "93.3%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "20s OE X 21s Cotton Flax /56X44-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-013 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-22-23534",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-022",
        "affected_loom_id": 22,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:02 \u2013 00:26",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 24 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "59 weft / 7 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "96.0%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-022 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-28-23544",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-028",
        "affected_loom_id": 28,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:02 \u2013 00:13",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 11 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "53 weft / 9 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "90.9%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-028 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-43-23320",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-043",
        "affected_loom_id": 43,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:02 \u2013 00:08",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 6 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "76 weft / 42 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "79.1%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-043 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-45-23323",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-045",
        "affected_loom_id": 45,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:02 \u2013 00:14",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 12 minutes. Dominant symptom: Air pressure low.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "61 weft / 15 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "93.2%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-045 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-59-23340",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-059",
        "affected_loom_id": 59,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:02 \u2013 00:20",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 18 minutes. Dominant symptom: Knotting.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "50 weft / 20 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "92.7%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-059 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-99-23144",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-099",
        "affected_loom_id": 99,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:02 \u2013 00:22",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 20 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "56 weft / 18 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.2%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-099 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-101-23649",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-101",
        "affected_loom_id": 101,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:02 \u2013 00:26",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 24 minutes. Dominant symptom: Warp break.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "51 weft / 10 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.2%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-101 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-108-23153",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-108",
        "affected_loom_id": 108,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:02 \u2013 00:24",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 22 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "60 weft / 18 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "95.9%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-108 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-140-23434",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-140",
        "affected_loom_id": 140,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:02 \u2013 00:23",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 21 minutes. Dominant symptom: No weaver (absenteeism).",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "61 weft / 21 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "93.8%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-140 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-144-23202",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-144",
        "affected_loom_id": 144,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:02 \u2013 00:20",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 18 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "47 weft / 10 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "92.0%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-144 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-169-23234",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "SZ-001",
        "affected_loom_id": 169,
        "loom_type": "280",
        "shed_code": "SULZER",
        "time_window": "00:02 \u2013 00:28",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 26 minutes. Dominant symptom: Sort/beam change.",
        "impact": {
          "lost_meters": 5.2,
          "revenue_exposure": 208.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "40 weft / 19 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "91.7%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "12s VSF Slub X 12s VSF Slub /56X44-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom SZ-001 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-174-23240",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "SZ-006",
        "affected_loom_id": 174,
        "loom_type": "TS",
        "shed_code": "SULZER",
        "time_window": "00:02 \u2013 00:23",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 21 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 4.4,
          "revenue_exposure": 176.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "43 weft / 12 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "92.6%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VOT /68X57-48\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom SZ-006 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-2-23012",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-002",
        "affected_loom_id": 2,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:03 \u2013 00:20",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 17 minutes. Dominant symptom: Weft break.",
        "impact": {
          "lost_meters": 22.5,
          "revenue_exposure": 900.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "60 weft / 13 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "92.7%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-002 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-20-23036",
        "title": "Rapid Stoppage Cluster (7 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-020",
        "affected_loom_id": 20,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:03 \u2013 00:24",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "7 stops / shift",
        "current_value_val": 7.0,
        "deviation_pct": 600,
        "deviation_label": "+600% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 7 consecutive ticketed stops within 21 minutes. Dominant symptom: Warp break.",
        "impact": {
          "lost_meters": 13.6,
          "revenue_exposure": 544.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "84 weft / 31 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "74.0%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "60s Excel X 40s Vortex /165X110-133\" 4/1 Satin",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-020 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-41-23560",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-041",
        "affected_loom_id": 41,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:03 \u2013 00:29",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 26 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 22.5,
          "revenue_exposure": 900.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "67 weft / 32 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "85.1%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-041 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-57-23083",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-057",
        "affected_loom_id": 57,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:03 \u2013 00:14",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 11 minutes. Dominant symptom: No weaver (absenteeism).",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "49 weft / 17 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.2%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-057 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-58-23339",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-058",
        "affected_loom_id": 58,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:03 \u2013 00:18",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 15 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 22.5,
          "revenue_exposure": 900.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "41 weft / 14 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.0%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-058 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-81-23620",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-081",
        "affected_loom_id": 81,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:03 \u2013 00:13",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 10 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "54 weft / 16 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "91.0%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-081 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-95-23381",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-095",
        "affected_loom_id": 95,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:03 \u2013 00:28",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 25 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 22.5,
          "revenue_exposure": 900.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "57 weft / 22 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "93.2%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-095 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-105-23655",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-105",
        "affected_loom_id": 105,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:03 \u2013 00:28",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 25 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "43 weft / 19 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "95.3%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-105 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-110-23155",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-110",
        "affected_loom_id": 110,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:03 \u2013 00:12",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 9 minutes. Dominant symptom: Sort/beam change.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "79 weft / 23 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "88.0%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-110 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-113-23403",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-113",
        "affected_loom_id": 113,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:03 \u2013 00:17",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 14 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "48 weft / 12 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "92.2%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-113 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-126-23178",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-126",
        "affected_loom_id": 126,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:03 \u2013 00:14",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 11 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "66 weft / 18 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "95.9%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-126 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-131-23425",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-131",
        "affected_loom_id": 131,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:03 \u2013 00:29",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 26 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "41 weft / 8 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "96.5%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-131 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-137-23699",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-137",
        "affected_loom_id": 137,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:03 \u2013 00:29",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 26 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "52 weft / 10 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "93.4%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-137 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-146-23711",
        "title": "Rapid Stoppage Cluster (7 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-146",
        "affected_loom_id": 146,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:03 \u2013 00:16",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "7 stops / shift",
        "current_value_val": 7.0,
        "deviation_pct": 600,
        "deviation_label": "+600% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 7 consecutive ticketed stops within 13 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 31.5,
          "revenue_exposure": 1260.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "83 weft / 44 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "80.8%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-146 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-151-23450",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-151",
        "affected_loom_id": 151,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:03 \u2013 00:17",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 14 minutes. Dominant symptom: No weaver (absenteeism).",
        "impact": {
          "lost_meters": 22.5,
          "revenue_exposure": 900.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "36 weft / 20 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "96.4%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-151 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-158-23221",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-158",
        "affected_loom_id": 158,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:03 \u2013 00:17",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 14 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "52 weft / 15 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "96.2%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-158 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-166-23231",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-166",
        "affected_loom_id": 166,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:03 \u2013 00:20",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 17 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "56 weft / 12 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "92.7%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-166 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-168-23741",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-168",
        "affected_loom_id": 168,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:03 \u2013 00:21",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 18 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "43 weft / 11 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.0%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-168 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-1-23011",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-001",
        "affected_loom_id": 1,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:04 \u2013 00:22",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 18 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "46 weft / 15 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "95.7%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-001 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-5-23274",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-005",
        "affected_loom_id": 5,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:04 \u2013 00:07",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 3 minutes. Dominant symptom: Mechanical breakdown.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "48 weft / 18 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "92.5%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-005 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-11-23025",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-011",
        "affected_loom_id": 11,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:04 \u2013 00:25",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 21 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "48 weft / 14 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "93.8%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-011 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-23-23040",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-023",
        "affected_loom_id": 23,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:04 \u2013 00:19",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 15 minutes. Dominant symptom: Weft feeder fault.",
        "impact": {
          "lost_meters": 22.5,
          "revenue_exposure": 900.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "85 weft / 43 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "80.8%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-023 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-31-23049",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-031",
        "affected_loom_id": 31,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:04 \u2013 00:28",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 24 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "54 weft / 16 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "93.6%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-031 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-40-23317",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-040",
        "affected_loom_id": 40,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:04 \u2013 00:25",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 21 minutes. Dominant symptom: No weaver (absenteeism).",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "51 weft / 13 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "96.4%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-040 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-54-23579",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-054",
        "affected_loom_id": 54,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:04 \u2013 00:25",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 21 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "53 weft / 14 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "91.5%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-054 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-60-23585",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-060",
        "affected_loom_id": 60,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:04 \u2013 00:25",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 21 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 22.5,
          "revenue_exposure": 900.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "64 weft / 18 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.2%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-060 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-72-23355",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-072",
        "affected_loom_id": 72,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:04 \u2013 00:26",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 22 minutes. Dominant symptom: Mechanical breakdown.",
        "impact": {
          "lost_meters": 22.5,
          "revenue_exposure": 900.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "73 weft / 39 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "84.7%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-072 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-86-23126",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-086",
        "affected_loom_id": 86,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:04 \u2013 00:22",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 18 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "41 weft / 12 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.3%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-086 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-109-23398",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-109",
        "affected_loom_id": 109,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:04 \u2013 00:27",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 23 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "49 weft / 17 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "92.2%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-109 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-125-23679",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-125",
        "affected_loom_id": 125,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:04 \u2013 00:26",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 22 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "46 weft / 13 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "95.8%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-125 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-130-23424",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-130",
        "affected_loom_id": 130,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:04 \u2013 00:27",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 23 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "44 weft / 14 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "90.7%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-130 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-149-23716",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-149",
        "affected_loom_id": 149,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:04 \u2013 00:27",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 23 minutes. Dominant symptom: Weft feeder fault.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "61 weft / 10 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "93.5%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-149 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-163-23733",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-163",
        "affected_loom_id": 163,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:04 \u2013 00:26",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 22 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 22.5,
          "revenue_exposure": 900.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "51 weft / 10 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "96.4%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-163 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-164-23462",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-164",
        "affected_loom_id": 164,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:04 \u2013 00:15",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 11 minutes. Dominant symptom: Sort/beam change.",
        "impact": {
          "lost_meters": 22.5,
          "revenue_exposure": 900.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "34 weft / 18 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "95.1%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-164 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-170-23235",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "SZ-002",
        "affected_loom_id": 170,
        "loom_type": "TS",
        "shed_code": "SULZER",
        "time_window": "00:04 \u2013 00:29",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 25 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 5.9,
          "revenue_exposure": 236.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "47 weft / 12 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "88.0%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF Slub X 30s VSF Slub /90X68-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom SZ-002 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-171-23469",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "SZ-003",
        "affected_loom_id": 171,
        "loom_type": "SZ",
        "shed_code": "SULZER",
        "time_window": "00:04 \u2013 00:19",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 15 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 3.5,
          "revenue_exposure": 140.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "54 weft / 10 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "93.8%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF Slub X 30s VSF Slub /90X68-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom SZ-003 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-12-23026",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-012",
        "affected_loom_id": 12,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:05 \u2013 00:29",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 24 minutes. Dominant symptom: Air pressure low.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "45 weft / 7 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.1%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-012 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-14-23521",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-014",
        "affected_loom_id": 14,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:05 \u2013 00:26",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 21 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 22.5,
          "revenue_exposure": 900.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "45 weft / 18 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "93.4%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-014 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-21-23294",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-021",
        "affected_loom_id": 21,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:05 \u2013 00:22",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 17 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "43 weft / 17 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "91.7%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-021 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-39-23316",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-039",
        "affected_loom_id": 39,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:05 \u2013 00:26",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 21 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "46 weft / 22 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.2%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-039 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-53-23334",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-053",
        "affected_loom_id": 53,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:05 \u2013 00:23",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 18 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "42 weft / 16 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "96.8%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-053 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-94-23137",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-094",
        "affected_loom_id": 94,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:05 \u2013 00:25",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 20 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "53 weft / 20 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.5%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-094 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-114-23404",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-114",
        "affected_loom_id": 114,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:05 \u2013 00:23",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 18 minutes. Dominant symptom: Air pressure low.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "63 weft / 12 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.4%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-114 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-116-23163",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-116",
        "affected_loom_id": 116,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:05 \u2013 00:22",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 17 minutes. Dominant symptom: Mechanical breakdown.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "37 weft / 14 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.9%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-116 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-120-23171",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-120",
        "affected_loom_id": 120,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:05 \u2013 00:07",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 2 minutes. Dominant symptom: Weft break.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "47 weft / 12 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "97.2%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-120 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-122-23174",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-122",
        "affected_loom_id": 122,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:05 \u2013 00:29",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 24 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "53 weft / 16 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.6%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-122 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-133-23427",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-133",
        "affected_loom_id": 133,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:05 \u2013 00:12",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 7 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "48 weft / 13 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "93.9%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-133 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-143-23201",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-143",
        "affected_loom_id": 143,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:05 \u2013 00:20",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 15 minutes. Dominant symptom: Weft feeder fault.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "36 weft / 10 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "92.1%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-143 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-148-23445",
        "title": "Rapid Stoppage Cluster (6 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-148",
        "affected_loom_id": 148,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:05 \u2013 00:29",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "6 stops / shift",
        "current_value_val": 6.0,
        "deviation_pct": 500,
        "deviation_label": "+500% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 6 consecutive ticketed stops within 24 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 27.0,
          "revenue_exposure": 1080.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "74 weft / 41 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "81.2%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-148 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-181-23482",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "SZ-013",
        "affected_loom_id": 181,
        "loom_type": "280",
        "shed_code": "SULZER",
        "time_window": "00:05 \u2013 00:28",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 23 minutes. Dominant symptom: Air pressure low.",
        "impact": {
          "lost_meters": 6.9,
          "revenue_exposure": 276.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "50 weft / 12 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "88.9%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "12s VSF Slub X 12s VSF Slub /56X44-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom SZ-013 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-182-23762",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "SZ-014",
        "affected_loom_id": 182,
        "loom_type": "TS",
        "shed_code": "SULZER",
        "time_window": "00:05 \u2013 00:26",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 21 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 4.7,
          "revenue_exposure": 188.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "51 weft / 15 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "90.0%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF Slub X 30s VSF Slub /90X68-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom SZ-014 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-6-23509",
        "title": "Rapid Stoppage Cluster (6 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-006",
        "affected_loom_id": 6,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:06 \u2013 00:21",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "6 stops / shift",
        "current_value_val": 6.0,
        "deviation_pct": 500,
        "deviation_label": "+500% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 6 consecutive ticketed stops within 15 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 27.0,
          "revenue_exposure": 1080.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "63 weft / 40 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "84.9%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-006 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-18-23033",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-018",
        "affected_loom_id": 18,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:06 \u2013 00:24",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 18 minutes. Dominant symptom: Mechanical breakdown.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "48 weft / 13 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "92.6%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-018 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-26-23542",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-026",
        "affected_loom_id": 26,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:06 \u2013 00:27",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 21 minutes. Dominant symptom: Air pressure low.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "50 weft / 15 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "92.2%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-026 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-34-23552",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-034",
        "affected_loom_id": 34,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:06 \u2013 00:18",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 12 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "61 weft / 15 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "95.2%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-034 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-36-23313",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-036",
        "affected_loom_id": 36,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:06 \u2013 00:25",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 19 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "56 weft / 14 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "92.3%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-036 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-52-23577",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-052",
        "affected_loom_id": 52,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:06 \u2013 00:24",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 18 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "62 weft / 20 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "96.0%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-052 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-73-23107",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-073",
        "affected_loom_id": 73,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:06 \u2013 00:29",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 23 minutes. Dominant symptom: Air pressure low.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "49 weft / 12 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "95.8%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-073 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-76-23611",
        "title": "Rapid Stoppage Cluster (7 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-076",
        "affected_loom_id": 76,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:06 \u2013 00:20",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "7 stops / shift",
        "current_value_val": 7.0,
        "deviation_pct": 600,
        "deviation_label": "+600% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 7 consecutive ticketed stops within 14 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 31.5,
          "revenue_exposure": 1260.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "53 weft / 43 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "82.1%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-076 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-118-23670",
        "title": "Rapid Stoppage Cluster (10 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-118",
        "affected_loom_id": 118,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:06 \u2013 00:13",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "10 stops / shift",
        "current_value_val": 10.0,
        "deviation_pct": 900,
        "deviation_label": "+900% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 10 consecutive ticketed stops within 7 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 45.0,
          "revenue_exposure": 1800.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "92 weft / 54 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "78.3%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-118 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-124-23176",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-124",
        "affected_loom_id": 124,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:06 \u2013 00:28",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 22 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "42 weft / 13 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "92.5%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-124 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-147-23443",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-147",
        "affected_loom_id": 147,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:06 \u2013 00:21",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 15 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "71 weft / 19 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "90.6%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-147 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-159-23458",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-159",
        "affected_loom_id": 159,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:06 \u2013 00:28",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 22 minutes. Dominant symptom: Weft break.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "52 weft / 11 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.4%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-159 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-176-23474",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "SZ-008",
        "affected_loom_id": 176,
        "loom_type": "340",
        "shed_code": "SULZER",
        "time_window": "00:06 \u2013 00:25",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 19 minutes. Dominant symptom: Mechanical breakdown.",
        "impact": {
          "lost_meters": 5.9,
          "revenue_exposure": 236.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "55 weft / 18 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "89.4%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VOT /68X57-48\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom SZ-008 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-16-23286",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-016",
        "affected_loom_id": 16,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:07 \u2013 00:13",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 6 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "48 weft / 10 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.6%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-016 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-32-23050",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-032",
        "affected_loom_id": 32,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:07 \u2013 00:24",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 17 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "36 weft / 13 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "91.5%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-032 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-46-23070",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-046",
        "affected_loom_id": 46,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:07 \u2013 00:27",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 20 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "53 weft / 18 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "92.1%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-046 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-67-23350",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-067",
        "affected_loom_id": 67,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:07 \u2013 00:15",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 8 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "55 weft / 11 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "91.9%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-067 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-69-23596",
        "title": "Rapid Stoppage Cluster (6 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-069",
        "affected_loom_id": 69,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:07 \u2013 00:15",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "6 stops / shift",
        "current_value_val": 6.0,
        "deviation_pct": 500,
        "deviation_label": "+500% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 6 consecutive ticketed stops within 8 minutes. Dominant symptom: Mechanical breakdown.",
        "impact": {
          "lost_meters": 27.0,
          "revenue_exposure": 1080.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "60 weft / 20 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "82.5%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-069 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-97-23385",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-097",
        "affected_loom_id": 97,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:07 \u2013 00:25",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 18 minutes. Dominant symptom: Warp break.",
        "impact": {
          "lost_meters": 22.5,
          "revenue_exposure": 900.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "41 weft / 11 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.1%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-097 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-119-23673",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-119",
        "affected_loom_id": 119,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:07 \u2013 00:22",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 15 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "57 weft / 20 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "96.0%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-119 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-123-23175",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-123",
        "affected_loom_id": 123,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:07 \u2013 00:20",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 13 minutes. Dominant symptom: Mechanical breakdown.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "53 weft / 13 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "93.3%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-123 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-190-23493",
        "title": "Rapid Stoppage Cluster (6 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "SZ-022",
        "affected_loom_id": 190,
        "loom_type": "TS",
        "shed_code": "SULZER",
        "time_window": "00:07 \u2013 00:23",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "6 stops / shift",
        "current_value_val": 6.0,
        "deviation_pct": 500,
        "deviation_label": "+500% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 6 consecutive ticketed stops within 16 minutes. Dominant symptom: Warp break.",
        "impact": {
          "lost_meters": 7.1,
          "revenue_exposure": 284.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "48 weft / 8 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "89.2%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF Slub X 30s VSF Slub /90X68-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom SZ-022 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-29-23304",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-029",
        "affected_loom_id": 29,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:08 \u2013 00:13",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 5 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "53 weft / 9 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "93.3%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-029 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-48-23072",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-048",
        "affected_loom_id": 48,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:08 \u2013 00:26",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 18 minutes. Dominant symptom: Weft feeder fault.",
        "impact": {
          "lost_meters": 22.5,
          "revenue_exposure": 900.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "53 weft / 22 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "89.6%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-048 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-56-23581",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-056",
        "affected_loom_id": 56,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:08 \u2013 00:28",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 20 minutes. Dominant symptom: Preventive maintenance.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "46 weft / 16 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.2%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-056 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-103-23392",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-103",
        "affected_loom_id": 103,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:08 \u2013 00:14",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 6 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "48 weft / 15 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "93.3%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-103 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-112-23402",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-112",
        "affected_loom_id": 112,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:08 \u2013 00:14",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 6 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "40 weft / 13 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "96.4%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-112 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-141-23198",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-141",
        "affected_loom_id": 141,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:08 \u2013 00:26",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 18 minutes. Dominant symptom: Fabric roll doffing.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "53 weft / 12 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "95.1%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-141 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-24-23297",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-024",
        "affected_loom_id": 24,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:09 \u2013 00:20",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 11 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "50 weft / 14 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "93.0%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-024 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-55-23081",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-055",
        "affected_loom_id": 55,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:09 \u2013 00:23",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 14 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "61 weft / 20 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "93.0%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-055 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-71-23104",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-071",
        "affected_loom_id": 71,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:09 \u2013 00:21",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 12 minutes. Dominant symptom: Warp break.",
        "impact": {
          "lost_meters": 22.5,
          "revenue_exposure": 900.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "48 weft / 15 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "91.0%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-071 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-102-23147",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-102",
        "affected_loom_id": 102,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:09 \u2013 00:22",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 13 minutes. Dominant symptom: Weft feeder fault.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "62 weft / 14 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "97.7%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-102 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-127-23420",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-127",
        "affected_loom_id": 127,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:09 \u2013 00:29",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 20 minutes. Dominant symptom: Sort/beam change.",
        "impact": {
          "lost_meters": 22.5,
          "revenue_exposure": 900.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "58 weft / 18 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "89.1%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-127 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-139-23702",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-139",
        "affected_loom_id": 139,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:09 \u2013 00:25",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 16 minutes. Dominant symptom: Weft break.",
        "impact": {
          "lost_meters": 22.5,
          "revenue_exposure": 900.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "49 weft / 16 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "92.9%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-139 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-156-23724",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-156",
        "affected_loom_id": 156,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:09 \u2013 00:27",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 18 minutes. Dominant symptom: Weft break.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "49 weft / 18 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "92.9%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-156 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-172-23238",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "SZ-004",
        "affected_loom_id": 172,
        "loom_type": "340",
        "shed_code": "SULZER",
        "time_window": "00:09 \u2013 00:25",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 16 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 5.2,
          "revenue_exposure": 208.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "44 weft / 16 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "88.9%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "12s VSF Slub X 12s VSF Slub /56X44-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom SZ-004 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-27-23302",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-027",
        "affected_loom_id": 27,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:10 \u2013 00:24",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 14 minutes. Dominant symptom: No weaver (absenteeism).",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "57 weft / 21 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "92.1%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-027 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-30-23546",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-030",
        "affected_loom_id": 30,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:10 \u2013 00:26",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 16 minutes. Dominant symptom: Fabric roll doffing.",
        "impact": {
          "lost_meters": 22.5,
          "revenue_exposure": 900.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "59 weft / 11 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.2%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-030 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-44-23068",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-044",
        "affected_loom_id": 44,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:10 \u2013 00:25",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 15 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "62 weft / 14 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "96.0%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-044 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-107-23396",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-107",
        "affected_loom_id": 107,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:10 \u2013 00:27",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 17 minutes. Dominant symptom: Knotting.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "50 weft / 14 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.2%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-107 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-167-23465",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-167",
        "affected_loom_id": 167,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:10 \u2013 00:21",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 11 minutes. Dominant symptom: Mechanical breakdown.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "65 weft / 15 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "93.7%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-167 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-4-23506",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-004",
        "affected_loom_id": 4,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:11 \u2013 00:21",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 10 minutes. Dominant symptom: Weft break.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "50 weft / 16 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.1%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-004 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-35-23054",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-035",
        "affected_loom_id": 35,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:11 \u2013 00:29",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 18 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "60 weft / 11 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "96.7%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-035 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-38-23059",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-038",
        "affected_loom_id": 38,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:11 \u2013 00:29",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 18 minutes. Dominant symptom: No weaver (absenteeism).",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "49 weft / 18 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.8%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-038 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-89-23630",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-089",
        "affected_loom_id": 89,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:11 \u2013 00:29",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 18 minutes. Dominant symptom: Weft feeder fault.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "56 weft / 22 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "92.4%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-089 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-93-23379",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-093",
        "affected_loom_id": 93,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:11 \u2013 00:14",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 3 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "71 weft / 12 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "95.1%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-093 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-134-23428",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-134",
        "affected_loom_id": 134,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:11 \u2013 00:19",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 8 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "52 weft / 13 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "93.0%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-134 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-184-23485",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "SZ-016",
        "affected_loom_id": 184,
        "loom_type": "340",
        "shed_code": "SULZER",
        "time_window": "00:11 \u2013 00:22",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 11 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 6.9,
          "revenue_exposure": 276.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "45 weft / 18 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "89.4%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "12s VSF Slub X 12s VSF Slub /56X44-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom SZ-016 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-189-23492",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "SZ-021",
        "affected_loom_id": 189,
        "loom_type": "280",
        "shed_code": "SULZER",
        "time_window": "00:11 \u2013 00:28",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 17 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 6.9,
          "revenue_exposure": 276.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "50 weft / 9 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "88.3%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "12s VSF Slub X 12s VSF Slub /56X44-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom SZ-021 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-68-23595",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-068",
        "affected_loom_id": 68,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:12 \u2013 00:25",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 13 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "63 weft / 12 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.7%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-068 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-98-23646",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-098",
        "affected_loom_id": 98,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:12 \u2013 00:26",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 14 minutes. Dominant symptom: Gaiting.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "45 weft / 15 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "92.3%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-098 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-115-23666",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-115",
        "affected_loom_id": 115,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:12 \u2013 00:27",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 15 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 22.5,
          "revenue_exposure": 900.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "47 weft / 13 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.7%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-115 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-175-23750",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "SZ-007",
        "affected_loom_id": 175,
        "loom_type": "SZ",
        "shed_code": "SULZER",
        "time_window": "00:12 \u2013 00:18",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 6 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 5.9,
          "revenue_exposure": 236.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "66 weft / 22 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "92.5%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VOT /68X57-48\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom SZ-007 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-80-23619",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-080",
        "affected_loom_id": 80,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:13 \u2013 00:29",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 16 minutes. Dominant symptom: Air pressure low.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "54 weft / 18 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "91.0%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-080 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-85-23625",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-085",
        "affected_loom_id": 85,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:13 \u2013 00:27",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 14 minutes. Dominant symptom: Sort/beam change.",
        "impact": {
          "lost_meters": 22.5,
          "revenue_exposure": 900.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "57 weft / 18 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "95.2%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-085 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-129-23422",
        "title": "Rapid Stoppage Cluster (6 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-129",
        "affected_loom_id": 129,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:13 \u2013 00:23",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "6 stops / shift",
        "current_value_val": 6.0,
        "deviation_pct": 500,
        "deviation_label": "+500% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 6 consecutive ticketed stops within 10 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 27.0,
          "revenue_exposure": 1080.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "48 weft / 9 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "86.5%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-129 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-160-23460",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-160",
        "affected_loom_id": 160,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:13 \u2013 00:23",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 10 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "46 weft / 16 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "93.5%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-160 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-49-23073",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-049",
        "affected_loom_id": 49,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:14 \u2013 00:18",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 4 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "48 weft / 11 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "93.8%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-049 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-64-23591",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-064",
        "affected_loom_id": 64,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:14 \u2013 00:18",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 4 minutes. Dominant symptom: Knotting.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "56 weft / 11 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "88.5%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-064 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-75-23109",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-075",
        "affected_loom_id": 75,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:14 \u2013 00:24",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 10 minutes. Dominant symptom: No weaver (absenteeism).",
        "impact": {
          "lost_meters": 22.5,
          "revenue_exposure": 900.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "79 weft / 45 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "83.5%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-075 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-88-23129",
        "title": "Rapid Stoppage Cluster (6 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-088",
        "affected_loom_id": 88,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:14 \u2013 00:26",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "6 stops / shift",
        "current_value_val": 6.0,
        "deviation_pct": 500,
        "deviation_label": "+500% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 6 consecutive ticketed stops within 12 minutes. Dominant symptom: Preventive maintenance.",
        "impact": {
          "lost_meters": 27.0,
          "revenue_exposure": 1080.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "72 weft / 42 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "83.2%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-088 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-91-23633",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-091",
        "affected_loom_id": 91,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:14 \u2013 00:26",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 12 minutes. Dominant symptom: No weaver (absenteeism).",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "54 weft / 16 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.0%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-091 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-135-23429",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-135",
        "affected_loom_id": 135,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:14 \u2013 00:25",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 11 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 22.5,
          "revenue_exposure": 900.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "78 weft / 53 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "84.0%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-135 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-179-23758",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "SZ-011",
        "affected_loom_id": 179,
        "loom_type": "SZ",
        "shed_code": "SULZER",
        "time_window": "00:14 \u2013 00:25",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 11 minutes. Dominant symptom: Warp break.",
        "impact": {
          "lost_meters": 8.7,
          "revenue_exposure": 348.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "52 weft / 13 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "89.4%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "12s VSF Slub X 12s VSF Slub /56X44-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom SZ-011 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-185-23487",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "SZ-017",
        "affected_loom_id": 185,
        "loom_type": "280",
        "shed_code": "SULZER",
        "time_window": "00:14 \u2013 00:23",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 9 minutes. Dominant symptom: Mechanical breakdown.",
        "impact": {
          "lost_meters": 5.2,
          "revenue_exposure": 208.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "49 weft / 14 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "90.6%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "12s VSF Slub X 12s VSF Slub /56X44-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom SZ-017 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-33-23551",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-033",
        "affected_loom_id": 33,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:15 \u2013 00:21",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 6 minutes. Dominant symptom: Weft break.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "83 weft / 56 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "79.9%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-033 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-78-23616",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-078",
        "affected_loom_id": 78,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:15 \u2013 00:26",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 11 minutes. Dominant symptom: Mechanical breakdown.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "50 weft / 17 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "92.7%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-078 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-82-23365",
        "title": "Rapid Stoppage Cluster (6 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-082",
        "affected_loom_id": 82,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:15 \u2013 00:27",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "6 stops / shift",
        "current_value_val": 6.0,
        "deviation_pct": 500,
        "deviation_label": "+500% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 6 consecutive ticketed stops within 12 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 27.0,
          "revenue_exposure": 1080.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "39 weft / 8 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "91.1%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-082 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-92-23135",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-092",
        "affected_loom_id": 92,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:15 \u2013 00:26",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 11 minutes. Dominant symptom: Air pressure low.",
        "impact": {
          "lost_meters": 22.5,
          "revenue_exposure": 900.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "80 weft / 61 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "82.7%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-092 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-183-23763",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "SZ-015",
        "affected_loom_id": 183,
        "loom_type": "SZ",
        "shed_code": "SULZER",
        "time_window": "00:15 \u2013 00:24",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 9 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 7.4,
          "revenue_exposure": 296.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "44 weft / 10 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "91.6%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VOT /68X57-48\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom SZ-015 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-42-23066",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-042",
        "affected_loom_id": 42,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:17 \u2013 00:26",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 9 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "50 weft / 11 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "96.0%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-042 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-15-23524",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-015",
        "affected_loom_id": 15,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:18 \u2013 00:25",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 7 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "60 weft / 17 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "95.4%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-015 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-79-23362",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-079",
        "affected_loom_id": 79,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:18 \u2013 00:29",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 11 minutes. Dominant symptom: No weaver (absenteeism).",
        "impact": {
          "lost_meters": 22.5,
          "revenue_exposure": 900.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "59 weft / 22 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "87.3%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-079 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-145-23710",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-145",
        "affected_loom_id": 145,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:18 \u2013 00:25",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 7 minutes. Dominant symptom: Sort/beam change.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "67 weft / 20 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "97.5%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-145 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-9-23023",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-009",
        "affected_loom_id": 9,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:19 \u2013 00:20",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 1 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "57 weft / 15 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.2%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-009 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-83-23366",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-083",
        "affected_loom_id": 83,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:19 \u2013 00:26",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 7 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "47 weft / 16 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "92.6%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-083 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-165-23736",
        "title": "Rapid Stoppage Cluster (5 stops in short window)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-165",
        "affected_loom_id": 165,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:19 \u2013 00:26",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "5 stops / shift",
        "current_value_val": 5.0,
        "deviation_pct": 400,
        "deviation_label": "+400% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 5 consecutive ticketed stops within 7 minutes. Dominant symptom: Sort/beam change.",
        "impact": {
          "lost_meters": 22.5,
          "revenue_exposure": 900.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "46 weft / 12 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "93.1%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-165 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-61-23089",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-061",
        "affected_loom_id": 61,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:20 \u2013 00:29",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 9 minutes. Dominant symptom: Mechanical breakdown.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "34 weft / 11 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.3%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-061 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-62-23588",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-062",
        "affected_loom_id": 62,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:20 \u2013 00:26",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 6 minutes. Dominant symptom: Mechanical breakdown.",
        "impact": {
          "lost_meters": 18.0,
          "revenue_exposure": 720.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "49 weft / 13 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.9%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-062 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-8-23022",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-008",
        "affected_loom_id": 8,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:21 \u2013 00:26",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 5 minutes. Dominant symptom: Electrical breakdown.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "54 weft / 18 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "91.7%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-008 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-17-23527",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-017",
        "affected_loom_id": 17,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:21 \u2013 00:29",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 8 minutes. Dominant symptom: No weaver (absenteeism).",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "46 weft / 13 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "94.9%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-017 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-188-23491",
        "title": "Rapid Stoppage Cluster (4 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "SZ-020",
        "affected_loom_id": 188,
        "loom_type": "340",
        "shed_code": "SULZER",
        "time_window": "00:22 \u2013 00:28",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "4 stops / shift",
        "current_value_val": 4.0,
        "deviation_pct": 300,
        "deviation_label": "+300% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 4 consecutive ticketed stops within 6 minutes. Dominant symptom: Power failure.",
        "impact": {
          "lost_meters": 6.9,
          "revenue_exposure": 276.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "35 weft / 16 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "86.0%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "12s VSF Slub X 12s VSF Slub /56X44-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom SZ-020 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-CLUSTER-155-23218",
        "title": "Rapid Stoppage Cluster (3 stops in short window)",
        "severity": "WARNING",
        "affected_loom_no": "AJ-155",
        "affected_loom_id": 155,
        "loom_type": "910",
        "shed_code": "AIRJET",
        "time_window": "00:23 \u2013 00:25",
        "normal_baseline": "\u2264 1 stop / 2 hrs",
        "normal_baseline_val": 1.0,
        "current_value": "3 stops / shift",
        "current_value_val": 3.0,
        "deviation_pct": 200,
        "deviation_label": "+200% above normal baseline",
        "pattern_type": "TIME_WINDOW_CLUSTERING",
        "evidence": "Logged 3 consecutive ticketed stops within 2 minutes. Dominant symptom: Voltage fluctuation.",
        "impact": {
          "lost_meters": 13.5,
          "revenue_exposure": 540.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Break Frequency",
            "value": "48 weft / 10 warp breaks",
            "category": "COUNTER"
          },
          {
            "name": "Loom Efficiency",
            "value": "95.2%",
            "category": "METRIC"
          },
          {
            "name": "Running Style",
            "value": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
            "category": "PROCESS"
          }
        ],
        "recommendation": "Inspect yarn path and relay feed on Loom AJ-155 to break repeat stoppage cycle."
      },
      {
        "anomaly_id": "ANOM-OUTLIER-23530",
        "title": "Prolonged Reasoncategory.Mechanical Outlier (133 min)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-020",
        "affected_loom_id": 20,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:05 \u2013 02:18",
        "normal_baseline": "64.4 min avg duration",
        "normal_baseline_val": 64.4,
        "current_value": "133 min single stop",
        "current_value_val": 133.0,
        "deviation_pct": 107,
        "deviation_label": "2.1x baseline duration",
        "pattern_type": "CHRONIC_DOWNTIME_OUTLIER",
        "evidence": "Single Weft feeder fault lasted 133.0 min. Reason Category: ReasonCategory.MECHANICAL.",
        "impact": {
          "lost_meters": 17.2,
          "revenue_exposure": 688.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Duration vs Expected",
            "value": "133.0m vs 64.4m",
            "category": "ANALYTICS"
          },
          {
            "name": "Reason Code",
            "value": "WEFT_FEEDER_FAULT",
            "category": "CODE"
          },
          {
            "name": "Remark",
            "value": "Drive trip",
            "category": "LOG"
          }
        ],
        "recommendation": "Prioritize root cause inspection on Loom AJ-020 to prevent secondary electrical drive trip."
      },
      {
        "anomaly_id": "ANOM-OUTLIER-23629",
        "title": "Prolonged Reasoncategory.Manpower Outlier (123 min)",
        "severity": "CRITICAL",
        "affected_loom_no": "AJ-088",
        "affected_loom_id": 88,
        "loom_type": "810",
        "shed_code": "AIRJET",
        "time_window": "00:25 \u2013 02:28",
        "normal_baseline": "60.6 min avg duration",
        "normal_baseline_val": 60.6,
        "current_value": "123 min single stop",
        "current_value_val": 123.0,
        "deviation_pct": 103,
        "deviation_label": "2.0x baseline duration",
        "pattern_type": "CHRONIC_DOWNTIME_OUTLIER",
        "evidence": "Single No weaver (absenteeism) lasted 123.0 min. Reason Category: ReasonCategory.MANPOWER.",
        "impact": {
          "lost_meters": 36.9,
          "revenue_exposure": 1476.0,
          "rate_source": "CONFIRMED"
        },
        "correlated_signals": [
          {
            "name": "Duration vs Expected",
            "value": "123.0m vs 60.6m",
            "category": "ANALYTICS"
          },
          {
            "name": "Reason Code",
            "value": "NO_WEAVER",
            "category": "CODE"
          },
          {
            "name": "Remark",
            "value": "Drive trip",
            "category": "LOG"
          }
        ],
        "recommendation": "Prioritize root cause inspection on Loom AJ-088 to prevent secondary electrical drive trip."
      }
    ],
    "evaluated_patterns_count": 3
  },
  "lossImpact": {
    "summary": {
      "date": "2026-07-31",
      "unit_code": "ATM",
      "total_lost_meters": 7336.8,
      "total_rupee_exposure": 293470.6,
      "rate_provenance": "CONFIRMED",
      "affected_looms_count": 192,
      "total_stopped_minutes": 37234.0,
      "worst_shift": "Shift 3",
      "worst_shift_exposure": 109461.25
    },
    "waterfall": [
      {
        "step": "Scheduled Theoretical Output",
        "metres": 55710.5,
        "type": "TOTAL_AVAILABLE",
        "delta": 55710.5
      },
      {
        "step": "Electrical Stoppage Loss",
        "metres": 3893.3,
        "rupees": 155733.41,
        "type": "SUBTRACTION",
        "delta": -3893.3
      },
      {
        "step": "Mechanical Stoppage Loss",
        "metres": 970.9,
        "rupees": 38837.64,
        "type": "SUBTRACTION",
        "delta": -970.9
      },
      {
        "step": "Weft & Warp Stoppage Loss",
        "metres": 354.9,
        "rupees": 14194.86,
        "type": "SUBTRACTION",
        "delta": -354.9
      },
      {
        "step": "Utility & Process Loss",
        "metres": 2117.6,
        "rupees": 84704.69,
        "type": "SUBTRACTION",
        "delta": -2117.6
      },
      {
        "step": "Actual Delivered Output",
        "metres": 49748.8,
        "type": "FINAL_REMAINING",
        "delta": 49748.8
      }
    ],
    "category_breakdown": [
      {
        "category": "ELECTRICAL",
        "label": "Electrical",
        "downtime_min": 19845.0,
        "lost_meters": 3893.3,
        "rupee_exposure": 155733.41,
        "percentage_share": 53.3
      },
      {
        "category": "OTHER",
        "label": "Other",
        "downtime_min": 7874.0,
        "lost_meters": 1588.9,
        "rupee_exposure": 63557.37,
        "percentage_share": 21.1
      },
      {
        "category": "MECHANICAL",
        "label": "Mechanical",
        "downtime_min": 4875.0,
        "lost_meters": 970.9,
        "rupee_exposure": 38837.64,
        "percentage_share": 13.1
      },
      {
        "category": "UTILITY",
        "label": "Utility",
        "downtime_min": 2860.0,
        "lost_meters": 528.7,
        "rupee_exposure": 21147.32,
        "percentage_share": 7.7
      },
      {
        "category": "WARP_RELATED",
        "label": "Warp Related",
        "downtime_min": 952.0,
        "lost_meters": 191.0,
        "rupee_exposure": 7638.08,
        "percentage_share": 2.6
      },
      {
        "category": "WEFT_RELATED",
        "label": "Weft Related",
        "downtime_min": 828.0,
        "lost_meters": 163.9,
        "rupee_exposure": 6556.77,
        "percentage_share": 2.2
      }
    ],
    "top_loss_machines": [
      {
        "loom_id": 118,
        "loom_no": "AJ-118",
        "loom_type": "810",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "lost_meters": 112.0,
        "rupee_exposure": 4481.94,
        "downtime_min": 509.0,
        "stop_count": 10,
        "dominant_category": "ELECTRICAL",
        "share_of_total_loss_pct": 1.5
      },
      {
        "loom_id": 3,
        "loom_no": "AJ-003",
        "loom_type": "910",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "lost_meters": 103.7,
        "rupee_exposure": 4147.34,
        "downtime_min": 471.0,
        "stop_count": 7,
        "dominant_category": "MECHANICAL",
        "share_of_total_loss_pct": 1.4
      },
      {
        "loom_id": 132,
        "loom_no": "AJ-132",
        "loom_type": "810",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "lost_meters": 98.6,
        "rupee_exposure": 3944.81,
        "downtime_min": 448.0,
        "stop_count": 7,
        "dominant_category": "ELECTRICAL",
        "share_of_total_loss_pct": 1.3
      },
      {
        "loom_id": 76,
        "loom_no": "AJ-076",
        "loom_type": "810",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "lost_meters": 92.9,
        "rupee_exposure": 3715.87,
        "downtime_min": 422.0,
        "stop_count": 7,
        "dominant_category": "ELECTRICAL",
        "share_of_total_loss_pct": 1.3
      },
      {
        "loom_id": 146,
        "loom_no": "AJ-146",
        "loom_type": "810",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "lost_meters": 88.5,
        "rupee_exposure": 3539.77,
        "downtime_min": 402.0,
        "stop_count": 7,
        "dominant_category": "MECHANICAL",
        "share_of_total_loss_pct": 1.2
      },
      {
        "loom_id": 23,
        "loom_no": "AJ-023",
        "loom_type": "910",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "lost_meters": 83.9,
        "rupee_exposure": 3354.85,
        "downtime_min": 381.0,
        "stop_count": 5,
        "dominant_category": "MECHANICAL",
        "share_of_total_loss_pct": 1.1
      },
      {
        "loom_id": 51,
        "loom_no": "AJ-051",
        "loom_type": "910",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "lost_meters": 83.2,
        "rupee_exposure": 3328.44,
        "downtime_min": 378.0,
        "stop_count": 6,
        "dominant_category": "ELECTRICAL",
        "share_of_total_loss_pct": 1.1
      },
      {
        "loom_id": 88,
        "loom_no": "AJ-088",
        "loom_type": "810",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "lost_meters": 82.8,
        "rupee_exposure": 3310.83,
        "downtime_min": 376.0,
        "stop_count": 6,
        "dominant_category": "OTHER",
        "share_of_total_loss_pct": 1.1
      },
      {
        "loom_id": 69,
        "loom_no": "AJ-069",
        "loom_type": "910",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "lost_meters": 78.1,
        "rupee_exposure": 3125.91,
        "downtime_min": 355.0,
        "stop_count": 6,
        "dominant_category": "ELECTRICAL",
        "share_of_total_loss_pct": 1.1
      },
      {
        "loom_id": 41,
        "loom_no": "AJ-041",
        "loom_type": "910",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "lost_meters": 74.2,
        "rupee_exposure": 2967.42,
        "downtime_min": 337.0,
        "stop_count": 5,
        "dominant_category": "OTHER",
        "share_of_total_loss_pct": 1.0
      }
    ],
    "shift_breakdown": [
      {
        "shift_code": "1",
        "shift_name": "Shift 1 (Day)",
        "downtime_min": 12674.0,
        "lost_meters": 2502.7,
        "rupee_exposure": 100108.66,
        "stop_count": 258,
        "is_worst_shift": false
      },
      {
        "shift_code": "2",
        "shift_name": "Shift 2 (Evening)",
        "downtime_min": 10755.0,
        "lost_meters": 2097.5,
        "rupee_exposure": 83900.69,
        "stop_count": 231,
        "is_worst_shift": false
      },
      {
        "shift_code": "3",
        "shift_name": "Shift 3 (Night)",
        "downtime_min": 13805.0,
        "lost_meters": 2736.5,
        "rupee_exposure": 109461.25,
        "stop_count": 277,
        "is_worst_shift": true
      }
    ],
    "recovery_opportunity": {
      "confirmed_loss_rupees": 293470.6,
      "potential_recovery_rupees": 8173.16,
      "potential_recovery_meters": 204.3,
      "target_focus": "Top 3 Outlier Looms (AJ-118, AJ-003, AJ-132)",
      "recovery_confidence": "HIGH"
    },
    "trend": {
      "TODAY": 293470.6,
      "7D_DAILY_AVG": 278797.07,
      "30D_DAILY_AVG": 308144.13,
      "90D_DAILY_AVG": 328687.07,
      "direction": "IMPROVING",
      "weekly_change_pct": -5.2
    },
    "management_priorities": [
      {
        "rank": 1,
        "category": "Electrical",
        "share_pct": 53.3,
        "rupee_exposure": 155733.41,
        "lost_meters": 3893.3,
        "priority_rationale": "Electrical represents 53.3% of daily financial loss (\u20b9155,733 exposure)."
      },
      {
        "rank": 2,
        "category": "Other",
        "share_pct": 21.1,
        "rupee_exposure": 63557.37,
        "lost_meters": 1588.9,
        "priority_rationale": "Other represents 21.1% of daily financial loss (\u20b963,557 exposure)."
      },
      {
        "rank": 3,
        "category": "Mechanical",
        "share_pct": 13.1,
        "rupee_exposure": 38837.64,
        "lost_meters": 970.9,
        "priority_rationale": "Mechanical represents 13.1% of daily financial loss (\u20b938,838 exposure)."
      }
    ],
    "executive_verdict": "Breakdown loss is concentrated in Electrical (53.3% of loss), predominantly impacting Shift 3. Addressing drive cooling on top 3 outlier looms offers an immediate potential recovery of \u20b98,173."
  },
  "revenueAnalyticsToday": {
    "work_date": "2026-07-31",
    "unit_code": "ATM",
    "selected_period": "TODAY",
    "today_total_revenue_inr": 1989950.88,
    "month_to_date_revenue_inr": 59620190.88,
    "period_total_revenue_inr": 1989950.88,
    "potential_max_revenue_inr": 2312832.88,
    "total_revenue_loss_inr": 322882.0,
    "recoverable_revenue_inr": 201064.4,
    "style_revenues": [
      {
        "style_id": 1,
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "metres_produced": 47093.028,
        "rate_per_metre": 40.0,
        "revenue_inr": 1883721.12,
        "active_looms": 166
      },
      {
        "style_id": 5,
        "style_code": "12s VSF Slub X 12s VSF Slub /56X44-63\" Plain",
        "metres_produced": 1160.733,
        "rate_per_metre": 40.0,
        "revenue_inr": 46429.32,
        "active_looms": 11
      },
      {
        "style_id": 2,
        "style_code": "30s VSF X 30s VOT /68X57-48\" Plain",
        "metres_produced": 615.935,
        "rate_per_metre": 40.0,
        "revenue_inr": 24637.4,
        "active_looms": 7
      },
      {
        "style_id": 3,
        "style_code": "30s VSF Slub X 30s VSF Slub /90X68-63\" Plain",
        "metres_produced": 427.929,
        "rate_per_metre": 40.0,
        "revenue_inr": 17117.16,
        "active_looms": 6
      },
      {
        "style_id": 10,
        "style_code": "20s OE X 21s Cotton Flax /56X44-63\" Plain",
        "metres_produced": 353.271,
        "rate_per_metre": 40.0,
        "revenue_inr": 14130.84,
        "active_looms": 1
      },
      {
        "style_id": 8,
        "style_code": "60s Excel X 40s Vortex /165X110-133\" 4/1 Satin",
        "metres_produced": 97.876,
        "rate_per_metre": 40.0,
        "revenue_inr": 3915.04,
        "active_looms": 1
      }
    ],
    "profitability": {
      "is_cost_data_available": true,
      "net_revenue_inr": 1989950.88,
      "yarn_cost_inr": 1034774.46,
      "power_energy_cost_inr": 218894.6,
      "direct_labour_cost_inr": 85000.0,
      "maintenance_spares_inr": 14500.0,
      "total_direct_costs_inr": 1353169.06,
      "contribution_profit_inr": 636781.82,
      "profit_margin_pct": 32.0
    },
    "loss_attribution_waterfall": {
      "potential_max_revenue": 2312832.88,
      "realized_revenue": 1989950.88,
      "realized_metres": 49748.772,
      "waterfall_components": [
        {
          "category": "Mechanical / Mechanical Breakdowns",
          "lost_metres": 1473.33,
          "lost_revenue_inr": 58933.2,
          "share_pct": 2.5,
          "provenance": "CALCULATED"
        },
        {
          "category": "Electrical & Grid Fluctuation",
          "lost_metres": 5026.61,
          "lost_revenue_inr": 201064.4,
          "share_pct": 8.7,
          "provenance": "CALCULATED"
        },
        {
          "category": "Speed / Running Efficiency Gap",
          "lost_metres": 1484.39,
          "lost_revenue_inr": 59375.6,
          "share_pct": 2.6,
          "provenance": "CALCULATED"
        },
        {
          "category": "Quality Defects & Downgrade",
          "lost_metres": 233.92,
          "lost_revenue_inr": 3508.8,
          "share_pct": 0.2,
          "provenance": "ESTIMATED"
        }
      ],
      "total_revenue_loss_inr": 322882.0
    },
    "period_summary": [
      {
        "label": "Today",
        "period_code": "TODAY",
        "start_date": "2026-07-31",
        "end_date": "2026-07-31",
        "metres": 49748.772,
        "revenue_inr": 1989950.88,
        "loss_inr": 322882.0,
        "potential_revenue_inr": 2312832.88,
        "dominant_reason": "Electrical & Grid Fluctuation",
        "dominant_reason_loss_inr": 201064.4,
        "records_analyzed": 576
      },
      {
        "label": "Last 7 days",
        "period_code": "SEVEN_DAYS",
        "start_date": "2026-07-25",
        "end_date": "2026-07-31",
        "metres": 333135.972,
        "revenue_inr": 13325438.88,
        "loss_inr": 2206902.45,
        "potential_revenue_inr": 15532341.33,
        "dominant_reason": "Electrical & Grid Fluctuation",
        "dominant_reason_loss_inr": 1365384.8,
        "records_analyzed": 4032
      },
      {
        "label": "Month to date",
        "period_code": "MONTH_TO_DATE",
        "start_date": "2026-07-01",
        "end_date": "2026-07-31",
        "metres": 1490504.772,
        "revenue_inr": 59620190.88,
        "loss_inr": 9830550.85,
        "potential_revenue_inr": 69450741.73,
        "dominant_reason": "Electrical & Grid Fluctuation",
        "dominant_reason_loss_inr": 6052960.8,
        "records_analyzed": 17856
      },
      {
        "label": "Year to date",
        "period_code": "YEAR_TO_DATE",
        "start_date": "2026-01-01",
        "end_date": "2026-07-31",
        "metres": 1490504.772,
        "revenue_inr": 59620190.88,
        "loss_inr": 9830550.85,
        "potential_revenue_inr": 69450741.73,
        "dominant_reason": "Electrical & Grid Fluctuation",
        "dominant_reason_loss_inr": 6052960.8,
        "records_analyzed": 17856
      }
    ],
    "daily_trend": [
      {
        "date": "2026-07-18",
        "day_label": "18 Jul",
        "revenue_inr": 1862932.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 217068.0,
        "efficiency_pct": 86.5,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 75973.8,
        "electrical_loss_inr": 97680.6,
        "efficiency_loss_inr": 54267.0,
        "quality_loss_inr": 17365.44
      },
      {
        "date": "2026-07-19",
        "day_label": "19 Jul",
        "revenue_inr": 1973476.0,
        "potential_revenue_inr": 2091884.56,
        "loss_inr": 118408.56,
        "efficiency_pct": 90.8,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 41443.0,
        "electrical_loss_inr": 53283.85,
        "efficiency_loss_inr": 29602.14,
        "quality_loss_inr": 9472.68
      },
      {
        "date": "2026-07-20",
        "day_label": "20 Jul",
        "revenue_inr": 2068568.0,
        "potential_revenue_inr": 2192682.08,
        "loss_inr": 124114.08,
        "efficiency_pct": 94.6,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 43439.93,
        "electrical_loss_inr": 55851.34,
        "efficiency_loss_inr": 31028.52,
        "quality_loss_inr": 9929.13
      },
      {
        "date": "2026-07-21",
        "day_label": "21 Jul",
        "revenue_inr": 1910764.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 169236.0,
        "efficiency_pct": 88.0,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 59232.6,
        "electrical_loss_inr": 76156.2,
        "efficiency_loss_inr": 42309.0,
        "quality_loss_inr": 13538.88
      },
      {
        "date": "2026-07-22",
        "day_label": "22 Jul",
        "revenue_inr": 1397348.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 682652.0,
        "efficiency_pct": 67.3,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 238928.2,
        "electrical_loss_inr": 307193.4,
        "efficiency_loss_inr": 170663.0,
        "quality_loss_inr": 54612.16
      },
      {
        "date": "2026-07-23",
        "day_label": "23 Jul",
        "revenue_inr": 1865184.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 214816.0,
        "efficiency_pct": 85.9,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 75185.6,
        "electrical_loss_inr": 96667.2,
        "efficiency_loss_inr": 53704.0,
        "quality_loss_inr": 17185.28
      },
      {
        "date": "2026-07-24",
        "day_label": "24 Jul",
        "revenue_inr": 1983992.0,
        "potential_revenue_inr": 2103031.52,
        "loss_inr": 119039.52,
        "efficiency_pct": 91.7,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 41663.83,
        "electrical_loss_inr": 53567.78,
        "efficiency_loss_inr": 29759.88,
        "quality_loss_inr": 9523.16
      },
      {
        "date": "2026-07-25",
        "day_label": "25 Jul",
        "revenue_inr": 2100096.0,
        "potential_revenue_inr": 2226101.76,
        "loss_inr": 126005.76,
        "efficiency_pct": 95.6,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 44102.02,
        "electrical_loss_inr": 56702.59,
        "efficiency_loss_inr": 31501.44,
        "quality_loss_inr": 10080.46
      },
      {
        "date": "2026-07-26",
        "day_label": "26 Jul",
        "revenue_inr": 1559228.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 520772.0,
        "efficiency_pct": 71.5,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 182270.2,
        "electrical_loss_inr": 234347.4,
        "efficiency_loss_inr": 130193.0,
        "quality_loss_inr": 41661.76
      },
      {
        "date": "2026-07-27",
        "day_label": "27 Jul",
        "revenue_inr": 1943692.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 136308.0,
        "efficiency_pct": 89.4,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 47707.8,
        "electrical_loss_inr": 61338.6,
        "efficiency_loss_inr": 34077.0,
        "quality_loss_inr": 10904.64
      },
      {
        "date": "2026-07-28",
        "day_label": "28 Jul",
        "revenue_inr": 1816304.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 263696.0,
        "efficiency_pct": 83.1,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 92293.6,
        "electrical_loss_inr": 118663.2,
        "efficiency_loss_inr": 65924.0,
        "quality_loss_inr": 21095.68
      },
      {
        "date": "2026-07-29",
        "day_label": "29 Jul",
        "revenue_inr": 1896168.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 183832.0,
        "efficiency_pct": 90.3,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 64341.2,
        "electrical_loss_inr": 82724.4,
        "efficiency_loss_inr": 45958.0,
        "quality_loss_inr": 14706.56
      },
      {
        "date": "2026-07-30",
        "day_label": "30 Jul",
        "revenue_inr": 2020000.0,
        "potential_revenue_inr": 2141200.0,
        "loss_inr": 121200.0,
        "efficiency_pct": 91.8,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 42420.0,
        "electrical_loss_inr": 54540.0,
        "efficiency_loss_inr": 30300.0,
        "quality_loss_inr": 9696.0
      },
      {
        "date": "2026-07-31",
        "day_label": "31 Jul",
        "revenue_inr": 1989950.88,
        "potential_revenue_inr": 2109347.93,
        "loss_inr": 119397.05,
        "efficiency_pct": 91.7,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 41788.97,
        "electrical_loss_inr": 53728.67,
        "efficiency_loss_inr": 29849.26,
        "quality_loss_inr": 9551.76
      }
    ],
    "department_sectors": [
      {
        "sector_id": "electrical_power",
        "sector_name": "Electrical and power",
        "loss_inr": 201064.4,
        "affected_metres": 5026.6,
        "problem_count": 4,
        "main_reason": "Grid voltage dips at 17:37-18:47 causing simultaneous loom inverter trips",
        "recommended_action": "Recalibrate transformer tap-changer & inspect Sub-panel 4 capacitor bank.",
        "owner": "Chief Electrical Engineer",
        "urgency": "CRITICAL",
        "trend_status": "WORSENING",
        "is_repeating": true,
        "repeating_note": "Top revenue loss cause today and month to date (4 voltage dips on 14/08).",
        "loss_per_metre": 40.0,
        "loss_per_hour": 8377.68,
        "provenance": "CALCULATED"
      },
      {
        "sector_id": "mechanical_maintenance",
        "sector_name": "Mechanical maintenance",
        "loss_inr": 58933.2,
        "affected_metres": 1473.3,
        "problem_count": 18,
        "main_reason": "Knotting cycle delays and cutter edge wear on high-speed airjets",
        "recommended_action": "Enforce 15-minute knotting standard & replace worn cutters on AJ-118/132.",
        "owner": "Mechanical Maintenance Lead",
        "urgency": "WARNING",
        "trend_status": "IMPROVING",
        "is_repeating": false,
        "repeating_note": "Mechanical MTTR improved from 28 min to 22 min following preventative overhaul.",
        "loss_per_metre": 40.0,
        "loss_per_hour": 2455.55,
        "provenance": "CALCULATED"
      },
      {
        "sector_id": "weaving_efficiency",
        "sector_name": "Weaving efficiency",
        "loss_inr": 59375.6,
        "affected_metres": 1484.4,
        "problem_count": 26,
        "main_reason": "Shift 3 running speed deficit and delayed weaver break attendance",
        "recommended_action": "Rebalance weaver loom allotment and increase night-shift jobber floor patrol.",
        "owner": "Weaving Shift In-Charge",
        "urgency": "WARNING",
        "trend_status": "STABLE",
        "is_repeating": true,
        "repeating_note": "Shift 3 operating below unit speed baseline across 5 of the last 7 days.",
        "loss_per_metre": 40.0,
        "loss_per_hour": 2473.98,
        "provenance": "CALCULATED"
      },
      {
        "sector_id": "quality_seconds",
        "sector_name": "Quality and seconds",
        "loss_inr": 3508.8,
        "affected_metres": 233.9,
        "problem_count": 12,
        "main_reason": "Warp floats and reed mark blemishes downgraded to seconds at \u20b915/m discount",
        "recommended_action": "Audit drop-wire tension & clean reed dents on styles with crimp > 8.5%.",
        "owner": "Quality Assurance Manager",
        "urgency": "WARNING",
        "trend_status": "WORSENING",
        "is_repeating": false,
        "repeating_note": "Small daily loss but defect volume up +12% MTD due to warp floats.",
        "loss_per_metre": 15.0,
        "loss_per_hour": 146.2,
        "provenance": "ESTIMATED"
      },
      {
        "sector_id": "workforce_allocation",
        "sector_name": "Workforce allocation",
        "loss_inr": 18400.0,
        "affected_metres": 460.0,
        "problem_count": 3,
        "main_reason": "Grade 1 trainee weavers allocated to 8-loom blocks exceeding 4-loom standard norm",
        "recommended_action": "Reassign trainees to 4-loom sets and pair with Grade 1+ mentor weavers.",
        "owner": "Weaving Production Superintendent",
        "urgency": "WARNING",
        "trend_status": "STABLE",
        "is_repeating": true,
        "repeating_note": "Workforce allocation explains ~34% of weaving running efficiency loss.",
        "loss_per_metre": 40.0,
        "loss_per_hour": 766.67,
        "provenance": "ESTIMATED"
      },
      {
        "sector_id": "air_compressor",
        "sector_name": "Air and compressor",
        "loss_inr": 3200.0,
        "affected_metres": 80.0,
        "problem_count": 2,
        "main_reason": "Main nozzle pneumatic pressure drop on AJ-118 causing micro-weft sensor stops",
        "recommended_action": "Replace leaking pneumatic coupling & flush manifold drain trap in Shed 2.",
        "owner": "Pneumatics & Utility Supervisor",
        "urgency": "HEALTHY",
        "trend_status": "STABLE",
        "is_repeating": false,
        "repeating_note": "Compressor operating within 32 CFM standard band with low leakage.",
        "loss_per_metre": 40.0,
        "loss_per_hour": 133.33,
        "provenance": "CALCULATED"
      },
      {
        "sector_id": "commercial_rate_card",
        "sector_name": "Commercial rate card and cost trust",
        "loss_inr": 0.0,
        "affected_metres": 0.0,
        "problem_count": 10,
        "main_reason": "\u20b940.00/m placeholder selling price in use; actual ERP contract rates unconfirmed",
        "recommended_action": "Confirm style rate card in Commercial Rate Card panel to unlock 100% audit trust.",
        "owner": "Commercial & Costing Head",
        "urgency": "WARNING",
        "trend_status": "STABLE",
        "is_repeating": false,
        "repeating_note": "Pending management sign-off on 10 fabric style commercial rates.",
        "loss_per_metre": 0.0,
        "loss_per_hour": 0.0,
        "provenance": "ESTIMATED"
      }
    ],
    "owner_summary": {
      "one_sentence_verdict": "Electrical and power is the largest revenue loss today (62.3%). Approve transformer and sub-panel inspection before evening shift to protect \u20b9201,064.",
      "three_key_numbers": [
        {
          "label": "Realized Revenue",
          "value": "\u20b91,989,951",
          "provenance": "CALCULATED"
        },
        {
          "label": "Total Revenue Loss",
          "value": "-\u20b9322,882",
          "provenance": "CALCULATED"
        },
        {
          "label": "Contribution Profit",
          "value": "\u20b9636,782 (32.0%)",
          "provenance": "CALCULATED"
        }
      ],
      "one_biggest_reason": "Grid voltage dips at 17:37-18:47 causing simultaneous loom inverter trips",
      "one_action_to_approve": "Approve transformer & Sub-panel 4 capacitor inspection before evening shift.",
      "one_recovery_amount_inr": 201064.4,
      "overall_trend": "WORSENING",
      "recoverable_revenue_inr": 201064.4,
      "potential_max_revenue_inr": 2312832.88,
      "dominant_problem_department": "Electrical and power",
      "primary_action_owner": "Chief Electrical Engineer",
      "urgency": "CRITICAL"
    },
    "repeating_problems": [
      {
        "sector": "Electrical and power",
        "alert_type": "PERSISTENT_CHRONIC",
        "headline": "Top revenue loss cause today and month to date",
        "detail": "Grid voltage instability at 17:37-18:47 caused 4 synchronous trips affecting 42 looms.",
        "urgency": "CRITICAL"
      },
      {
        "sector": "Mechanical maintenance",
        "alert_type": "IMPROVING_TREND",
        "headline": "Mechanical downtime improving vs last week",
        "detail": "MTTR dropped from 28 min to 22 min following preventive overhaul on Tsudakoma airjets.",
        "urgency": "HEALTHY"
      },
      {
        "sector": "Quality and seconds",
        "alert_type": "ACCELERATING_DEFECTS",
        "headline": "Quality loss is small today but increasing MTD",
        "detail": "Warp float defect rate increased +12% over trailing 14 days, primarily on high-crimp sorts.",
        "urgency": "WARNING"
      },
      {
        "sector": "Workforce allocation",
        "alert_type": "INDIRECT_DRIVER",
        "headline": "Workforce allocation explains 34% of efficiency loss",
        "detail": "Grade 1 trainee weavers allocated to 8 looms instead of 4-loom skill norm.",
        "urgency": "WARNING"
      }
    ],
    "business_intelligence": {
      "highest_revenue_style": {
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "revenue_inr": 1883721.12,
        "metres": 47093.028
      },
      "lowest_revenue_style": {
        "style_code": "60s Excel X 40s Vortex /165X110-133\" 4/1 Satin",
        "revenue_inr": 3915.04,
        "metres": 97.876
      },
      "best_recovery_opportunity": {
        "title": "Recalibrate Sub-panel 4 Transformer",
        "recovery_inr": 201064.4,
        "department": "Electrical and power"
      },
      "biggest_recurring_problem": {
        "title": "Grid Voltage Fluctuations",
        "department": "Electrical and power",
        "frequency": "4 occurrences on 14/08, recurring 3 times this week"
      },
      "most_problem_count_department": {
        "department": "Mechanical maintenance",
        "event_count": 18,
        "loss_inr": 58933.2
      },
      "highest_rupee_loss_department": {
        "department": "Electrical and power",
        "loss_inr": 201064.4,
        "share_pct": 46.5
      },
      "low_count_high_impact_department": {
        "department": "Electrical and power",
        "count": 4,
        "loss_inr": 201064.4,
        "insight": "Only 4 events, yet accounts for 46.5% of total factory revenue lost."
      },
      "revenue_protected_if_top_action_succeeds": 201064.4,
      "month_end_target_risk_inr": 145000.0,
      "loss_per_metre_inr": 6.49,
      "loss_per_hour_inr": 13453.42
    },
    "evidence_items": [
      {
        "source": "Energy log",
        "finding": "4 voltage dips at evening peak",
        "action": "Panel inspection"
      },
      {
        "source": "Stop events",
        "finding": "Inverter trips across loom group",
        "action": "Drive check"
      },
      {
        "source": "Production log",
        "finding": "5,026 metres capacity loss",
        "action": "Monitor output"
      }
    ],
    "provenance": {
      "revenue": "AVAILABLE / ERP RATE CARD",
      "profitability": "CALCULATED WITH COST GATING",
      "loss_waterfall": "CALCULATED (MUTUALLY EXCLUSIVE)",
      "rate_card": "ESTIMATED (PLACEHOLDER RATE)"
    }
  },
  "revenueAnalyticsMonth": {
    "work_date": "2026-07-31",
    "unit_code": "ATM",
    "selected_period": "THIS_MONTH",
    "today_total_revenue_inr": 1989950.88,
    "month_to_date_revenue_inr": 59620190.88,
    "period_total_revenue_inr": 1989950.88,
    "potential_max_revenue_inr": 2312832.88,
    "total_revenue_loss_inr": 322882.0,
    "recoverable_revenue_inr": 201064.4,
    "style_revenues": [
      {
        "style_id": 1,
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "metres_produced": 47093.028,
        "rate_per_metre": 40.0,
        "revenue_inr": 1883721.12,
        "active_looms": 166
      },
      {
        "style_id": 5,
        "style_code": "12s VSF Slub X 12s VSF Slub /56X44-63\" Plain",
        "metres_produced": 1160.733,
        "rate_per_metre": 40.0,
        "revenue_inr": 46429.32,
        "active_looms": 11
      },
      {
        "style_id": 2,
        "style_code": "30s VSF X 30s VOT /68X57-48\" Plain",
        "metres_produced": 615.935,
        "rate_per_metre": 40.0,
        "revenue_inr": 24637.4,
        "active_looms": 7
      },
      {
        "style_id": 3,
        "style_code": "30s VSF Slub X 30s VSF Slub /90X68-63\" Plain",
        "metres_produced": 427.929,
        "rate_per_metre": 40.0,
        "revenue_inr": 17117.16,
        "active_looms": 6
      },
      {
        "style_id": 10,
        "style_code": "20s OE X 21s Cotton Flax /56X44-63\" Plain",
        "metres_produced": 353.271,
        "rate_per_metre": 40.0,
        "revenue_inr": 14130.84,
        "active_looms": 1
      },
      {
        "style_id": 8,
        "style_code": "60s Excel X 40s Vortex /165X110-133\" 4/1 Satin",
        "metres_produced": 97.876,
        "rate_per_metre": 40.0,
        "revenue_inr": 3915.04,
        "active_looms": 1
      }
    ],
    "profitability": {
      "is_cost_data_available": true,
      "net_revenue_inr": 1989950.88,
      "yarn_cost_inr": 1034774.46,
      "power_energy_cost_inr": 218894.6,
      "direct_labour_cost_inr": 85000.0,
      "maintenance_spares_inr": 14500.0,
      "total_direct_costs_inr": 1353169.06,
      "contribution_profit_inr": 636781.82,
      "profit_margin_pct": 32.0
    },
    "loss_attribution_waterfall": {
      "potential_max_revenue": 2312832.88,
      "realized_revenue": 1989950.88,
      "realized_metres": 49748.772,
      "waterfall_components": [
        {
          "category": "Mechanical / Mechanical Breakdowns",
          "lost_metres": 1473.33,
          "lost_revenue_inr": 58933.2,
          "share_pct": 2.5,
          "provenance": "CALCULATED"
        },
        {
          "category": "Electrical & Grid Fluctuation",
          "lost_metres": 5026.61,
          "lost_revenue_inr": 201064.4,
          "share_pct": 8.7,
          "provenance": "CALCULATED"
        },
        {
          "category": "Speed / Running Efficiency Gap",
          "lost_metres": 1484.39,
          "lost_revenue_inr": 59375.6,
          "share_pct": 2.6,
          "provenance": "CALCULATED"
        },
        {
          "category": "Quality Defects & Downgrade",
          "lost_metres": 233.92,
          "lost_revenue_inr": 3508.8,
          "share_pct": 0.2,
          "provenance": "ESTIMATED"
        }
      ],
      "total_revenue_loss_inr": 322882.0
    },
    "period_summary": [
      {
        "label": "Today",
        "period_code": "TODAY",
        "start_date": "2026-07-31",
        "end_date": "2026-07-31",
        "metres": 49748.772,
        "revenue_inr": 1989950.88,
        "loss_inr": 322882.0,
        "potential_revenue_inr": 2312832.88,
        "dominant_reason": "Electrical & Grid Fluctuation",
        "dominant_reason_loss_inr": 201064.4,
        "records_analyzed": 576
      },
      {
        "label": "Last 7 days",
        "period_code": "SEVEN_DAYS",
        "start_date": "2026-07-25",
        "end_date": "2026-07-31",
        "metres": 333135.972,
        "revenue_inr": 13325438.88,
        "loss_inr": 2206902.45,
        "potential_revenue_inr": 15532341.33,
        "dominant_reason": "Electrical & Grid Fluctuation",
        "dominant_reason_loss_inr": 1365384.8,
        "records_analyzed": 4032
      },
      {
        "label": "Month to date",
        "period_code": "MONTH_TO_DATE",
        "start_date": "2026-07-01",
        "end_date": "2026-07-31",
        "metres": 1490504.772,
        "revenue_inr": 59620190.88,
        "loss_inr": 9830550.85,
        "potential_revenue_inr": 69450741.73,
        "dominant_reason": "Electrical & Grid Fluctuation",
        "dominant_reason_loss_inr": 6052960.8,
        "records_analyzed": 17856
      },
      {
        "label": "Year to date",
        "period_code": "YEAR_TO_DATE",
        "start_date": "2026-01-01",
        "end_date": "2026-07-31",
        "metres": 1490504.772,
        "revenue_inr": 59620190.88,
        "loss_inr": 9830550.85,
        "potential_revenue_inr": 69450741.73,
        "dominant_reason": "Electrical & Grid Fluctuation",
        "dominant_reason_loss_inr": 6052960.8,
        "records_analyzed": 17856
      }
    ],
    "daily_trend": [
      {
        "date": "2026-07-18",
        "day_label": "18 Jul",
        "revenue_inr": 1862932.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 217068.0,
        "efficiency_pct": 86.5,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 75973.8,
        "electrical_loss_inr": 97680.6,
        "efficiency_loss_inr": 54267.0,
        "quality_loss_inr": 17365.44
      },
      {
        "date": "2026-07-19",
        "day_label": "19 Jul",
        "revenue_inr": 1973476.0,
        "potential_revenue_inr": 2091884.56,
        "loss_inr": 118408.56,
        "efficiency_pct": 90.8,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 41443.0,
        "electrical_loss_inr": 53283.85,
        "efficiency_loss_inr": 29602.14,
        "quality_loss_inr": 9472.68
      },
      {
        "date": "2026-07-20",
        "day_label": "20 Jul",
        "revenue_inr": 2068568.0,
        "potential_revenue_inr": 2192682.08,
        "loss_inr": 124114.08,
        "efficiency_pct": 94.6,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 43439.93,
        "electrical_loss_inr": 55851.34,
        "efficiency_loss_inr": 31028.52,
        "quality_loss_inr": 9929.13
      },
      {
        "date": "2026-07-21",
        "day_label": "21 Jul",
        "revenue_inr": 1910764.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 169236.0,
        "efficiency_pct": 88.0,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 59232.6,
        "electrical_loss_inr": 76156.2,
        "efficiency_loss_inr": 42309.0,
        "quality_loss_inr": 13538.88
      },
      {
        "date": "2026-07-22",
        "day_label": "22 Jul",
        "revenue_inr": 1397348.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 682652.0,
        "efficiency_pct": 67.3,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 238928.2,
        "electrical_loss_inr": 307193.4,
        "efficiency_loss_inr": 170663.0,
        "quality_loss_inr": 54612.16
      },
      {
        "date": "2026-07-23",
        "day_label": "23 Jul",
        "revenue_inr": 1865184.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 214816.0,
        "efficiency_pct": 85.9,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 75185.6,
        "electrical_loss_inr": 96667.2,
        "efficiency_loss_inr": 53704.0,
        "quality_loss_inr": 17185.28
      },
      {
        "date": "2026-07-24",
        "day_label": "24 Jul",
        "revenue_inr": 1983992.0,
        "potential_revenue_inr": 2103031.52,
        "loss_inr": 119039.52,
        "efficiency_pct": 91.7,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 41663.83,
        "electrical_loss_inr": 53567.78,
        "efficiency_loss_inr": 29759.88,
        "quality_loss_inr": 9523.16
      },
      {
        "date": "2026-07-25",
        "day_label": "25 Jul",
        "revenue_inr": 2100096.0,
        "potential_revenue_inr": 2226101.76,
        "loss_inr": 126005.76,
        "efficiency_pct": 95.6,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 44102.02,
        "electrical_loss_inr": 56702.59,
        "efficiency_loss_inr": 31501.44,
        "quality_loss_inr": 10080.46
      },
      {
        "date": "2026-07-26",
        "day_label": "26 Jul",
        "revenue_inr": 1559228.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 520772.0,
        "efficiency_pct": 71.5,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 182270.2,
        "electrical_loss_inr": 234347.4,
        "efficiency_loss_inr": 130193.0,
        "quality_loss_inr": 41661.76
      },
      {
        "date": "2026-07-27",
        "day_label": "27 Jul",
        "revenue_inr": 1943692.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 136308.0,
        "efficiency_pct": 89.4,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 47707.8,
        "electrical_loss_inr": 61338.6,
        "efficiency_loss_inr": 34077.0,
        "quality_loss_inr": 10904.64
      },
      {
        "date": "2026-07-28",
        "day_label": "28 Jul",
        "revenue_inr": 1816304.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 263696.0,
        "efficiency_pct": 83.1,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 92293.6,
        "electrical_loss_inr": 118663.2,
        "efficiency_loss_inr": 65924.0,
        "quality_loss_inr": 21095.68
      },
      {
        "date": "2026-07-29",
        "day_label": "29 Jul",
        "revenue_inr": 1896168.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 183832.0,
        "efficiency_pct": 90.3,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 64341.2,
        "electrical_loss_inr": 82724.4,
        "efficiency_loss_inr": 45958.0,
        "quality_loss_inr": 14706.56
      },
      {
        "date": "2026-07-30",
        "day_label": "30 Jul",
        "revenue_inr": 2020000.0,
        "potential_revenue_inr": 2141200.0,
        "loss_inr": 121200.0,
        "efficiency_pct": 91.8,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 42420.0,
        "electrical_loss_inr": 54540.0,
        "efficiency_loss_inr": 30300.0,
        "quality_loss_inr": 9696.0
      },
      {
        "date": "2026-07-31",
        "day_label": "31 Jul",
        "revenue_inr": 1989950.88,
        "potential_revenue_inr": 2109347.93,
        "loss_inr": 119397.05,
        "efficiency_pct": 91.7,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 41788.97,
        "electrical_loss_inr": 53728.67,
        "efficiency_loss_inr": 29849.26,
        "quality_loss_inr": 9551.76
      }
    ],
    "department_sectors": [
      {
        "sector_id": "electrical_power",
        "sector_name": "Electrical and power",
        "loss_inr": 201064.4,
        "affected_metres": 5026.6,
        "problem_count": 4,
        "main_reason": "Grid voltage dips at 17:37-18:47 causing simultaneous loom inverter trips",
        "recommended_action": "Recalibrate transformer tap-changer & inspect Sub-panel 4 capacitor bank.",
        "owner": "Chief Electrical Engineer",
        "urgency": "CRITICAL",
        "trend_status": "WORSENING",
        "is_repeating": true,
        "repeating_note": "Top revenue loss cause today and month to date (4 voltage dips on 14/08).",
        "loss_per_metre": 40.0,
        "loss_per_hour": 8377.68,
        "provenance": "CALCULATED"
      },
      {
        "sector_id": "mechanical_maintenance",
        "sector_name": "Mechanical maintenance",
        "loss_inr": 58933.2,
        "affected_metres": 1473.3,
        "problem_count": 18,
        "main_reason": "Knotting cycle delays and cutter edge wear on high-speed airjets",
        "recommended_action": "Enforce 15-minute knotting standard & replace worn cutters on AJ-118/132.",
        "owner": "Mechanical Maintenance Lead",
        "urgency": "WARNING",
        "trend_status": "IMPROVING",
        "is_repeating": false,
        "repeating_note": "Mechanical MTTR improved from 28 min to 22 min following preventative overhaul.",
        "loss_per_metre": 40.0,
        "loss_per_hour": 2455.55,
        "provenance": "CALCULATED"
      },
      {
        "sector_id": "weaving_efficiency",
        "sector_name": "Weaving efficiency",
        "loss_inr": 59375.6,
        "affected_metres": 1484.4,
        "problem_count": 26,
        "main_reason": "Shift 3 running speed deficit and delayed weaver break attendance",
        "recommended_action": "Rebalance weaver loom allotment and increase night-shift jobber floor patrol.",
        "owner": "Weaving Shift In-Charge",
        "urgency": "WARNING",
        "trend_status": "STABLE",
        "is_repeating": true,
        "repeating_note": "Shift 3 operating below unit speed baseline across 5 of the last 7 days.",
        "loss_per_metre": 40.0,
        "loss_per_hour": 2473.98,
        "provenance": "CALCULATED"
      },
      {
        "sector_id": "quality_seconds",
        "sector_name": "Quality and seconds",
        "loss_inr": 3508.8,
        "affected_metres": 233.9,
        "problem_count": 12,
        "main_reason": "Warp floats and reed mark blemishes downgraded to seconds at \u20b915/m discount",
        "recommended_action": "Audit drop-wire tension & clean reed dents on styles with crimp > 8.5%.",
        "owner": "Quality Assurance Manager",
        "urgency": "WARNING",
        "trend_status": "WORSENING",
        "is_repeating": false,
        "repeating_note": "Small daily loss but defect volume up +12% MTD due to warp floats.",
        "loss_per_metre": 15.0,
        "loss_per_hour": 146.2,
        "provenance": "ESTIMATED"
      },
      {
        "sector_id": "workforce_allocation",
        "sector_name": "Workforce allocation",
        "loss_inr": 18400.0,
        "affected_metres": 460.0,
        "problem_count": 3,
        "main_reason": "Grade 1 trainee weavers allocated to 8-loom blocks exceeding 4-loom standard norm",
        "recommended_action": "Reassign trainees to 4-loom sets and pair with Grade 1+ mentor weavers.",
        "owner": "Weaving Production Superintendent",
        "urgency": "WARNING",
        "trend_status": "STABLE",
        "is_repeating": true,
        "repeating_note": "Workforce allocation explains ~34% of weaving running efficiency loss.",
        "loss_per_metre": 40.0,
        "loss_per_hour": 766.67,
        "provenance": "ESTIMATED"
      },
      {
        "sector_id": "air_compressor",
        "sector_name": "Air and compressor",
        "loss_inr": 3200.0,
        "affected_metres": 80.0,
        "problem_count": 2,
        "main_reason": "Main nozzle pneumatic pressure drop on AJ-118 causing micro-weft sensor stops",
        "recommended_action": "Replace leaking pneumatic coupling & flush manifold drain trap in Shed 2.",
        "owner": "Pneumatics & Utility Supervisor",
        "urgency": "HEALTHY",
        "trend_status": "STABLE",
        "is_repeating": false,
        "repeating_note": "Compressor operating within 32 CFM standard band with low leakage.",
        "loss_per_metre": 40.0,
        "loss_per_hour": 133.33,
        "provenance": "CALCULATED"
      },
      {
        "sector_id": "commercial_rate_card",
        "sector_name": "Commercial rate card and cost trust",
        "loss_inr": 0.0,
        "affected_metres": 0.0,
        "problem_count": 10,
        "main_reason": "\u20b940.00/m placeholder selling price in use; actual ERP contract rates unconfirmed",
        "recommended_action": "Confirm style rate card in Commercial Rate Card panel to unlock 100% audit trust.",
        "owner": "Commercial & Costing Head",
        "urgency": "WARNING",
        "trend_status": "STABLE",
        "is_repeating": false,
        "repeating_note": "Pending management sign-off on 10 fabric style commercial rates.",
        "loss_per_metre": 0.0,
        "loss_per_hour": 0.0,
        "provenance": "ESTIMATED"
      }
    ],
    "owner_summary": {
      "one_sentence_verdict": "Electrical and power is the largest revenue loss today (62.3%). Approve transformer and sub-panel inspection before evening shift to protect \u20b9201,064.",
      "three_key_numbers": [
        {
          "label": "Realized Revenue",
          "value": "\u20b91,989,951",
          "provenance": "CALCULATED"
        },
        {
          "label": "Total Revenue Loss",
          "value": "-\u20b9322,882",
          "provenance": "CALCULATED"
        },
        {
          "label": "Contribution Profit",
          "value": "\u20b9636,782 (32.0%)",
          "provenance": "CALCULATED"
        }
      ],
      "one_biggest_reason": "Grid voltage dips at 17:37-18:47 causing simultaneous loom inverter trips",
      "one_action_to_approve": "Approve transformer & Sub-panel 4 capacitor inspection before evening shift.",
      "one_recovery_amount_inr": 201064.4,
      "overall_trend": "WORSENING",
      "recoverable_revenue_inr": 201064.4,
      "potential_max_revenue_inr": 2312832.88,
      "dominant_problem_department": "Electrical and power",
      "primary_action_owner": "Chief Electrical Engineer",
      "urgency": "CRITICAL"
    },
    "repeating_problems": [
      {
        "sector": "Electrical and power",
        "alert_type": "PERSISTENT_CHRONIC",
        "headline": "Top revenue loss cause today and month to date",
        "detail": "Grid voltage instability at 17:37-18:47 caused 4 synchronous trips affecting 42 looms.",
        "urgency": "CRITICAL"
      },
      {
        "sector": "Mechanical maintenance",
        "alert_type": "IMPROVING_TREND",
        "headline": "Mechanical downtime improving vs last week",
        "detail": "MTTR dropped from 28 min to 22 min following preventive overhaul on Tsudakoma airjets.",
        "urgency": "HEALTHY"
      },
      {
        "sector": "Quality and seconds",
        "alert_type": "ACCELERATING_DEFECTS",
        "headline": "Quality loss is small today but increasing MTD",
        "detail": "Warp float defect rate increased +12% over trailing 14 days, primarily on high-crimp sorts.",
        "urgency": "WARNING"
      },
      {
        "sector": "Workforce allocation",
        "alert_type": "INDIRECT_DRIVER",
        "headline": "Workforce allocation explains 34% of efficiency loss",
        "detail": "Grade 1 trainee weavers allocated to 8 looms instead of 4-loom skill norm.",
        "urgency": "WARNING"
      }
    ],
    "business_intelligence": {
      "highest_revenue_style": {
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "revenue_inr": 1883721.12,
        "metres": 47093.028
      },
      "lowest_revenue_style": {
        "style_code": "60s Excel X 40s Vortex /165X110-133\" 4/1 Satin",
        "revenue_inr": 3915.04,
        "metres": 97.876
      },
      "best_recovery_opportunity": {
        "title": "Recalibrate Sub-panel 4 Transformer",
        "recovery_inr": 201064.4,
        "department": "Electrical and power"
      },
      "biggest_recurring_problem": {
        "title": "Grid Voltage Fluctuations",
        "department": "Electrical and power",
        "frequency": "4 occurrences on 14/08, recurring 3 times this week"
      },
      "most_problem_count_department": {
        "department": "Mechanical maintenance",
        "event_count": 18,
        "loss_inr": 58933.2
      },
      "highest_rupee_loss_department": {
        "department": "Electrical and power",
        "loss_inr": 201064.4,
        "share_pct": 46.5
      },
      "low_count_high_impact_department": {
        "department": "Electrical and power",
        "count": 4,
        "loss_inr": 201064.4,
        "insight": "Only 4 events, yet accounts for 46.5% of total factory revenue lost."
      },
      "revenue_protected_if_top_action_succeeds": 201064.4,
      "month_end_target_risk_inr": 145000.0,
      "loss_per_metre_inr": 6.49,
      "loss_per_hour_inr": 13453.42
    },
    "evidence_items": [
      {
        "source": "Energy log",
        "finding": "4 voltage dips at evening peak",
        "action": "Panel inspection"
      },
      {
        "source": "Stop events",
        "finding": "Inverter trips across loom group",
        "action": "Drive check"
      },
      {
        "source": "Production log",
        "finding": "5,026 metres capacity loss",
        "action": "Monitor output"
      }
    ],
    "provenance": {
      "revenue": "AVAILABLE / ERP RATE CARD",
      "profitability": "CALCULATED WITH COST GATING",
      "loss_waterfall": "CALCULATED (MUTUALLY EXCLUSIVE)",
      "rate_card": "ESTIMATED (PLACEHOLDER RATE)"
    }
  },
  "revenueAnalytics7D": {
    "work_date": "2026-07-31",
    "unit_code": "ATM",
    "selected_period": "LAST_7D",
    "today_total_revenue_inr": 1989950.88,
    "month_to_date_revenue_inr": 59620190.88,
    "period_total_revenue_inr": 1989950.88,
    "potential_max_revenue_inr": 2312832.88,
    "total_revenue_loss_inr": 322882.0,
    "recoverable_revenue_inr": 201064.4,
    "style_revenues": [
      {
        "style_id": 1,
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "metres_produced": 47093.028,
        "rate_per_metre": 40.0,
        "revenue_inr": 1883721.12,
        "active_looms": 166
      },
      {
        "style_id": 5,
        "style_code": "12s VSF Slub X 12s VSF Slub /56X44-63\" Plain",
        "metres_produced": 1160.733,
        "rate_per_metre": 40.0,
        "revenue_inr": 46429.32,
        "active_looms": 11
      },
      {
        "style_id": 2,
        "style_code": "30s VSF X 30s VOT /68X57-48\" Plain",
        "metres_produced": 615.935,
        "rate_per_metre": 40.0,
        "revenue_inr": 24637.4,
        "active_looms": 7
      },
      {
        "style_id": 3,
        "style_code": "30s VSF Slub X 30s VSF Slub /90X68-63\" Plain",
        "metres_produced": 427.929,
        "rate_per_metre": 40.0,
        "revenue_inr": 17117.16,
        "active_looms": 6
      },
      {
        "style_id": 10,
        "style_code": "20s OE X 21s Cotton Flax /56X44-63\" Plain",
        "metres_produced": 353.271,
        "rate_per_metre": 40.0,
        "revenue_inr": 14130.84,
        "active_looms": 1
      },
      {
        "style_id": 8,
        "style_code": "60s Excel X 40s Vortex /165X110-133\" 4/1 Satin",
        "metres_produced": 97.876,
        "rate_per_metre": 40.0,
        "revenue_inr": 3915.04,
        "active_looms": 1
      }
    ],
    "profitability": {
      "is_cost_data_available": true,
      "net_revenue_inr": 1989950.88,
      "yarn_cost_inr": 1034774.46,
      "power_energy_cost_inr": 218894.6,
      "direct_labour_cost_inr": 85000.0,
      "maintenance_spares_inr": 14500.0,
      "total_direct_costs_inr": 1353169.06,
      "contribution_profit_inr": 636781.82,
      "profit_margin_pct": 32.0
    },
    "loss_attribution_waterfall": {
      "potential_max_revenue": 2312832.88,
      "realized_revenue": 1989950.88,
      "realized_metres": 49748.772,
      "waterfall_components": [
        {
          "category": "Mechanical / Mechanical Breakdowns",
          "lost_metres": 1473.33,
          "lost_revenue_inr": 58933.2,
          "share_pct": 2.5,
          "provenance": "CALCULATED"
        },
        {
          "category": "Electrical & Grid Fluctuation",
          "lost_metres": 5026.61,
          "lost_revenue_inr": 201064.4,
          "share_pct": 8.7,
          "provenance": "CALCULATED"
        },
        {
          "category": "Speed / Running Efficiency Gap",
          "lost_metres": 1484.39,
          "lost_revenue_inr": 59375.6,
          "share_pct": 2.6,
          "provenance": "CALCULATED"
        },
        {
          "category": "Quality Defects & Downgrade",
          "lost_metres": 233.92,
          "lost_revenue_inr": 3508.8,
          "share_pct": 0.2,
          "provenance": "ESTIMATED"
        }
      ],
      "total_revenue_loss_inr": 322882.0
    },
    "period_summary": [
      {
        "label": "Today",
        "period_code": "TODAY",
        "start_date": "2026-07-31",
        "end_date": "2026-07-31",
        "metres": 49748.772,
        "revenue_inr": 1989950.88,
        "loss_inr": 322882.0,
        "potential_revenue_inr": 2312832.88,
        "dominant_reason": "Electrical & Grid Fluctuation",
        "dominant_reason_loss_inr": 201064.4,
        "records_analyzed": 576
      },
      {
        "label": "Last 7 days",
        "period_code": "SEVEN_DAYS",
        "start_date": "2026-07-25",
        "end_date": "2026-07-31",
        "metres": 333135.972,
        "revenue_inr": 13325438.88,
        "loss_inr": 2206902.45,
        "potential_revenue_inr": 15532341.33,
        "dominant_reason": "Electrical & Grid Fluctuation",
        "dominant_reason_loss_inr": 1365384.8,
        "records_analyzed": 4032
      },
      {
        "label": "Month to date",
        "period_code": "MONTH_TO_DATE",
        "start_date": "2026-07-01",
        "end_date": "2026-07-31",
        "metres": 1490504.772,
        "revenue_inr": 59620190.88,
        "loss_inr": 9830550.85,
        "potential_revenue_inr": 69450741.73,
        "dominant_reason": "Electrical & Grid Fluctuation",
        "dominant_reason_loss_inr": 6052960.8,
        "records_analyzed": 17856
      },
      {
        "label": "Year to date",
        "period_code": "YEAR_TO_DATE",
        "start_date": "2026-01-01",
        "end_date": "2026-07-31",
        "metres": 1490504.772,
        "revenue_inr": 59620190.88,
        "loss_inr": 9830550.85,
        "potential_revenue_inr": 69450741.73,
        "dominant_reason": "Electrical & Grid Fluctuation",
        "dominant_reason_loss_inr": 6052960.8,
        "records_analyzed": 17856
      }
    ],
    "daily_trend": [
      {
        "date": "2026-07-18",
        "day_label": "18 Jul",
        "revenue_inr": 1862932.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 217068.0,
        "efficiency_pct": 86.5,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 75973.8,
        "electrical_loss_inr": 97680.6,
        "efficiency_loss_inr": 54267.0,
        "quality_loss_inr": 17365.44
      },
      {
        "date": "2026-07-19",
        "day_label": "19 Jul",
        "revenue_inr": 1973476.0,
        "potential_revenue_inr": 2091884.56,
        "loss_inr": 118408.56,
        "efficiency_pct": 90.8,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 41443.0,
        "electrical_loss_inr": 53283.85,
        "efficiency_loss_inr": 29602.14,
        "quality_loss_inr": 9472.68
      },
      {
        "date": "2026-07-20",
        "day_label": "20 Jul",
        "revenue_inr": 2068568.0,
        "potential_revenue_inr": 2192682.08,
        "loss_inr": 124114.08,
        "efficiency_pct": 94.6,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 43439.93,
        "electrical_loss_inr": 55851.34,
        "efficiency_loss_inr": 31028.52,
        "quality_loss_inr": 9929.13
      },
      {
        "date": "2026-07-21",
        "day_label": "21 Jul",
        "revenue_inr": 1910764.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 169236.0,
        "efficiency_pct": 88.0,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 59232.6,
        "electrical_loss_inr": 76156.2,
        "efficiency_loss_inr": 42309.0,
        "quality_loss_inr": 13538.88
      },
      {
        "date": "2026-07-22",
        "day_label": "22 Jul",
        "revenue_inr": 1397348.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 682652.0,
        "efficiency_pct": 67.3,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 238928.2,
        "electrical_loss_inr": 307193.4,
        "efficiency_loss_inr": 170663.0,
        "quality_loss_inr": 54612.16
      },
      {
        "date": "2026-07-23",
        "day_label": "23 Jul",
        "revenue_inr": 1865184.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 214816.0,
        "efficiency_pct": 85.9,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 75185.6,
        "electrical_loss_inr": 96667.2,
        "efficiency_loss_inr": 53704.0,
        "quality_loss_inr": 17185.28
      },
      {
        "date": "2026-07-24",
        "day_label": "24 Jul",
        "revenue_inr": 1983992.0,
        "potential_revenue_inr": 2103031.52,
        "loss_inr": 119039.52,
        "efficiency_pct": 91.7,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 41663.83,
        "electrical_loss_inr": 53567.78,
        "efficiency_loss_inr": 29759.88,
        "quality_loss_inr": 9523.16
      },
      {
        "date": "2026-07-25",
        "day_label": "25 Jul",
        "revenue_inr": 2100096.0,
        "potential_revenue_inr": 2226101.76,
        "loss_inr": 126005.76,
        "efficiency_pct": 95.6,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 44102.02,
        "electrical_loss_inr": 56702.59,
        "efficiency_loss_inr": 31501.44,
        "quality_loss_inr": 10080.46
      },
      {
        "date": "2026-07-26",
        "day_label": "26 Jul",
        "revenue_inr": 1559228.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 520772.0,
        "efficiency_pct": 71.5,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 182270.2,
        "electrical_loss_inr": 234347.4,
        "efficiency_loss_inr": 130193.0,
        "quality_loss_inr": 41661.76
      },
      {
        "date": "2026-07-27",
        "day_label": "27 Jul",
        "revenue_inr": 1943692.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 136308.0,
        "efficiency_pct": 89.4,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 47707.8,
        "electrical_loss_inr": 61338.6,
        "efficiency_loss_inr": 34077.0,
        "quality_loss_inr": 10904.64
      },
      {
        "date": "2026-07-28",
        "day_label": "28 Jul",
        "revenue_inr": 1816304.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 263696.0,
        "efficiency_pct": 83.1,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 92293.6,
        "electrical_loss_inr": 118663.2,
        "efficiency_loss_inr": 65924.0,
        "quality_loss_inr": 21095.68
      },
      {
        "date": "2026-07-29",
        "day_label": "29 Jul",
        "revenue_inr": 1896168.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 183832.0,
        "efficiency_pct": 90.3,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 64341.2,
        "electrical_loss_inr": 82724.4,
        "efficiency_loss_inr": 45958.0,
        "quality_loss_inr": 14706.56
      },
      {
        "date": "2026-07-30",
        "day_label": "30 Jul",
        "revenue_inr": 2020000.0,
        "potential_revenue_inr": 2141200.0,
        "loss_inr": 121200.0,
        "efficiency_pct": 91.8,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 42420.0,
        "electrical_loss_inr": 54540.0,
        "efficiency_loss_inr": 30300.0,
        "quality_loss_inr": 9696.0
      },
      {
        "date": "2026-07-31",
        "day_label": "31 Jul",
        "revenue_inr": 1989950.88,
        "potential_revenue_inr": 2109347.93,
        "loss_inr": 119397.05,
        "efficiency_pct": 91.7,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 41788.97,
        "electrical_loss_inr": 53728.67,
        "efficiency_loss_inr": 29849.26,
        "quality_loss_inr": 9551.76
      }
    ],
    "department_sectors": [
      {
        "sector_id": "electrical_power",
        "sector_name": "Electrical and power",
        "loss_inr": 201064.4,
        "affected_metres": 5026.6,
        "problem_count": 4,
        "main_reason": "Grid voltage dips at 17:37-18:47 causing simultaneous loom inverter trips",
        "recommended_action": "Recalibrate transformer tap-changer & inspect Sub-panel 4 capacitor bank.",
        "owner": "Chief Electrical Engineer",
        "urgency": "CRITICAL",
        "trend_status": "WORSENING",
        "is_repeating": true,
        "repeating_note": "Top revenue loss cause today and month to date (4 voltage dips on 14/08).",
        "loss_per_metre": 40.0,
        "loss_per_hour": 8377.68,
        "provenance": "CALCULATED"
      },
      {
        "sector_id": "mechanical_maintenance",
        "sector_name": "Mechanical maintenance",
        "loss_inr": 58933.2,
        "affected_metres": 1473.3,
        "problem_count": 18,
        "main_reason": "Knotting cycle delays and cutter edge wear on high-speed airjets",
        "recommended_action": "Enforce 15-minute knotting standard & replace worn cutters on AJ-118/132.",
        "owner": "Mechanical Maintenance Lead",
        "urgency": "WARNING",
        "trend_status": "IMPROVING",
        "is_repeating": false,
        "repeating_note": "Mechanical MTTR improved from 28 min to 22 min following preventative overhaul.",
        "loss_per_metre": 40.0,
        "loss_per_hour": 2455.55,
        "provenance": "CALCULATED"
      },
      {
        "sector_id": "weaving_efficiency",
        "sector_name": "Weaving efficiency",
        "loss_inr": 59375.6,
        "affected_metres": 1484.4,
        "problem_count": 26,
        "main_reason": "Shift 3 running speed deficit and delayed weaver break attendance",
        "recommended_action": "Rebalance weaver loom allotment and increase night-shift jobber floor patrol.",
        "owner": "Weaving Shift In-Charge",
        "urgency": "WARNING",
        "trend_status": "STABLE",
        "is_repeating": true,
        "repeating_note": "Shift 3 operating below unit speed baseline across 5 of the last 7 days.",
        "loss_per_metre": 40.0,
        "loss_per_hour": 2473.98,
        "provenance": "CALCULATED"
      },
      {
        "sector_id": "quality_seconds",
        "sector_name": "Quality and seconds",
        "loss_inr": 3508.8,
        "affected_metres": 233.9,
        "problem_count": 12,
        "main_reason": "Warp floats and reed mark blemishes downgraded to seconds at \u20b915/m discount",
        "recommended_action": "Audit drop-wire tension & clean reed dents on styles with crimp > 8.5%.",
        "owner": "Quality Assurance Manager",
        "urgency": "WARNING",
        "trend_status": "WORSENING",
        "is_repeating": false,
        "repeating_note": "Small daily loss but defect volume up +12% MTD due to warp floats.",
        "loss_per_metre": 15.0,
        "loss_per_hour": 146.2,
        "provenance": "ESTIMATED"
      },
      {
        "sector_id": "workforce_allocation",
        "sector_name": "Workforce allocation",
        "loss_inr": 18400.0,
        "affected_metres": 460.0,
        "problem_count": 3,
        "main_reason": "Grade 1 trainee weavers allocated to 8-loom blocks exceeding 4-loom standard norm",
        "recommended_action": "Reassign trainees to 4-loom sets and pair with Grade 1+ mentor weavers.",
        "owner": "Weaving Production Superintendent",
        "urgency": "WARNING",
        "trend_status": "STABLE",
        "is_repeating": true,
        "repeating_note": "Workforce allocation explains ~34% of weaving running efficiency loss.",
        "loss_per_metre": 40.0,
        "loss_per_hour": 766.67,
        "provenance": "ESTIMATED"
      },
      {
        "sector_id": "air_compressor",
        "sector_name": "Air and compressor",
        "loss_inr": 3200.0,
        "affected_metres": 80.0,
        "problem_count": 2,
        "main_reason": "Main nozzle pneumatic pressure drop on AJ-118 causing micro-weft sensor stops",
        "recommended_action": "Replace leaking pneumatic coupling & flush manifold drain trap in Shed 2.",
        "owner": "Pneumatics & Utility Supervisor",
        "urgency": "HEALTHY",
        "trend_status": "STABLE",
        "is_repeating": false,
        "repeating_note": "Compressor operating within 32 CFM standard band with low leakage.",
        "loss_per_metre": 40.0,
        "loss_per_hour": 133.33,
        "provenance": "CALCULATED"
      },
      {
        "sector_id": "commercial_rate_card",
        "sector_name": "Commercial rate card and cost trust",
        "loss_inr": 0.0,
        "affected_metres": 0.0,
        "problem_count": 10,
        "main_reason": "\u20b940.00/m placeholder selling price in use; actual ERP contract rates unconfirmed",
        "recommended_action": "Confirm style rate card in Commercial Rate Card panel to unlock 100% audit trust.",
        "owner": "Commercial & Costing Head",
        "urgency": "WARNING",
        "trend_status": "STABLE",
        "is_repeating": false,
        "repeating_note": "Pending management sign-off on 10 fabric style commercial rates.",
        "loss_per_metre": 0.0,
        "loss_per_hour": 0.0,
        "provenance": "ESTIMATED"
      }
    ],
    "owner_summary": {
      "one_sentence_verdict": "Electrical and power is the largest revenue loss today (62.3%). Approve transformer and sub-panel inspection before evening shift to protect \u20b9201,064.",
      "three_key_numbers": [
        {
          "label": "Realized Revenue",
          "value": "\u20b91,989,951",
          "provenance": "CALCULATED"
        },
        {
          "label": "Total Revenue Loss",
          "value": "-\u20b9322,882",
          "provenance": "CALCULATED"
        },
        {
          "label": "Contribution Profit",
          "value": "\u20b9636,782 (32.0%)",
          "provenance": "CALCULATED"
        }
      ],
      "one_biggest_reason": "Grid voltage dips at 17:37-18:47 causing simultaneous loom inverter trips",
      "one_action_to_approve": "Approve transformer & Sub-panel 4 capacitor inspection before evening shift.",
      "one_recovery_amount_inr": 201064.4,
      "overall_trend": "WORSENING",
      "recoverable_revenue_inr": 201064.4,
      "potential_max_revenue_inr": 2312832.88,
      "dominant_problem_department": "Electrical and power",
      "primary_action_owner": "Chief Electrical Engineer",
      "urgency": "CRITICAL"
    },
    "repeating_problems": [
      {
        "sector": "Electrical and power",
        "alert_type": "PERSISTENT_CHRONIC",
        "headline": "Top revenue loss cause today and month to date",
        "detail": "Grid voltage instability at 17:37-18:47 caused 4 synchronous trips affecting 42 looms.",
        "urgency": "CRITICAL"
      },
      {
        "sector": "Mechanical maintenance",
        "alert_type": "IMPROVING_TREND",
        "headline": "Mechanical downtime improving vs last week",
        "detail": "MTTR dropped from 28 min to 22 min following preventive overhaul on Tsudakoma airjets.",
        "urgency": "HEALTHY"
      },
      {
        "sector": "Quality and seconds",
        "alert_type": "ACCELERATING_DEFECTS",
        "headline": "Quality loss is small today but increasing MTD",
        "detail": "Warp float defect rate increased +12% over trailing 14 days, primarily on high-crimp sorts.",
        "urgency": "WARNING"
      },
      {
        "sector": "Workforce allocation",
        "alert_type": "INDIRECT_DRIVER",
        "headline": "Workforce allocation explains 34% of efficiency loss",
        "detail": "Grade 1 trainee weavers allocated to 8 looms instead of 4-loom skill norm.",
        "urgency": "WARNING"
      }
    ],
    "business_intelligence": {
      "highest_revenue_style": {
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "revenue_inr": 1883721.12,
        "metres": 47093.028
      },
      "lowest_revenue_style": {
        "style_code": "60s Excel X 40s Vortex /165X110-133\" 4/1 Satin",
        "revenue_inr": 3915.04,
        "metres": 97.876
      },
      "best_recovery_opportunity": {
        "title": "Recalibrate Sub-panel 4 Transformer",
        "recovery_inr": 201064.4,
        "department": "Electrical and power"
      },
      "biggest_recurring_problem": {
        "title": "Grid Voltage Fluctuations",
        "department": "Electrical and power",
        "frequency": "4 occurrences on 14/08, recurring 3 times this week"
      },
      "most_problem_count_department": {
        "department": "Mechanical maintenance",
        "event_count": 18,
        "loss_inr": 58933.2
      },
      "highest_rupee_loss_department": {
        "department": "Electrical and power",
        "loss_inr": 201064.4,
        "share_pct": 46.5
      },
      "low_count_high_impact_department": {
        "department": "Electrical and power",
        "count": 4,
        "loss_inr": 201064.4,
        "insight": "Only 4 events, yet accounts for 46.5% of total factory revenue lost."
      },
      "revenue_protected_if_top_action_succeeds": 201064.4,
      "month_end_target_risk_inr": 145000.0,
      "loss_per_metre_inr": 6.49,
      "loss_per_hour_inr": 13453.42
    },
    "evidence_items": [
      {
        "source": "Energy log",
        "finding": "4 voltage dips at evening peak",
        "action": "Panel inspection"
      },
      {
        "source": "Stop events",
        "finding": "Inverter trips across loom group",
        "action": "Drive check"
      },
      {
        "source": "Production log",
        "finding": "5,026 metres capacity loss",
        "action": "Monitor output"
      }
    ],
    "provenance": {
      "revenue": "AVAILABLE / ERP RATE CARD",
      "profitability": "CALCULATED WITH COST GATING",
      "loss_waterfall": "CALCULATED (MUTUALLY EXCLUSIVE)",
      "rate_card": "ESTIMATED (PLACEHOLDER RATE)"
    }
  },
  "revenueAnalytics30D": {
    "work_date": "2026-07-31",
    "unit_code": "ATM",
    "selected_period": "LAST_30D",
    "today_total_revenue_inr": 1989950.88,
    "month_to_date_revenue_inr": 59620190.88,
    "period_total_revenue_inr": 1989950.88,
    "potential_max_revenue_inr": 2312832.88,
    "total_revenue_loss_inr": 322882.0,
    "recoverable_revenue_inr": 201064.4,
    "style_revenues": [
      {
        "style_id": 1,
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "metres_produced": 47093.028,
        "rate_per_metre": 40.0,
        "revenue_inr": 1883721.12,
        "active_looms": 166
      },
      {
        "style_id": 5,
        "style_code": "12s VSF Slub X 12s VSF Slub /56X44-63\" Plain",
        "metres_produced": 1160.733,
        "rate_per_metre": 40.0,
        "revenue_inr": 46429.32,
        "active_looms": 11
      },
      {
        "style_id": 2,
        "style_code": "30s VSF X 30s VOT /68X57-48\" Plain",
        "metres_produced": 615.935,
        "rate_per_metre": 40.0,
        "revenue_inr": 24637.4,
        "active_looms": 7
      },
      {
        "style_id": 3,
        "style_code": "30s VSF Slub X 30s VSF Slub /90X68-63\" Plain",
        "metres_produced": 427.929,
        "rate_per_metre": 40.0,
        "revenue_inr": 17117.16,
        "active_looms": 6
      },
      {
        "style_id": 10,
        "style_code": "20s OE X 21s Cotton Flax /56X44-63\" Plain",
        "metres_produced": 353.271,
        "rate_per_metre": 40.0,
        "revenue_inr": 14130.84,
        "active_looms": 1
      },
      {
        "style_id": 8,
        "style_code": "60s Excel X 40s Vortex /165X110-133\" 4/1 Satin",
        "metres_produced": 97.876,
        "rate_per_metre": 40.0,
        "revenue_inr": 3915.04,
        "active_looms": 1
      }
    ],
    "profitability": {
      "is_cost_data_available": true,
      "net_revenue_inr": 1989950.88,
      "yarn_cost_inr": 1034774.46,
      "power_energy_cost_inr": 218894.6,
      "direct_labour_cost_inr": 85000.0,
      "maintenance_spares_inr": 14500.0,
      "total_direct_costs_inr": 1353169.06,
      "contribution_profit_inr": 636781.82,
      "profit_margin_pct": 32.0
    },
    "loss_attribution_waterfall": {
      "potential_max_revenue": 2312832.88,
      "realized_revenue": 1989950.88,
      "realized_metres": 49748.772,
      "waterfall_components": [
        {
          "category": "Mechanical / Mechanical Breakdowns",
          "lost_metres": 1473.33,
          "lost_revenue_inr": 58933.2,
          "share_pct": 2.5,
          "provenance": "CALCULATED"
        },
        {
          "category": "Electrical & Grid Fluctuation",
          "lost_metres": 5026.61,
          "lost_revenue_inr": 201064.4,
          "share_pct": 8.7,
          "provenance": "CALCULATED"
        },
        {
          "category": "Speed / Running Efficiency Gap",
          "lost_metres": 1484.39,
          "lost_revenue_inr": 59375.6,
          "share_pct": 2.6,
          "provenance": "CALCULATED"
        },
        {
          "category": "Quality Defects & Downgrade",
          "lost_metres": 233.92,
          "lost_revenue_inr": 3508.8,
          "share_pct": 0.2,
          "provenance": "ESTIMATED"
        }
      ],
      "total_revenue_loss_inr": 322882.0
    },
    "period_summary": [
      {
        "label": "Today",
        "period_code": "TODAY",
        "start_date": "2026-07-31",
        "end_date": "2026-07-31",
        "metres": 49748.772,
        "revenue_inr": 1989950.88,
        "loss_inr": 322882.0,
        "potential_revenue_inr": 2312832.88,
        "dominant_reason": "Electrical & Grid Fluctuation",
        "dominant_reason_loss_inr": 201064.4,
        "records_analyzed": 576
      },
      {
        "label": "Last 7 days",
        "period_code": "SEVEN_DAYS",
        "start_date": "2026-07-25",
        "end_date": "2026-07-31",
        "metres": 333135.972,
        "revenue_inr": 13325438.88,
        "loss_inr": 2206902.45,
        "potential_revenue_inr": 15532341.33,
        "dominant_reason": "Electrical & Grid Fluctuation",
        "dominant_reason_loss_inr": 1365384.8,
        "records_analyzed": 4032
      },
      {
        "label": "Month to date",
        "period_code": "MONTH_TO_DATE",
        "start_date": "2026-07-01",
        "end_date": "2026-07-31",
        "metres": 1490504.772,
        "revenue_inr": 59620190.88,
        "loss_inr": 9830550.85,
        "potential_revenue_inr": 69450741.73,
        "dominant_reason": "Electrical & Grid Fluctuation",
        "dominant_reason_loss_inr": 6052960.8,
        "records_analyzed": 17856
      },
      {
        "label": "Year to date",
        "period_code": "YEAR_TO_DATE",
        "start_date": "2026-01-01",
        "end_date": "2026-07-31",
        "metres": 1490504.772,
        "revenue_inr": 59620190.88,
        "loss_inr": 9830550.85,
        "potential_revenue_inr": 69450741.73,
        "dominant_reason": "Electrical & Grid Fluctuation",
        "dominant_reason_loss_inr": 6052960.8,
        "records_analyzed": 17856
      }
    ],
    "daily_trend": [
      {
        "date": "2026-07-18",
        "day_label": "18 Jul",
        "revenue_inr": 1862932.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 217068.0,
        "efficiency_pct": 86.5,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 75973.8,
        "electrical_loss_inr": 97680.6,
        "efficiency_loss_inr": 54267.0,
        "quality_loss_inr": 17365.44
      },
      {
        "date": "2026-07-19",
        "day_label": "19 Jul",
        "revenue_inr": 1973476.0,
        "potential_revenue_inr": 2091884.56,
        "loss_inr": 118408.56,
        "efficiency_pct": 90.8,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 41443.0,
        "electrical_loss_inr": 53283.85,
        "efficiency_loss_inr": 29602.14,
        "quality_loss_inr": 9472.68
      },
      {
        "date": "2026-07-20",
        "day_label": "20 Jul",
        "revenue_inr": 2068568.0,
        "potential_revenue_inr": 2192682.08,
        "loss_inr": 124114.08,
        "efficiency_pct": 94.6,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 43439.93,
        "electrical_loss_inr": 55851.34,
        "efficiency_loss_inr": 31028.52,
        "quality_loss_inr": 9929.13
      },
      {
        "date": "2026-07-21",
        "day_label": "21 Jul",
        "revenue_inr": 1910764.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 169236.0,
        "efficiency_pct": 88.0,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 59232.6,
        "electrical_loss_inr": 76156.2,
        "efficiency_loss_inr": 42309.0,
        "quality_loss_inr": 13538.88
      },
      {
        "date": "2026-07-22",
        "day_label": "22 Jul",
        "revenue_inr": 1397348.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 682652.0,
        "efficiency_pct": 67.3,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 238928.2,
        "electrical_loss_inr": 307193.4,
        "efficiency_loss_inr": 170663.0,
        "quality_loss_inr": 54612.16
      },
      {
        "date": "2026-07-23",
        "day_label": "23 Jul",
        "revenue_inr": 1865184.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 214816.0,
        "efficiency_pct": 85.9,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 75185.6,
        "electrical_loss_inr": 96667.2,
        "efficiency_loss_inr": 53704.0,
        "quality_loss_inr": 17185.28
      },
      {
        "date": "2026-07-24",
        "day_label": "24 Jul",
        "revenue_inr": 1983992.0,
        "potential_revenue_inr": 2103031.52,
        "loss_inr": 119039.52,
        "efficiency_pct": 91.7,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 41663.83,
        "electrical_loss_inr": 53567.78,
        "efficiency_loss_inr": 29759.88,
        "quality_loss_inr": 9523.16
      },
      {
        "date": "2026-07-25",
        "day_label": "25 Jul",
        "revenue_inr": 2100096.0,
        "potential_revenue_inr": 2226101.76,
        "loss_inr": 126005.76,
        "efficiency_pct": 95.6,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 44102.02,
        "electrical_loss_inr": 56702.59,
        "efficiency_loss_inr": 31501.44,
        "quality_loss_inr": 10080.46
      },
      {
        "date": "2026-07-26",
        "day_label": "26 Jul",
        "revenue_inr": 1559228.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 520772.0,
        "efficiency_pct": 71.5,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 182270.2,
        "electrical_loss_inr": 234347.4,
        "efficiency_loss_inr": 130193.0,
        "quality_loss_inr": 41661.76
      },
      {
        "date": "2026-07-27",
        "day_label": "27 Jul",
        "revenue_inr": 1943692.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 136308.0,
        "efficiency_pct": 89.4,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 47707.8,
        "electrical_loss_inr": 61338.6,
        "efficiency_loss_inr": 34077.0,
        "quality_loss_inr": 10904.64
      },
      {
        "date": "2026-07-28",
        "day_label": "28 Jul",
        "revenue_inr": 1816304.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 263696.0,
        "efficiency_pct": 83.1,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 92293.6,
        "electrical_loss_inr": 118663.2,
        "efficiency_loss_inr": 65924.0,
        "quality_loss_inr": 21095.68
      },
      {
        "date": "2026-07-29",
        "day_label": "29 Jul",
        "revenue_inr": 1896168.0,
        "potential_revenue_inr": 2080000.0,
        "loss_inr": 183832.0,
        "efficiency_pct": 90.3,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 64341.2,
        "electrical_loss_inr": 82724.4,
        "efficiency_loss_inr": 45958.0,
        "quality_loss_inr": 14706.56
      },
      {
        "date": "2026-07-30",
        "day_label": "30 Jul",
        "revenue_inr": 2020000.0,
        "potential_revenue_inr": 2141200.0,
        "loss_inr": 121200.0,
        "efficiency_pct": 91.8,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 42420.0,
        "electrical_loss_inr": 54540.0,
        "efficiency_loss_inr": 30300.0,
        "quality_loss_inr": 9696.0
      },
      {
        "date": "2026-07-31",
        "day_label": "31 Jul",
        "revenue_inr": 1989950.88,
        "potential_revenue_inr": 2109347.93,
        "loss_inr": 119397.05,
        "efficiency_pct": 91.7,
        "is_spike": true,
        "spike_reason": "Scheduled warp knotting batch overrun",
        "dominant_department": "Electrical and power",
        "mechanical_loss_inr": 41788.97,
        "electrical_loss_inr": 53728.67,
        "efficiency_loss_inr": 29849.26,
        "quality_loss_inr": 9551.76
      }
    ],
    "department_sectors": [
      {
        "sector_id": "electrical_power",
        "sector_name": "Electrical and power",
        "loss_inr": 201064.4,
        "affected_metres": 5026.6,
        "problem_count": 4,
        "main_reason": "Grid voltage dips at 17:37-18:47 causing simultaneous loom inverter trips",
        "recommended_action": "Recalibrate transformer tap-changer & inspect Sub-panel 4 capacitor bank.",
        "owner": "Chief Electrical Engineer",
        "urgency": "CRITICAL",
        "trend_status": "WORSENING",
        "is_repeating": true,
        "repeating_note": "Top revenue loss cause today and month to date (4 voltage dips on 14/08).",
        "loss_per_metre": 40.0,
        "loss_per_hour": 8377.68,
        "provenance": "CALCULATED"
      },
      {
        "sector_id": "mechanical_maintenance",
        "sector_name": "Mechanical maintenance",
        "loss_inr": 58933.2,
        "affected_metres": 1473.3,
        "problem_count": 18,
        "main_reason": "Knotting cycle delays and cutter edge wear on high-speed airjets",
        "recommended_action": "Enforce 15-minute knotting standard & replace worn cutters on AJ-118/132.",
        "owner": "Mechanical Maintenance Lead",
        "urgency": "WARNING",
        "trend_status": "IMPROVING",
        "is_repeating": false,
        "repeating_note": "Mechanical MTTR improved from 28 min to 22 min following preventative overhaul.",
        "loss_per_metre": 40.0,
        "loss_per_hour": 2455.55,
        "provenance": "CALCULATED"
      },
      {
        "sector_id": "weaving_efficiency",
        "sector_name": "Weaving efficiency",
        "loss_inr": 59375.6,
        "affected_metres": 1484.4,
        "problem_count": 26,
        "main_reason": "Shift 3 running speed deficit and delayed weaver break attendance",
        "recommended_action": "Rebalance weaver loom allotment and increase night-shift jobber floor patrol.",
        "owner": "Weaving Shift In-Charge",
        "urgency": "WARNING",
        "trend_status": "STABLE",
        "is_repeating": true,
        "repeating_note": "Shift 3 operating below unit speed baseline across 5 of the last 7 days.",
        "loss_per_metre": 40.0,
        "loss_per_hour": 2473.98,
        "provenance": "CALCULATED"
      },
      {
        "sector_id": "quality_seconds",
        "sector_name": "Quality and seconds",
        "loss_inr": 3508.8,
        "affected_metres": 233.9,
        "problem_count": 12,
        "main_reason": "Warp floats and reed mark blemishes downgraded to seconds at \u20b915/m discount",
        "recommended_action": "Audit drop-wire tension & clean reed dents on styles with crimp > 8.5%.",
        "owner": "Quality Assurance Manager",
        "urgency": "WARNING",
        "trend_status": "WORSENING",
        "is_repeating": false,
        "repeating_note": "Small daily loss but defect volume up +12% MTD due to warp floats.",
        "loss_per_metre": 15.0,
        "loss_per_hour": 146.2,
        "provenance": "ESTIMATED"
      },
      {
        "sector_id": "workforce_allocation",
        "sector_name": "Workforce allocation",
        "loss_inr": 18400.0,
        "affected_metres": 460.0,
        "problem_count": 3,
        "main_reason": "Grade 1 trainee weavers allocated to 8-loom blocks exceeding 4-loom standard norm",
        "recommended_action": "Reassign trainees to 4-loom sets and pair with Grade 1+ mentor weavers.",
        "owner": "Weaving Production Superintendent",
        "urgency": "WARNING",
        "trend_status": "STABLE",
        "is_repeating": true,
        "repeating_note": "Workforce allocation explains ~34% of weaving running efficiency loss.",
        "loss_per_metre": 40.0,
        "loss_per_hour": 766.67,
        "provenance": "ESTIMATED"
      },
      {
        "sector_id": "air_compressor",
        "sector_name": "Air and compressor",
        "loss_inr": 3200.0,
        "affected_metres": 80.0,
        "problem_count": 2,
        "main_reason": "Main nozzle pneumatic pressure drop on AJ-118 causing micro-weft sensor stops",
        "recommended_action": "Replace leaking pneumatic coupling & flush manifold drain trap in Shed 2.",
        "owner": "Pneumatics & Utility Supervisor",
        "urgency": "HEALTHY",
        "trend_status": "STABLE",
        "is_repeating": false,
        "repeating_note": "Compressor operating within 32 CFM standard band with low leakage.",
        "loss_per_metre": 40.0,
        "loss_per_hour": 133.33,
        "provenance": "CALCULATED"
      },
      {
        "sector_id": "commercial_rate_card",
        "sector_name": "Commercial rate card and cost trust",
        "loss_inr": 0.0,
        "affected_metres": 0.0,
        "problem_count": 10,
        "main_reason": "\u20b940.00/m placeholder selling price in use; actual ERP contract rates unconfirmed",
        "recommended_action": "Confirm style rate card in Commercial Rate Card panel to unlock 100% audit trust.",
        "owner": "Commercial & Costing Head",
        "urgency": "WARNING",
        "trend_status": "STABLE",
        "is_repeating": false,
        "repeating_note": "Pending management sign-off on 10 fabric style commercial rates.",
        "loss_per_metre": 0.0,
        "loss_per_hour": 0.0,
        "provenance": "ESTIMATED"
      }
    ],
    "owner_summary": {
      "one_sentence_verdict": "Electrical and power is the largest revenue loss today (62.3%). Approve transformer and sub-panel inspection before evening shift to protect \u20b9201,064.",
      "three_key_numbers": [
        {
          "label": "Realized Revenue",
          "value": "\u20b91,989,951",
          "provenance": "CALCULATED"
        },
        {
          "label": "Total Revenue Loss",
          "value": "-\u20b9322,882",
          "provenance": "CALCULATED"
        },
        {
          "label": "Contribution Profit",
          "value": "\u20b9636,782 (32.0%)",
          "provenance": "CALCULATED"
        }
      ],
      "one_biggest_reason": "Grid voltage dips at 17:37-18:47 causing simultaneous loom inverter trips",
      "one_action_to_approve": "Approve transformer & Sub-panel 4 capacitor inspection before evening shift.",
      "one_recovery_amount_inr": 201064.4,
      "overall_trend": "WORSENING",
      "recoverable_revenue_inr": 201064.4,
      "potential_max_revenue_inr": 2312832.88,
      "dominant_problem_department": "Electrical and power",
      "primary_action_owner": "Chief Electrical Engineer",
      "urgency": "CRITICAL"
    },
    "repeating_problems": [
      {
        "sector": "Electrical and power",
        "alert_type": "PERSISTENT_CHRONIC",
        "headline": "Top revenue loss cause today and month to date",
        "detail": "Grid voltage instability at 17:37-18:47 caused 4 synchronous trips affecting 42 looms.",
        "urgency": "CRITICAL"
      },
      {
        "sector": "Mechanical maintenance",
        "alert_type": "IMPROVING_TREND",
        "headline": "Mechanical downtime improving vs last week",
        "detail": "MTTR dropped from 28 min to 22 min following preventive overhaul on Tsudakoma airjets.",
        "urgency": "HEALTHY"
      },
      {
        "sector": "Quality and seconds",
        "alert_type": "ACCELERATING_DEFECTS",
        "headline": "Quality loss is small today but increasing MTD",
        "detail": "Warp float defect rate increased +12% over trailing 14 days, primarily on high-crimp sorts.",
        "urgency": "WARNING"
      },
      {
        "sector": "Workforce allocation",
        "alert_type": "INDIRECT_DRIVER",
        "headline": "Workforce allocation explains 34% of efficiency loss",
        "detail": "Grade 1 trainee weavers allocated to 8 looms instead of 4-loom skill norm.",
        "urgency": "WARNING"
      }
    ],
    "business_intelligence": {
      "highest_revenue_style": {
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "revenue_inr": 1883721.12,
        "metres": 47093.028
      },
      "lowest_revenue_style": {
        "style_code": "60s Excel X 40s Vortex /165X110-133\" 4/1 Satin",
        "revenue_inr": 3915.04,
        "metres": 97.876
      },
      "best_recovery_opportunity": {
        "title": "Recalibrate Sub-panel 4 Transformer",
        "recovery_inr": 201064.4,
        "department": "Electrical and power"
      },
      "biggest_recurring_problem": {
        "title": "Grid Voltage Fluctuations",
        "department": "Electrical and power",
        "frequency": "4 occurrences on 14/08, recurring 3 times this week"
      },
      "most_problem_count_department": {
        "department": "Mechanical maintenance",
        "event_count": 18,
        "loss_inr": 58933.2
      },
      "highest_rupee_loss_department": {
        "department": "Electrical and power",
        "loss_inr": 201064.4,
        "share_pct": 46.5
      },
      "low_count_high_impact_department": {
        "department": "Electrical and power",
        "count": 4,
        "loss_inr": 201064.4,
        "insight": "Only 4 events, yet accounts for 46.5% of total factory revenue lost."
      },
      "revenue_protected_if_top_action_succeeds": 201064.4,
      "month_end_target_risk_inr": 145000.0,
      "loss_per_metre_inr": 6.49,
      "loss_per_hour_inr": 13453.42
    },
    "evidence_items": [
      {
        "source": "Energy log",
        "finding": "4 voltage dips at evening peak",
        "action": "Panel inspection"
      },
      {
        "source": "Stop events",
        "finding": "Inverter trips across loom group",
        "action": "Drive check"
      },
      {
        "source": "Production log",
        "finding": "5,026 metres capacity loss",
        "action": "Monitor output"
      }
    ],
    "provenance": {
      "revenue": "AVAILABLE / ERP RATE CARD",
      "profitability": "CALCULATED WITH COST GATING",
      "loss_waterfall": "CALCULATED (MUTUALLY EXCLUSIVE)",
      "rate_card": "ESTIMATED (PLACEHOLDER RATE)"
    }
  },
  "rootCauseDetails": {
    "23693": {
      "found": true,
      "event": {
        "stop_event_id": 23693,
        "loom_id": 132,
        "loom_no": "AJ-132",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "work_date": "2026-07-31",
        "shift_id": 3,
        "shift_code": "3",
        "raised_at": "2026-07-31T03:48:00",
        "resolved_at": "2026-07-31T04:11:00",
        "duration_minutes": 23.0,
        "status": "RESOLVED",
        "reason_code": "NO_WEAVER",
        "reason_label_en": "No weaver (absenteeism)",
        "reason_category": "ReasonCategory.MANPOWER",
        "event_class": "OPERATOR_STOP",
        "classification_confidence": 0.95,
        "raw_remark": null,
        "failed_component": null,
        "fix_action": null,
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "efficiency_pct": 75.8
      },
      "timeline": [
        {
          "time": "03:30",
          "status": "NORMAL",
          "label": "Stable Production",
          "detail": "Operating at 650 RPM nominal speed.",
          "type": "NORMAL"
        },
        {
          "time": "00:00",
          "status": "EARLIER_STOP",
          "label": "Electrical breakdown",
          "detail": "Prior stoppage (73.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "00:05",
          "status": "EARLIER_STOP",
          "label": "Electrical breakdown",
          "detail": "Prior stoppage (78.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "00:09",
          "status": "EARLIER_STOP",
          "label": "Voltage fluctuation",
          "detail": "Prior stoppage (101.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "01:50",
          "status": "EARLIER_STOP",
          "label": "Mechanical breakdown",
          "detail": "Prior stoppage (80.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "01:51",
          "status": "EARLIER_STOP",
          "label": "Electrical breakdown",
          "detail": "Prior stoppage (30.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "02:24",
          "status": "EARLIER_STOP",
          "label": "Voltage fluctuation",
          "detail": "Prior stoppage (63.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "03:48",
          "status": "PRIMARY_BREAKDOWN",
          "label": "Machine Stopped (No weaver (absenteeism))",
          "detail": "Operator Stop - Stoppage logged by sensor/supervisor.",
          "type": "CRITICAL"
        },
        {
          "time": "04:07",
          "status": "ATTENDING",
          "label": "Technician Attending",
          "detail": "Operator / Technician arrived on site (Maintenance).",
          "type": "INFO"
        },
        {
          "time": "04:11",
          "status": "RECOVERY",
          "label": "Machine Restarted",
          "detail": "Stop cleared after 23.0 min. Action: Reset/Adjustment.",
          "type": "SUCCESS"
        }
      ],
      "baseline_comparison": {
        "current_duration_min": 23.0,
        "expected_duration_min": 56.2,
        "duration_ratio": 0.4,
        "history_30d_stops_count": 10,
        "comparison_verdict": "Within normal baseline tolerance"
      },
      "evidence_chain": [
        {
          "tier": "OBSERVED",
          "title": "Stop Duration: 23.0 minutes",
          "evidence": "Logged from 03:48 to 04:11 on Loom AJ-132.",
          "strength": "GROUND_TRUTH"
        },
        {
          "tier": "OBSERVED",
          "title": "Shift Counters: 31 Weft / 18 Warp Breaks",
          "evidence": "Production log records accumulated break counter on active Style 30s VSF X 30s VSF /66X55&43&57-63\" Plain.",
          "strength": "GROUND_TRUTH"
        },
        {
          "tier": "INFERRED",
          "title": "Process / Material Tension Interaction",
          "evidence": "Stoppage frequency elevated on 30s VSF X 30s VSF /66X55&43&57-63\" Plain compared to peer shed average.",
          "strength": "MEDIUM"
        },
        {
          "tier": "PREDICTED",
          "title": "Risk of Secondary Cascade",
          "evidence": "If unaddressed during next beam run, expected recurrence probability is 85% on Shift 3.",
          "strength": "MODEL_INFERRED"
        }
      ],
      "contributing_factors": [
        {
          "factor": "Dominant Failure: No weaver (absenteeism)",
          "evidence_strength": "HIGH",
          "source": "PLC Stop Event Logbook",
          "detail": "23.0 min downtime attributed directly to reason code NO_WEAVER."
        },
        {
          "factor": "Loom Chronic Susceptibility (10 occurrences in 30d)",
          "evidence_strength": "HIGH",
          "source": "30-Day Historical Event Registry",
          "detail": "Machine has accumulated recurring stops in the same category over trailing 30 days."
        },
        {
          "factor": "Active Yarn Style: 30s VSF X 30s VSF /66X55&43&57-63\" Plain",
          "evidence_strength": "MEDIUM",
          "source": "ERP Style Master & Beam Run",
          "detail": "Running at 650 RPM (2165 picks/m)."
        },
        {
          "factor": "Shift Operator Attendance Time",
          "evidence_strength": "LOW",
          "source": "Shift Attendance / Event Lifecycle",
          "detail": "Time to attend: 19.0 min."
        }
      ],
      "business_impact": {
        "lost_meters": 6.9,
        "revenue_exposure": 276.0,
        "revenue_per_metre": 40.0,
        "rate_source": "CONFIRMED",
        "rate_missing_reason": null
      },
      "recommendation": {
        "action_title": "Investigate Loom AJ-132 Reasoncategory.Manpower Drive",
        "recommended_step": "Review yarn guide path and weft tensioner settings with Shift 3 on Loom AJ-132.",
        "why_this_step": "Stoppage frequency (31 breaks logged) correlates with yarn tension instability on 30s VSF X 30s VSF /66X55&43&57-63\" Plain.",
        "supporting_evidence": "10 occurrences in 30 days; 23.0 min outage."
      }
    },
    "23169": {
      "found": true,
      "event": {
        "stop_event_id": 23169,
        "loom_id": 118,
        "loom_no": "AJ-118",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "work_date": "2026-07-31",
        "shift_id": 1,
        "shift_code": "1",
        "raised_at": "2026-07-31T03:05:00",
        "resolved_at": "2026-07-31T03:38:00",
        "duration_minutes": 33.0,
        "status": "RESOLVED",
        "reason_code": "GAITING",
        "reason_label_en": "Gaiting",
        "reason_category": "ReasonCategory.PLANNED",
        "event_class": "PLANNED_MAINTENANCE",
        "classification_confidence": 0.95,
        "raw_remark": null,
        "failed_component": null,
        "fix_action": null,
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "efficiency_pct": 75.4
      },
      "timeline": [
        {
          "time": "02:47",
          "status": "NORMAL",
          "label": "Stable Production",
          "detail": "Operating at 650 RPM nominal speed.",
          "type": "NORMAL"
        },
        {
          "time": "00:06",
          "status": "EARLIER_STOP",
          "label": "Power failure",
          "detail": "Prior stoppage (30.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "00:09",
          "status": "EARLIER_STOP",
          "label": "Power failure",
          "detail": "Prior stoppage (71.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "00:13",
          "status": "EARLIER_STOP",
          "label": "Power failure",
          "detail": "Prior stoppage (62.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "01:11",
          "status": "EARLIER_STOP",
          "label": "Power failure",
          "detail": "Prior stoppage (87.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "01:16",
          "status": "EARLIER_STOP",
          "label": "Sort/beam change",
          "detail": "Prior stoppage (32.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "01:20",
          "status": "EARLIER_STOP",
          "label": "Voltage fluctuation",
          "detail": "Prior stoppage (37.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "02:26",
          "status": "EARLIER_STOP",
          "label": "Power failure",
          "detail": "Prior stoppage (45.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "02:27",
          "status": "EARLIER_STOP",
          "label": "Electrical breakdown",
          "detail": "Prior stoppage (60.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "02:30",
          "status": "EARLIER_STOP",
          "label": "Air pressure low",
          "detail": "Prior stoppage (52.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "03:05",
          "status": "PRIMARY_BREAKDOWN",
          "label": "Machine Stopped (Gaiting)",
          "detail": "Planned Maintenance - Stoppage logged by sensor/supervisor.",
          "type": "CRITICAL"
        },
        {
          "time": "03:28",
          "status": "ATTENDING",
          "label": "Technician Attending",
          "detail": "Operator / Technician arrived on site (Maintenance).",
          "type": "INFO"
        },
        {
          "time": "03:38",
          "status": "RECOVERY",
          "label": "Machine Restarted",
          "detail": "Stop cleared after 33.0 min. Action: Reset/Adjustment.",
          "type": "SUCCESS"
        }
      ],
      "baseline_comparison": {
        "current_duration_min": 33.0,
        "expected_duration_min": 47.4,
        "duration_ratio": 0.7,
        "history_30d_stops_count": 5,
        "comparison_verdict": "Within normal baseline tolerance"
      },
      "evidence_chain": [
        {
          "tier": "OBSERVED",
          "title": "Stop Duration: 33.0 minutes",
          "evidence": "Logged from 03:05 to 03:38 on Loom AJ-118.",
          "strength": "GROUND_TRUTH"
        },
        {
          "tier": "OBSERVED",
          "title": "Shift Counters: 28 Weft / 17 Warp Breaks",
          "evidence": "Production log records accumulated break counter on active Style 30s VSF X 30s VSF /66X55&43&57-63\" Plain.",
          "strength": "GROUND_TRUTH"
        },
        {
          "tier": "INFERRED",
          "title": "Process / Material Tension Interaction",
          "evidence": "Stoppage frequency elevated on 30s VSF X 30s VSF /66X55&43&57-63\" Plain compared to peer shed average.",
          "strength": "MEDIUM"
        },
        {
          "tier": "PREDICTED",
          "title": "Risk of Secondary Cascade",
          "evidence": "If unaddressed during next beam run, expected recurrence probability is 75% on Shift 3.",
          "strength": "MODEL_INFERRED"
        }
      ],
      "contributing_factors": [
        {
          "factor": "Dominant Failure: Gaiting",
          "evidence_strength": "HIGH",
          "source": "PLC Stop Event Logbook",
          "detail": "33.0 min downtime attributed directly to reason code GAITING."
        },
        {
          "factor": "Loom Chronic Susceptibility (5 occurrences in 30d)",
          "evidence_strength": "HIGH",
          "source": "30-Day Historical Event Registry",
          "detail": "Machine has accumulated recurring stops in the same category over trailing 30 days."
        },
        {
          "factor": "Active Yarn Style: 30s VSF X 30s VSF /66X55&43&57-63\" Plain",
          "evidence_strength": "MEDIUM",
          "source": "ERP Style Master & Beam Run",
          "detail": "Running at 650 RPM (2165 picks/m)."
        },
        {
          "factor": "Shift Operator Attendance Time",
          "evidence_strength": "LOW",
          "source": "Shift Attendance / Event Lifecycle",
          "detail": "Time to attend: 23.0 min."
        }
      ],
      "business_impact": {
        "lost_meters": 9.9,
        "revenue_exposure": 396.0,
        "revenue_per_metre": 40.0,
        "rate_source": "CONFIRMED",
        "rate_missing_reason": null
      },
      "recommendation": {
        "action_title": "Investigate Loom AJ-118 Reasoncategory.Planned Drive",
        "recommended_step": "Review yarn guide path and weft tensioner settings with Shift 1 on Loom AJ-118.",
        "why_this_step": "Stoppage frequency (28 breaks logged) correlates with yarn tension instability on 30s VSF X 30s VSF /66X55&43&57-63\" Plain.",
        "supporting_evidence": "5 occurrences in 30 days; 33.0 min outage."
      }
    },
    "23505": {
      "found": true,
      "event": {
        "stop_event_id": 23505,
        "loom_id": 3,
        "loom_no": "AJ-003",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "work_date": "2026-07-31",
        "shift_id": 3,
        "shift_code": "3",
        "raised_at": "2026-07-31T03:03:00",
        "resolved_at": "2026-07-31T03:48:00",
        "duration_minutes": 45.0,
        "status": "RESOLVED",
        "reason_code": "AIR_PRESSURE_LOW",
        "reason_label_en": "Air pressure low",
        "reason_category": "ReasonCategory.UTILITY",
        "event_class": "UTILITY_STOP",
        "classification_confidence": 0.95,
        "raw_remark": null,
        "failed_component": null,
        "fix_action": null,
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "efficiency_pct": 76.0
      },
      "timeline": [
        {
          "time": "02:45",
          "status": "NORMAL",
          "label": "Stable Production",
          "detail": "Operating at 650 RPM nominal speed.",
          "type": "NORMAL"
        },
        {
          "time": "00:01",
          "status": "EARLIER_STOP",
          "label": "Weft feeder fault",
          "detail": "Prior stoppage (55.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "00:14",
          "status": "EARLIER_STOP",
          "label": "Air pressure low",
          "detail": "Prior stoppage (47.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "00:21",
          "status": "EARLIER_STOP",
          "label": "Power failure",
          "detail": "Prior stoppage (49.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "00:57",
          "status": "EARLIER_STOP",
          "label": "Weft feeder fault",
          "detail": "Prior stoppage (99.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "00:59",
          "status": "EARLIER_STOP",
          "label": "Power failure",
          "detail": "Prior stoppage (98.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "01:13",
          "status": "EARLIER_STOP",
          "label": "Power failure",
          "detail": "Prior stoppage (78.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "03:03",
          "status": "PRIMARY_BREAKDOWN",
          "label": "Machine Stopped (Air pressure low)",
          "detail": "Utility Stop - Stoppage logged by sensor/supervisor.",
          "type": "CRITICAL"
        },
        {
          "time": "03:29",
          "status": "ATTENDING",
          "label": "Technician Attending",
          "detail": "Operator / Technician arrived on site (Maintenance).",
          "type": "INFO"
        },
        {
          "time": "03:48",
          "status": "RECOVERY",
          "label": "Machine Restarted",
          "detail": "Stop cleared after 45.0 min. Action: Reset/Adjustment.",
          "type": "SUCCESS"
        }
      ],
      "baseline_comparison": {
        "current_duration_min": 45.0,
        "expected_duration_min": 51.8,
        "duration_ratio": 0.9,
        "history_30d_stops_count": 10,
        "comparison_verdict": "Within normal baseline tolerance"
      },
      "evidence_chain": [
        {
          "tier": "OBSERVED",
          "title": "Stop Duration: 45.0 minutes",
          "evidence": "Logged from 03:03 to 03:48 on Loom AJ-003.",
          "strength": "GROUND_TRUTH"
        },
        {
          "tier": "OBSERVED",
          "title": "Shift Counters: 37 Weft / 17 Warp Breaks",
          "evidence": "Production log records accumulated break counter on active Style 30s VSF X 30s VSF /66X55&43&57-63\" Plain.",
          "strength": "GROUND_TRUTH"
        },
        {
          "tier": "INFERRED",
          "title": "Process / Material Tension Interaction",
          "evidence": "Stoppage frequency elevated on 30s VSF X 30s VSF /66X55&43&57-63\" Plain compared to peer shed average.",
          "strength": "MEDIUM"
        },
        {
          "tier": "PREDICTED",
          "title": "Risk of Secondary Cascade",
          "evidence": "If unaddressed during next beam run, expected recurrence probability is 85% on Shift 3.",
          "strength": "MODEL_INFERRED"
        }
      ],
      "contributing_factors": [
        {
          "factor": "Dominant Failure: Air pressure low",
          "evidence_strength": "HIGH",
          "source": "PLC Stop Event Logbook",
          "detail": "45.0 min downtime attributed directly to reason code AIR_PRESSURE_LOW."
        },
        {
          "factor": "Loom Chronic Susceptibility (10 occurrences in 30d)",
          "evidence_strength": "HIGH",
          "source": "30-Day Historical Event Registry",
          "detail": "Machine has accumulated recurring stops in the same category over trailing 30 days."
        },
        {
          "factor": "Active Yarn Style: 30s VSF X 30s VSF /66X55&43&57-63\" Plain",
          "evidence_strength": "MEDIUM",
          "source": "ERP Style Master & Beam Run",
          "detail": "Running at 650 RPM (2165 picks/m)."
        },
        {
          "factor": "Shift Operator Attendance Time",
          "evidence_strength": "LOW",
          "source": "Shift Attendance / Event Lifecycle",
          "detail": "Time to attend: 26.0 min."
        }
      ],
      "business_impact": {
        "lost_meters": 13.5,
        "revenue_exposure": 540.0,
        "revenue_per_metre": 40.0,
        "rate_source": "CONFIRMED",
        "rate_missing_reason": null
      },
      "recommendation": {
        "action_title": "Investigate Loom AJ-003 Reasoncategory.Utility Drive",
        "recommended_step": "Review yarn guide path and weft tensioner settings with Shift 3 on Loom AJ-003.",
        "why_this_step": "Stoppage frequency (37 breaks logged) correlates with yarn tension instability on 30s VSF X 30s VSF /66X55&43&57-63\" Plain.",
        "supporting_evidence": "10 occurrences in 30 days; 45.0 min outage."
      }
    },
    "23102": {
      "found": true,
      "event": {
        "stop_event_id": 23102,
        "loom_id": 69,
        "loom_no": "AJ-069",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "work_date": "2026-07-31",
        "shift_id": 1,
        "shift_code": "1",
        "raised_at": "2026-07-31T02:49:00",
        "resolved_at": "2026-07-31T03:19:00",
        "duration_minutes": 30.0,
        "status": "RESOLVED",
        "reason_code": "WARP_BREAK",
        "reason_label_en": "Warp break",
        "reason_category": "ReasonCategory.MATERIAL",
        "event_class": "OPERATOR_STOP",
        "classification_confidence": 0.95,
        "raw_remark": null,
        "failed_component": null,
        "fix_action": null,
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "efficiency_pct": 80.4
      },
      "timeline": [
        {
          "time": "02:31",
          "status": "NORMAL",
          "label": "Stable Production",
          "detail": "Operating at 650 RPM nominal speed.",
          "type": "NORMAL"
        },
        {
          "time": "00:07",
          "status": "EARLIER_STOP",
          "label": "Mechanical breakdown",
          "detail": "Prior stoppage (57.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "00:10",
          "status": "EARLIER_STOP",
          "label": "Fabric roll doffing",
          "detail": "Prior stoppage (72.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "00:15",
          "status": "EARLIER_STOP",
          "label": "Electrical breakdown",
          "detail": "Prior stoppage (85.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "01:22",
          "status": "EARLIER_STOP",
          "label": "Electrical breakdown",
          "detail": "Prior stoppage (73.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "01:57",
          "status": "EARLIER_STOP",
          "label": "Mechanical breakdown",
          "detail": "Prior stoppage (38.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "02:49",
          "status": "PRIMARY_BREAKDOWN",
          "label": "Machine Stopped (Warp break)",
          "detail": "Operator Stop - Stoppage logged by sensor/supervisor.",
          "type": "CRITICAL"
        },
        {
          "time": "03:15",
          "status": "ATTENDING",
          "label": "Technician Attending",
          "detail": "Operator / Technician arrived on site (Maintenance).",
          "type": "INFO"
        },
        {
          "time": "03:19",
          "status": "RECOVERY",
          "label": "Machine Restarted",
          "detail": "Stop cleared after 30.0 min. Action: Reset/Adjustment.",
          "type": "SUCCESS"
        }
      ],
      "baseline_comparison": {
        "current_duration_min": 30.0,
        "expected_duration_min": 29.4,
        "duration_ratio": 1.0,
        "history_30d_stops_count": 9,
        "comparison_verdict": "Within normal baseline tolerance"
      },
      "evidence_chain": [
        {
          "tier": "OBSERVED",
          "title": "Stop Duration: 30.0 minutes",
          "evidence": "Logged from 02:49 to 03:19 on Loom AJ-069.",
          "strength": "GROUND_TRUTH"
        },
        {
          "tier": "OBSERVED",
          "title": "Shift Counters: 21 Weft / 9 Warp Breaks",
          "evidence": "Production log records accumulated break counter on active Style 30s VSF X 30s VSF /66X55&43&57-63\" Plain.",
          "strength": "GROUND_TRUTH"
        },
        {
          "tier": "INFERRED",
          "title": "Process / Material Tension Interaction",
          "evidence": "Stoppage frequency elevated on 30s VSF X 30s VSF /66X55&43&57-63\" Plain compared to peer shed average.",
          "strength": "MEDIUM"
        },
        {
          "tier": "PREDICTED",
          "title": "Risk of Secondary Cascade",
          "evidence": "If unaddressed during next beam run, expected recurrence probability is 85% on Shift 3.",
          "strength": "MODEL_INFERRED"
        }
      ],
      "contributing_factors": [
        {
          "factor": "Dominant Failure: Warp break",
          "evidence_strength": "HIGH",
          "source": "PLC Stop Event Logbook",
          "detail": "30.0 min downtime attributed directly to reason code WARP_BREAK."
        },
        {
          "factor": "Loom Chronic Susceptibility (9 occurrences in 30d)",
          "evidence_strength": "HIGH",
          "source": "30-Day Historical Event Registry",
          "detail": "Machine has accumulated recurring stops in the same category over trailing 30 days."
        },
        {
          "factor": "Active Yarn Style: 30s VSF X 30s VSF /66X55&43&57-63\" Plain",
          "evidence_strength": "MEDIUM",
          "source": "ERP Style Master & Beam Run",
          "detail": "Running at 650 RPM (2165 picks/m)."
        },
        {
          "factor": "Shift Operator Attendance Time",
          "evidence_strength": "LOW",
          "source": "Shift Attendance / Event Lifecycle",
          "detail": "Time to attend: 26.0 min."
        }
      ],
      "business_impact": {
        "lost_meters": 9.0,
        "revenue_exposure": 360.0,
        "revenue_per_metre": 40.0,
        "rate_source": "CONFIRMED",
        "rate_missing_reason": null
      },
      "recommendation": {
        "action_title": "Investigate Loom AJ-069 Reasoncategory.Material Drive",
        "recommended_step": "Review yarn guide path and weft tensioner settings with Shift 1 on Loom AJ-069.",
        "why_this_step": "Stoppage frequency (21 breaks logged) correlates with yarn tension instability on 30s VSF X 30s VSF /66X55&43&57-63\" Plain.",
        "supporting_evidence": "9 occurrences in 30 days; 30.0 min outage."
      }
    },
    "23442": {
      "found": true,
      "event": {
        "stop_event_id": 23442,
        "loom_id": 146,
        "loom_no": "AJ-146",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "work_date": "2026-07-31",
        "shift_id": 2,
        "shift_code": "2",
        "raised_at": "2026-07-31T02:48:00",
        "resolved_at": "2026-07-31T03:13:00",
        "duration_minutes": 25.0,
        "status": "RESOLVED",
        "reason_code": "AIR_PRESSURE_LOW",
        "reason_label_en": "Air pressure low",
        "reason_category": "ReasonCategory.UTILITY",
        "event_class": "UTILITY_STOP",
        "classification_confidence": 0.95,
        "raw_remark": null,
        "failed_component": null,
        "fix_action": null,
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "efficiency_pct": 82.5
      },
      "timeline": [
        {
          "time": "02:30",
          "status": "NORMAL",
          "label": "Stable Production",
          "detail": "Operating at 650 RPM nominal speed.",
          "type": "NORMAL"
        },
        {
          "time": "00:03",
          "status": "EARLIER_STOP",
          "label": "Electrical breakdown",
          "detail": "Prior stoppage (105.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "00:15",
          "status": "EARLIER_STOP",
          "label": "Mechanical breakdown",
          "detail": "Prior stoppage (83.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "00:16",
          "status": "EARLIER_STOP",
          "label": "Voltage fluctuation",
          "detail": "Prior stoppage (54.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "01:14",
          "status": "EARLIER_STOP",
          "label": "Power failure",
          "detail": "Prior stoppage (63.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "01:50",
          "status": "EARLIER_STOP",
          "label": "Weft feeder fault",
          "detail": "Prior stoppage (47.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "02:20",
          "status": "EARLIER_STOP",
          "label": "Voltage fluctuation",
          "detail": "Prior stoppage (25.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "02:48",
          "status": "PRIMARY_BREAKDOWN",
          "label": "Machine Stopped (Air pressure low)",
          "detail": "Utility Stop - Stoppage logged by sensor/supervisor.",
          "type": "CRITICAL"
        },
        {
          "time": "03:11",
          "status": "ATTENDING",
          "label": "Technician Attending",
          "detail": "Operator / Technician arrived on site (Maintenance).",
          "type": "INFO"
        },
        {
          "time": "03:13",
          "status": "RECOVERY",
          "label": "Machine Restarted",
          "detail": "Stop cleared after 25.0 min. Action: Reset/Adjustment.",
          "type": "SUCCESS"
        }
      ],
      "baseline_comparison": {
        "current_duration_min": 25.0,
        "expected_duration_min": 53.6,
        "duration_ratio": 0.5,
        "history_30d_stops_count": 10,
        "comparison_verdict": "Within normal baseline tolerance"
      },
      "evidence_chain": [
        {
          "tier": "OBSERVED",
          "title": "Stop Duration: 25.0 minutes",
          "evidence": "Logged from 02:48 to 03:13 on Loom AJ-146.",
          "strength": "GROUND_TRUTH"
        },
        {
          "tier": "OBSERVED",
          "title": "Shift Counters: 26 Weft / 15 Warp Breaks",
          "evidence": "Production log records accumulated break counter on active Style 30s VSF X 30s VSF /66X55&43&57-63\" Plain.",
          "strength": "GROUND_TRUTH"
        },
        {
          "tier": "INFERRED",
          "title": "Process / Material Tension Interaction",
          "evidence": "Stoppage frequency elevated on 30s VSF X 30s VSF /66X55&43&57-63\" Plain compared to peer shed average.",
          "strength": "MEDIUM"
        },
        {
          "tier": "PREDICTED",
          "title": "Risk of Secondary Cascade",
          "evidence": "If unaddressed during next beam run, expected recurrence probability is 85% on Shift 3.",
          "strength": "MODEL_INFERRED"
        }
      ],
      "contributing_factors": [
        {
          "factor": "Dominant Failure: Air pressure low",
          "evidence_strength": "HIGH",
          "source": "PLC Stop Event Logbook",
          "detail": "25.0 min downtime attributed directly to reason code AIR_PRESSURE_LOW."
        },
        {
          "factor": "Loom Chronic Susceptibility (10 occurrences in 30d)",
          "evidence_strength": "HIGH",
          "source": "30-Day Historical Event Registry",
          "detail": "Machine has accumulated recurring stops in the same category over trailing 30 days."
        },
        {
          "factor": "Active Yarn Style: 30s VSF X 30s VSF /66X55&43&57-63\" Plain",
          "evidence_strength": "MEDIUM",
          "source": "ERP Style Master & Beam Run",
          "detail": "Running at 650 RPM (2165 picks/m)."
        },
        {
          "factor": "Shift Operator Attendance Time",
          "evidence_strength": "LOW",
          "source": "Shift Attendance / Event Lifecycle",
          "detail": "Time to attend: 23.0 min."
        }
      ],
      "business_impact": {
        "lost_meters": 7.5,
        "revenue_exposure": 300.0,
        "revenue_per_metre": 40.0,
        "rate_source": "CONFIRMED",
        "rate_missing_reason": null
      },
      "recommendation": {
        "action_title": "Investigate Loom AJ-146 Reasoncategory.Utility Drive",
        "recommended_step": "Review yarn guide path and weft tensioner settings with Shift 2 on Loom AJ-146.",
        "why_this_step": "Stoppage frequency (26 breaks logged) correlates with yarn tension instability on 30s VSF X 30s VSF /66X55&43&57-63\" Plain.",
        "supporting_evidence": "10 occurrences in 30 days; 25.0 min outage."
      }
    },
    "23293": {
      "found": true,
      "event": {
        "stop_event_id": 23293,
        "loom_id": 20,
        "loom_no": "AJ-020",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "work_date": "2026-07-31",
        "shift_id": 2,
        "shift_code": "2",
        "raised_at": "2026-07-31T02:44:00",
        "resolved_at": "2026-07-31T03:37:00",
        "duration_minutes": 53.0,
        "status": "RESOLVED",
        "reason_code": "NO_WEAVER",
        "reason_label_en": "No weaver (absenteeism)",
        "reason_category": "ReasonCategory.MANPOWER",
        "event_class": "OPERATOR_STOP",
        "classification_confidence": 0.95,
        "raw_remark": null,
        "failed_component": null,
        "fix_action": null,
        "style_code": "60s Excel X 40s Vortex /165X110-133\" 4/1 Satin",
        "efficiency_pct": 74.2
      },
      "timeline": [
        {
          "time": "02:26",
          "status": "NORMAL",
          "label": "Stable Production",
          "detail": "Operating at 560 RPM nominal speed.",
          "type": "NORMAL"
        },
        {
          "time": "00:03",
          "status": "EARLIER_STOP",
          "label": "Warp break",
          "detail": "Prior stoppage (32.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "00:05",
          "status": "EARLIER_STOP",
          "label": "Weft feeder fault",
          "detail": "Prior stoppage (133.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "00:24",
          "status": "EARLIER_STOP",
          "label": "Voltage fluctuation",
          "detail": "Prior stoppage (93.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "00:58",
          "status": "EARLIER_STOP",
          "label": "Power failure",
          "detail": "Prior stoppage (70.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "02:10",
          "status": "EARLIER_STOP",
          "label": "Weft break",
          "detail": "Prior stoppage (21.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "02:28",
          "status": "EARLIER_STOP",
          "label": "Air pressure low",
          "detail": "Prior stoppage (26.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "02:44",
          "status": "PRIMARY_BREAKDOWN",
          "label": "Machine Stopped (No weaver (absenteeism))",
          "detail": "Operator Stop - Stoppage logged by sensor/supervisor.",
          "type": "CRITICAL"
        },
        {
          "time": "02:57",
          "status": "ATTENDING",
          "label": "Technician Attending",
          "detail": "Operator / Technician arrived on site (Maintenance).",
          "type": "INFO"
        },
        {
          "time": "03:37",
          "status": "RECOVERY",
          "label": "Machine Restarted",
          "detail": "Stop cleared after 53.0 min. Action: Reset/Adjustment.",
          "type": "SUCCESS"
        }
      ],
      "baseline_comparison": {
        "current_duration_min": 53.0,
        "expected_duration_min": 56.2,
        "duration_ratio": 0.9,
        "history_30d_stops_count": 13,
        "comparison_verdict": "Within normal baseline tolerance"
      },
      "evidence_chain": [
        {
          "tier": "OBSERVED",
          "title": "Stop Duration: 53.0 minutes",
          "evidence": "Logged from 02:44 to 03:37 on Loom AJ-020.",
          "strength": "GROUND_TRUTH"
        },
        {
          "tier": "OBSERVED",
          "title": "Shift Counters: 39 Weft / 13 Warp Breaks",
          "evidence": "Production log records accumulated break counter on active Style 60s Excel X 40s Vortex /165X110-133\" 4/1 Satin.",
          "strength": "GROUND_TRUTH"
        },
        {
          "tier": "INFERRED",
          "title": "Process / Material Tension Interaction",
          "evidence": "Stoppage frequency elevated on 60s Excel X 40s Vortex /165X110-133\" 4/1 Satin compared to peer shed average.",
          "strength": "MEDIUM"
        },
        {
          "tier": "PREDICTED",
          "title": "Risk of Secondary Cascade",
          "evidence": "If unaddressed during next beam run, expected recurrence probability is 85% on Shift 3.",
          "strength": "MODEL_INFERRED"
        }
      ],
      "contributing_factors": [
        {
          "factor": "Dominant Failure: No weaver (absenteeism)",
          "evidence_strength": "HIGH",
          "source": "PLC Stop Event Logbook",
          "detail": "53.0 min downtime attributed directly to reason code NO_WEAVER."
        },
        {
          "factor": "Loom Chronic Susceptibility (13 occurrences in 30d)",
          "evidence_strength": "HIGH",
          "source": "30-Day Historical Event Registry",
          "detail": "Machine has accumulated recurring stops in the same category over trailing 30 days."
        },
        {
          "factor": "Active Yarn Style: 60s Excel X 40s Vortex /165X110-133\" 4/1 Satin",
          "evidence_strength": "MEDIUM",
          "source": "ERP Style Master & Beam Run",
          "detail": "Running at 560 RPM (4331 picks/m)."
        },
        {
          "factor": "Shift Operator Attendance Time",
          "evidence_strength": "LOW",
          "source": "Shift Attendance / Event Lifecycle",
          "detail": "Time to attend: 13.0 min."
        }
      ],
      "business_impact": {
        "lost_meters": 6.9,
        "revenue_exposure": 276.0,
        "revenue_per_metre": 40.0,
        "rate_source": "CONFIRMED",
        "rate_missing_reason": null
      },
      "recommendation": {
        "action_title": "Investigate Loom AJ-020 Reasoncategory.Manpower Drive",
        "recommended_step": "Review yarn guide path and weft tensioner settings with Shift 2 on Loom AJ-020.",
        "why_this_step": "Stoppage frequency (39 breaks logged) correlates with yarn tension instability on 60s Excel X 40s Vortex /165X110-133\" 4/1 Satin.",
        "supporting_evidence": "13 occurrences in 30 days; 53.0 min outage."
      }
    },
    "23755": {
      "found": true,
      "event": {
        "stop_event_id": 23755,
        "loom_id": 177,
        "loom_no": "SZ-009",
        "loom_type_code": "280",
        "shed_code": "SULZER",
        "work_date": "2026-07-31",
        "shift_id": 3,
        "shift_code": "3",
        "raised_at": "2026-07-31T02:43:00",
        "resolved_at": "2026-07-31T03:11:00",
        "duration_minutes": 28.0,
        "status": "RESOLVED",
        "reason_code": "VOLTAGE_FLUCTUATION",
        "reason_label_en": "Voltage fluctuation",
        "reason_category": "ReasonCategory.ELECTRICAL",
        "event_class": "UTILITY_STOP",
        "classification_confidence": 0.95,
        "raw_remark": null,
        "failed_component": null,
        "fix_action": null,
        "style_code": "30s VSF Slub X 30s VSF Slub /90X68-63\" Plain",
        "efficiency_pct": 83.8
      },
      "timeline": [
        {
          "time": "02:25",
          "status": "NORMAL",
          "label": "Stable Production",
          "detail": "Operating at 210 RPM nominal speed.",
          "type": "NORMAL"
        },
        {
          "time": "00:00",
          "status": "EARLIER_STOP",
          "label": "Power failure",
          "detail": "Prior stoppage (35.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "00:02",
          "status": "EARLIER_STOP",
          "label": "Electrical breakdown",
          "detail": "Prior stoppage (69.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "00:27",
          "status": "EARLIER_STOP",
          "label": "Weft break",
          "detail": "Prior stoppage (18.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "00:52",
          "status": "EARLIER_STOP",
          "label": "Weft feeder fault",
          "detail": "Prior stoppage (81.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "01:27",
          "status": "EARLIER_STOP",
          "label": "Weft break",
          "detail": "Prior stoppage (33.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "02:19",
          "status": "EARLIER_STOP",
          "label": "Power failure",
          "detail": "Prior stoppage (37.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "02:43",
          "status": "PRIMARY_BREAKDOWN",
          "label": "Machine Stopped (Voltage fluctuation)",
          "detail": "Utility Stop - Stoppage logged by sensor/supervisor.",
          "type": "CRITICAL"
        },
        {
          "time": "03:10",
          "status": "ATTENDING",
          "label": "Technician Attending",
          "detail": "Operator / Technician arrived on site (Maintenance).",
          "type": "INFO"
        },
        {
          "time": "03:11",
          "status": "RECOVERY",
          "label": "Machine Restarted",
          "detail": "Stop cleared after 28.0 min. Action: Reset/Adjustment.",
          "type": "SUCCESS"
        }
      ],
      "baseline_comparison": {
        "current_duration_min": 28.0,
        "expected_duration_min": 53.4,
        "duration_ratio": 0.5,
        "history_30d_stops_count": 32,
        "comparison_verdict": "Within normal baseline tolerance"
      },
      "evidence_chain": [
        {
          "tier": "OBSERVED",
          "title": "Stop Duration: 28.0 minutes",
          "evidence": "Logged from 02:43 to 03:11 on Loom SZ-009.",
          "strength": "GROUND_TRUTH"
        },
        {
          "tier": "OBSERVED",
          "title": "Shift Counters: 16 Weft / 5 Warp Breaks",
          "evidence": "Production log records accumulated break counter on active Style 30s VSF Slub X 30s VSF Slub /90X68-63\" Plain.",
          "strength": "GROUND_TRUTH"
        },
        {
          "tier": "INFERRED",
          "title": "Process / Material Tension Interaction",
          "evidence": "Stoppage frequency elevated on 30s VSF Slub X 30s VSF Slub /90X68-63\" Plain compared to peer shed average.",
          "strength": "MEDIUM"
        },
        {
          "tier": "PREDICTED",
          "title": "Risk of Secondary Cascade",
          "evidence": "If unaddressed during next beam run, expected recurrence probability is 85% on Shift 3.",
          "strength": "MODEL_INFERRED"
        }
      ],
      "contributing_factors": [
        {
          "factor": "Dominant Failure: Voltage fluctuation",
          "evidence_strength": "HIGH",
          "source": "PLC Stop Event Logbook",
          "detail": "28.0 min downtime attributed directly to reason code VOLTAGE_FLUCTUATION."
        },
        {
          "factor": "Loom Chronic Susceptibility (32 occurrences in 30d)",
          "evidence_strength": "HIGH",
          "source": "30-Day Historical Event Registry",
          "detail": "Machine has accumulated recurring stops in the same category over trailing 30 days."
        },
        {
          "factor": "Active Yarn Style: 30s VSF Slub X 30s VSF Slub /90X68-63\" Plain",
          "evidence_strength": "MEDIUM",
          "source": "ERP Style Master & Beam Run",
          "detail": "Running at 210 RPM (2677 picks/m)."
        },
        {
          "factor": "Shift Operator Attendance Time",
          "evidence_strength": "LOW",
          "source": "Shift Attendance / Event Lifecycle",
          "detail": "Time to attend: 27.0 min."
        }
      ],
      "business_impact": {
        "lost_meters": 2.2,
        "revenue_exposure": 88.0,
        "revenue_per_metre": 40.0,
        "rate_source": "CONFIRMED",
        "rate_missing_reason": null
      },
      "recommendation": {
        "action_title": "Investigate Loom SZ-009 Reasoncategory.Electrical Drive",
        "recommended_step": "Review yarn guide path and weft tensioner settings with Shift 3 on Loom SZ-009.",
        "why_this_step": "Stoppage frequency (16 breaks logged) correlates with yarn tension instability on 30s VSF Slub X 30s VSF Slub /90X68-63\" Plain.",
        "supporting_evidence": "32 occurrences in 30 days; 28.0 min outage."
      }
    },
    "23610": {
      "found": true,
      "event": {
        "stop_event_id": 23610,
        "loom_id": 75,
        "loom_no": "AJ-075",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "work_date": "2026-07-31",
        "shift_id": 3,
        "shift_code": "3",
        "raised_at": "2026-07-31T02:39:00",
        "resolved_at": "2026-07-31T03:02:00",
        "duration_minutes": 23.0,
        "status": "RESOLVED",
        "reason_code": "WEFT_BREAK",
        "reason_label_en": "Weft break",
        "reason_category": "ReasonCategory.MATERIAL",
        "event_class": "OPERATOR_STOP",
        "classification_confidence": 0.95,
        "raw_remark": null,
        "failed_component": null,
        "fix_action": null,
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "efficiency_pct": 82.3
      },
      "timeline": [
        {
          "time": "02:21",
          "status": "NORMAL",
          "label": "Stable Production",
          "detail": "Operating at 650 RPM nominal speed.",
          "type": "NORMAL"
        },
        {
          "time": "00:14",
          "status": "EARLIER_STOP",
          "label": "No weaver (absenteeism)",
          "detail": "Prior stoppage (94.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "00:17",
          "status": "EARLIER_STOP",
          "label": "Electrical breakdown",
          "detail": "Prior stoppage (96.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "00:24",
          "status": "EARLIER_STOP",
          "label": "Power failure",
          "detail": "Prior stoppage (75.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "01:50",
          "status": "EARLIER_STOP",
          "label": "Knotting",
          "detail": "Prior stoppage (40.0 min). ",
          "type": "WARNING"
        },
        {
          "time": "02:39",
          "status": "PRIMARY_BREAKDOWN",
          "label": "Machine Stopped (Weft break)",
          "detail": "Operator Stop - Stoppage logged by sensor/supervisor.",
          "type": "CRITICAL"
        },
        {
          "time": "02:56",
          "status": "ATTENDING",
          "label": "Technician Attending",
          "detail": "Operator / Technician arrived on site (Maintenance).",
          "type": "INFO"
        },
        {
          "time": "03:02",
          "status": "RECOVERY",
          "label": "Machine Restarted",
          "detail": "Stop cleared after 23.0 min. Action: Reset/Adjustment.",
          "type": "SUCCESS"
        }
      ],
      "baseline_comparison": {
        "current_duration_min": 23.0,
        "expected_duration_min": 29.4,
        "duration_ratio": 0.8,
        "history_30d_stops_count": 9,
        "comparison_verdict": "Within normal baseline tolerance"
      },
      "evidence_chain": [
        {
          "tier": "OBSERVED",
          "title": "Stop Duration: 23.0 minutes",
          "evidence": "Logged from 02:39 to 03:02 on Loom AJ-075.",
          "strength": "GROUND_TRUTH"
        },
        {
          "tier": "OBSERVED",
          "title": "Shift Counters: 25 Weft / 16 Warp Breaks",
          "evidence": "Production log records accumulated break counter on active Style 30s VSF X 30s VSF /66X55&43&57-63\" Plain.",
          "strength": "GROUND_TRUTH"
        },
        {
          "tier": "INFERRED",
          "title": "Process / Material Tension Interaction",
          "evidence": "Stoppage frequency elevated on 30s VSF X 30s VSF /66X55&43&57-63\" Plain compared to peer shed average.",
          "strength": "MEDIUM"
        },
        {
          "tier": "PREDICTED",
          "title": "Risk of Secondary Cascade",
          "evidence": "If unaddressed during next beam run, expected recurrence probability is 85% on Shift 3.",
          "strength": "MODEL_INFERRED"
        }
      ],
      "contributing_factors": [
        {
          "factor": "Dominant Failure: Weft break",
          "evidence_strength": "HIGH",
          "source": "PLC Stop Event Logbook",
          "detail": "23.0 min downtime attributed directly to reason code WEFT_BREAK."
        },
        {
          "factor": "Loom Chronic Susceptibility (9 occurrences in 30d)",
          "evidence_strength": "HIGH",
          "source": "30-Day Historical Event Registry",
          "detail": "Machine has accumulated recurring stops in the same category over trailing 30 days."
        },
        {
          "factor": "Active Yarn Style: 30s VSF X 30s VSF /66X55&43&57-63\" Plain",
          "evidence_strength": "MEDIUM",
          "source": "ERP Style Master & Beam Run",
          "detail": "Running at 650 RPM (2165 picks/m)."
        },
        {
          "factor": "Shift Operator Attendance Time",
          "evidence_strength": "LOW",
          "source": "Shift Attendance / Event Lifecycle",
          "detail": "Time to attend: 17.0 min."
        }
      ],
      "business_impact": {
        "lost_meters": 6.9,
        "revenue_exposure": 276.0,
        "revenue_per_metre": 40.0,
        "rate_source": "CONFIRMED",
        "rate_missing_reason": null
      },
      "recommendation": {
        "action_title": "Investigate Loom AJ-075 Reasoncategory.Material Drive",
        "recommended_step": "Review yarn guide path and weft tensioner settings with Shift 3 on Loom AJ-075.",
        "why_this_step": "Stoppage frequency (25 breaks logged) correlates with yarn tension instability on 30s VSF X 30s VSF /66X55&43&57-63\" Plain.",
        "supporting_evidence": "9 occurrences in 30 days; 23.0 min outage."
      }
    }
  },
  "loomDrilldowns": {
    "104": {
      "found": true,
      "loom_id": 104,
      "loom_no": "AJ-104",
      "loom_type": "810",
      "install_date": "2022-03-15",
      "history_30d": [
        {
          "date": "2026-07-02",
          "metres": 278.5,
          "efficiency_pct": 87.9,
          "stopped_minutes": 144,
          "warp_breaks": 16,
          "weft_breaks": 68
        },
        {
          "date": "2026-07-03",
          "metres": 290.9,
          "efficiency_pct": 91.8,
          "stopped_minutes": 66,
          "warp_breaks": 23,
          "weft_breaks": 63
        },
        {
          "date": "2026-07-04",
          "metres": 290.8,
          "efficiency_pct": 91.7,
          "stopped_minutes": 53,
          "warp_breaks": 22,
          "weft_breaks": 49
        },
        {
          "date": "2026-07-05",
          "metres": 282.3,
          "efficiency_pct": 89.0,
          "stopped_minutes": 110,
          "warp_breaks": 20,
          "weft_breaks": 48
        },
        {
          "date": "2026-07-06",
          "metres": 275.7,
          "efficiency_pct": 87.0,
          "stopped_minutes": 169,
          "warp_breaks": 17,
          "weft_breaks": 62
        },
        {
          "date": "2026-07-07",
          "metres": 279.5,
          "efficiency_pct": 88.2,
          "stopped_minutes": 130,
          "warp_breaks": 16,
          "weft_breaks": 53
        },
        {
          "date": "2026-07-08",
          "metres": 297.2,
          "efficiency_pct": 93.8,
          "stopped_minutes": 49,
          "warp_breaks": 21,
          "weft_breaks": 56
        },
        {
          "date": "2026-07-09",
          "metres": 285.4,
          "efficiency_pct": 90.0,
          "stopped_minutes": 109,
          "warp_breaks": 18,
          "weft_breaks": 60
        },
        {
          "date": "2026-07-10",
          "metres": 264.7,
          "efficiency_pct": 83.5,
          "stopped_minutes": 234,
          "warp_breaks": 20,
          "weft_breaks": 62
        },
        {
          "date": "2026-07-11",
          "metres": 290.5,
          "efficiency_pct": 91.6,
          "stopped_minutes": 87,
          "warp_breaks": 21,
          "weft_breaks": 50
        },
        {
          "date": "2026-07-12",
          "metres": 265.7,
          "efficiency_pct": 83.8,
          "stopped_minutes": 200,
          "warp_breaks": 21,
          "weft_breaks": 66
        },
        {
          "date": "2026-07-13",
          "metres": 280.9,
          "efficiency_pct": 88.6,
          "stopped_minutes": 131,
          "warp_breaks": 19,
          "weft_breaks": 56
        },
        {
          "date": "2026-07-14",
          "metres": 279.4,
          "efficiency_pct": 88.1,
          "stopped_minutes": 140,
          "warp_breaks": 22,
          "weft_breaks": 58
        },
        {
          "date": "2026-07-15",
          "metres": 299.9,
          "efficiency_pct": 94.6,
          "stopped_minutes": 42,
          "warp_breaks": 20,
          "weft_breaks": 50
        },
        {
          "date": "2026-07-16",
          "metres": 286.6,
          "efficiency_pct": 90.4,
          "stopped_minutes": 107,
          "warp_breaks": 21,
          "weft_breaks": 59
        },
        {
          "date": "2026-07-17",
          "metres": 287.9,
          "efficiency_pct": 90.8,
          "stopped_minutes": 107,
          "warp_breaks": 18,
          "weft_breaks": 51
        },
        {
          "date": "2026-07-18",
          "metres": 267.8,
          "efficiency_pct": 84.5,
          "stopped_minutes": 164,
          "warp_breaks": 22,
          "weft_breaks": 60
        },
        {
          "date": "2026-07-19",
          "metres": 286.7,
          "efficiency_pct": 90.5,
          "stopped_minutes": 92,
          "warp_breaks": 17,
          "weft_breaks": 65
        },
        {
          "date": "2026-07-20",
          "metres": 303.2,
          "efficiency_pct": 95.7,
          "stopped_minutes": 19,
          "warp_breaks": 11,
          "weft_breaks": 47
        },
        {
          "date": "2026-07-21",
          "metres": 276.6,
          "efficiency_pct": 87.2,
          "stopped_minutes": 160,
          "warp_breaks": 18,
          "weft_breaks": 71
        },
        {
          "date": "2026-07-22",
          "metres": 185.4,
          "efficiency_pct": 58.5,
          "stopped_minutes": 552,
          "warp_breaks": 25,
          "weft_breaks": 211
        },
        {
          "date": "2026-07-23",
          "metres": 268.5,
          "efficiency_pct": 84.7,
          "stopped_minutes": 201,
          "warp_breaks": 29,
          "weft_breaks": 48
        },
        {
          "date": "2026-07-24",
          "metres": 283.7,
          "efficiency_pct": 89.5,
          "stopped_minutes": 124,
          "warp_breaks": 20,
          "weft_breaks": 60
        },
        {
          "date": "2026-07-25",
          "metres": 303.7,
          "efficiency_pct": 95.8,
          "stopped_minutes": 27,
          "warp_breaks": 18,
          "weft_breaks": 38
        },
        {
          "date": "2026-07-26",
          "metres": 228.1,
          "efficiency_pct": 72.0,
          "stopped_minutes": 381,
          "warp_breaks": 19,
          "weft_breaks": 70
        },
        {
          "date": "2026-07-27",
          "metres": 281.6,
          "efficiency_pct": 88.8,
          "stopped_minutes": 135,
          "warp_breaks": 21,
          "weft_breaks": 47
        },
        {
          "date": "2026-07-28",
          "metres": 265.7,
          "efficiency_pct": 83.8,
          "stopped_minutes": 204,
          "warp_breaks": 21,
          "weft_breaks": 58
        },
        {
          "date": "2026-07-29",
          "metres": 278.1,
          "efficiency_pct": 87.7,
          "stopped_minutes": 118,
          "warp_breaks": 26,
          "weft_breaks": 57
        },
        {
          "date": "2026-07-30",
          "metres": 292.3,
          "efficiency_pct": 92.2,
          "stopped_minutes": 96,
          "warp_breaks": 15,
          "weft_breaks": 36
        },
        {
          "date": "2026-07-31",
          "metres": 291.2,
          "efficiency_pct": 91.8,
          "stopped_minutes": 87,
          "warp_breaks": 23,
          "weft_breaks": 50
        }
      ],
      "top_stoppage_causes": [
        {
          "reason": "Power failure",
          "event_count": 27
        },
        {
          "reason": "Voltage fluctuation",
          "event_count": 25
        },
        {
          "reason": "Weft feeder fault",
          "event_count": 11
        },
        {
          "reason": "Electrical breakdown",
          "event_count": 10
        },
        {
          "reason": "No weaver (absenteeism)",
          "event_count": 8
        }
      ],
      "current_status": "ACTIVE"
    },
    "108": {
      "found": true,
      "loom_id": 108,
      "loom_no": "AJ-108",
      "loom_type": "810",
      "install_date": "2022-03-15",
      "history_30d": [
        {
          "date": "2026-07-02",
          "metres": 284.3,
          "efficiency_pct": 89.7,
          "stopped_minutes": 117,
          "warp_breaks": 10,
          "weft_breaks": 55
        },
        {
          "date": "2026-07-03",
          "metres": 292.2,
          "efficiency_pct": 92.2,
          "stopped_minutes": 81,
          "warp_breaks": 20,
          "weft_breaks": 43
        },
        {
          "date": "2026-07-04",
          "metres": 303.3,
          "efficiency_pct": 95.7,
          "stopped_minutes": 8,
          "warp_breaks": 11,
          "weft_breaks": 40
        },
        {
          "date": "2026-07-05",
          "metres": 291.0,
          "efficiency_pct": 91.8,
          "stopped_minutes": 76,
          "warp_breaks": 17,
          "weft_breaks": 48
        },
        {
          "date": "2026-07-06",
          "metres": 284.1,
          "efficiency_pct": 89.6,
          "stopped_minutes": 110,
          "warp_breaks": 16,
          "weft_breaks": 58
        },
        {
          "date": "2026-07-07",
          "metres": 284.6,
          "efficiency_pct": 89.8,
          "stopped_minutes": 110,
          "warp_breaks": 14,
          "weft_breaks": 58
        },
        {
          "date": "2026-07-08",
          "metres": 295.6,
          "efficiency_pct": 93.2,
          "stopped_minutes": 82,
          "warp_breaks": 12,
          "weft_breaks": 38
        },
        {
          "date": "2026-07-09",
          "metres": 291.5,
          "efficiency_pct": 92.0,
          "stopped_minutes": 67,
          "warp_breaks": 11,
          "weft_breaks": 47
        },
        {
          "date": "2026-07-10",
          "metres": 271.8,
          "efficiency_pct": 85.7,
          "stopped_minutes": 196,
          "warp_breaks": 23,
          "weft_breaks": 66
        },
        {
          "date": "2026-07-11",
          "metres": 295.9,
          "efficiency_pct": 93.3,
          "stopped_minutes": 58,
          "warp_breaks": 14,
          "weft_breaks": 49
        },
        {
          "date": "2026-07-12",
          "metres": 267.8,
          "efficiency_pct": 84.5,
          "stopped_minutes": 188,
          "warp_breaks": 16,
          "weft_breaks": 78
        },
        {
          "date": "2026-07-13",
          "metres": 288.6,
          "efficiency_pct": 91.0,
          "stopped_minutes": 89,
          "warp_breaks": 11,
          "weft_breaks": 59
        },
        {
          "date": "2026-07-14",
          "metres": 288.7,
          "efficiency_pct": 91.1,
          "stopped_minutes": 97,
          "warp_breaks": 16,
          "weft_breaks": 48
        },
        {
          "date": "2026-07-15",
          "metres": 302.7,
          "efficiency_pct": 95.5,
          "stopped_minutes": 34,
          "warp_breaks": 6,
          "weft_breaks": 40
        },
        {
          "date": "2026-07-16",
          "metres": 289.9,
          "efficiency_pct": 91.5,
          "stopped_minutes": 96,
          "warp_breaks": 14,
          "weft_breaks": 44
        },
        {
          "date": "2026-07-17",
          "metres": 296.2,
          "efficiency_pct": 93.5,
          "stopped_minutes": 51,
          "warp_breaks": 11,
          "weft_breaks": 52
        },
        {
          "date": "2026-07-18",
          "metres": 275.4,
          "efficiency_pct": 86.9,
          "stopped_minutes": 136,
          "warp_breaks": 34,
          "weft_breaks": 71
        },
        {
          "date": "2026-07-19",
          "metres": 296.3,
          "efficiency_pct": 93.5,
          "stopped_minutes": 65,
          "warp_breaks": 11,
          "weft_breaks": 45
        },
        {
          "date": "2026-07-20",
          "metres": 307.4,
          "efficiency_pct": 97.0,
          "stopped_minutes": 13,
          "warp_breaks": 10,
          "weft_breaks": 44
        },
        {
          "date": "2026-07-21",
          "metres": 284.3,
          "efficiency_pct": 89.7,
          "stopped_minutes": 121,
          "warp_breaks": 17,
          "weft_breaks": 54
        },
        {
          "date": "2026-07-22",
          "metres": 190.1,
          "efficiency_pct": 59.9,
          "stopped_minutes": 516,
          "warp_breaks": 17,
          "weft_breaks": 222
        },
        {
          "date": "2026-07-23",
          "metres": 277.1,
          "efficiency_pct": 87.4,
          "stopped_minutes": 132,
          "warp_breaks": 21,
          "weft_breaks": 52
        },
        {
          "date": "2026-07-24",
          "metres": 297.1,
          "efficiency_pct": 93.7,
          "stopped_minutes": 45,
          "warp_breaks": 9,
          "weft_breaks": 49
        },
        {
          "date": "2026-07-25",
          "metres": 306.7,
          "efficiency_pct": 96.8,
          "stopped_minutes": 21,
          "warp_breaks": 13,
          "weft_breaks": 33
        },
        {
          "date": "2026-07-26",
          "metres": 231.6,
          "efficiency_pct": 73.1,
          "stopped_minutes": 379,
          "warp_breaks": 13,
          "weft_breaks": 61
        },
        {
          "date": "2026-07-27",
          "metres": 288.2,
          "efficiency_pct": 90.9,
          "stopped_minutes": 89,
          "warp_breaks": 21,
          "weft_breaks": 64
        },
        {
          "date": "2026-07-28",
          "metres": 273.7,
          "efficiency_pct": 86.3,
          "stopped_minutes": 164,
          "warp_breaks": 15,
          "weft_breaks": 71
        },
        {
          "date": "2026-07-29",
          "metres": 281.5,
          "efficiency_pct": 88.8,
          "stopped_minutes": 85,
          "warp_breaks": 16,
          "weft_breaks": 65
        },
        {
          "date": "2026-07-30",
          "metres": 298.0,
          "efficiency_pct": 94.1,
          "stopped_minutes": 81,
          "warp_breaks": 12,
          "weft_breaks": 41
        },
        {
          "date": "2026-07-31",
          "metres": 292.3,
          "efficiency_pct": 92.2,
          "stopped_minutes": 59,
          "warp_breaks": 18,
          "weft_breaks": 60
        }
      ],
      "top_stoppage_causes": [
        {
          "reason": "Voltage fluctuation",
          "event_count": 15
        },
        {
          "reason": "Power failure",
          "event_count": 14
        },
        {
          "reason": "Electrical breakdown",
          "event_count": 14
        },
        {
          "reason": "No weaver (absenteeism)",
          "event_count": 13
        },
        {
          "reason": "Weft break",
          "event_count": 10
        }
      ],
      "current_status": "ACTIVE"
    },
    "118": {
      "found": true,
      "loom_id": 118,
      "loom_no": "AJ-118",
      "loom_type": "810",
      "install_date": "2022-03-15",
      "history_30d": [
        {
          "date": "2026-07-02",
          "metres": 235.4,
          "efficiency_pct": 74.3,
          "stopped_minutes": 337,
          "warp_breaks": 52,
          "weft_breaks": 92
        },
        {
          "date": "2026-07-03",
          "metres": 241.3,
          "efficiency_pct": 76.1,
          "stopped_minutes": 313,
          "warp_breaks": 60,
          "weft_breaks": 79
        },
        {
          "date": "2026-07-04",
          "metres": 244.5,
          "efficiency_pct": 77.1,
          "stopped_minutes": 307,
          "warp_breaks": 39,
          "weft_breaks": 74
        },
        {
          "date": "2026-07-05",
          "metres": 234.6,
          "efficiency_pct": 74.0,
          "stopped_minutes": 355,
          "warp_breaks": 64,
          "weft_breaks": 87
        },
        {
          "date": "2026-07-06",
          "metres": 231.7,
          "efficiency_pct": 73.1,
          "stopped_minutes": 358,
          "warp_breaks": 79,
          "weft_breaks": 106
        },
        {
          "date": "2026-07-07",
          "metres": 232.5,
          "efficiency_pct": 73.4,
          "stopped_minutes": 343,
          "warp_breaks": 59,
          "weft_breaks": 90
        },
        {
          "date": "2026-07-08",
          "metres": 239.2,
          "efficiency_pct": 75.4,
          "stopped_minutes": 336,
          "warp_breaks": 52,
          "weft_breaks": 74
        },
        {
          "date": "2026-07-09",
          "metres": 237.6,
          "efficiency_pct": 75.0,
          "stopped_minutes": 334,
          "warp_breaks": 70,
          "weft_breaks": 83
        },
        {
          "date": "2026-07-10",
          "metres": 221.1,
          "efficiency_pct": 69.8,
          "stopped_minutes": 405,
          "warp_breaks": 68,
          "weft_breaks": 100
        },
        {
          "date": "2026-07-11",
          "metres": 246.3,
          "efficiency_pct": 77.7,
          "stopped_minutes": 302,
          "warp_breaks": 59,
          "weft_breaks": 64
        },
        {
          "date": "2026-07-12",
          "metres": 220.4,
          "efficiency_pct": 69.5,
          "stopped_minutes": 427,
          "warp_breaks": 55,
          "weft_breaks": 142
        },
        {
          "date": "2026-07-13",
          "metres": 234.7,
          "efficiency_pct": 74.0,
          "stopped_minutes": 351,
          "warp_breaks": 68,
          "weft_breaks": 121
        },
        {
          "date": "2026-07-14",
          "metres": 236.7,
          "efficiency_pct": 74.7,
          "stopped_minutes": 326,
          "warp_breaks": 63,
          "weft_breaks": 93
        },
        {
          "date": "2026-07-15",
          "metres": 249.3,
          "efficiency_pct": 78.7,
          "stopped_minutes": 266,
          "warp_breaks": 43,
          "weft_breaks": 83
        },
        {
          "date": "2026-07-16",
          "metres": 241.4,
          "efficiency_pct": 76.2,
          "stopped_minutes": 313,
          "warp_breaks": 57,
          "weft_breaks": 97
        },
        {
          "date": "2026-07-17",
          "metres": 246.1,
          "efficiency_pct": 77.7,
          "stopped_minutes": 285,
          "warp_breaks": 54,
          "weft_breaks": 104
        },
        {
          "date": "2026-07-18",
          "metres": 222.0,
          "efficiency_pct": 70.0,
          "stopped_minutes": 383,
          "warp_breaks": 92,
          "weft_breaks": 106
        },
        {
          "date": "2026-07-19",
          "metres": 242.7,
          "efficiency_pct": 76.6,
          "stopped_minutes": 296,
          "warp_breaks": 68,
          "weft_breaks": 90
        },
        {
          "date": "2026-07-20",
          "metres": 249.5,
          "efficiency_pct": 78.7,
          "stopped_minutes": 281,
          "warp_breaks": 50,
          "weft_breaks": 83
        },
        {
          "date": "2026-07-21",
          "metres": 231.8,
          "efficiency_pct": 73.1,
          "stopped_minutes": 376,
          "warp_breaks": 70,
          "weft_breaks": 88
        },
        {
          "date": "2026-07-22",
          "metres": 154.7,
          "efficiency_pct": 48.8,
          "stopped_minutes": 691,
          "warp_breaks": 60,
          "weft_breaks": 340
        },
        {
          "date": "2026-07-23",
          "metres": 226.3,
          "efficiency_pct": 71.4,
          "stopped_minutes": 396,
          "warp_breaks": 53,
          "weft_breaks": 109
        },
        {
          "date": "2026-07-24",
          "metres": 241.9,
          "efficiency_pct": 76.3,
          "stopped_minutes": 312,
          "warp_breaks": 47,
          "weft_breaks": 96
        },
        {
          "date": "2026-07-25",
          "metres": 250.7,
          "efficiency_pct": 79.1,
          "stopped_minutes": 288,
          "warp_breaks": 40,
          "weft_breaks": 59
        },
        {
          "date": "2026-07-26",
          "metres": 188.2,
          "efficiency_pct": 59.4,
          "stopped_minutes": 560,
          "warp_breaks": 48,
          "weft_breaks": 83
        },
        {
          "date": "2026-07-27",
          "metres": 231.6,
          "efficiency_pct": 73.0,
          "stopped_minutes": 366,
          "warp_breaks": 55,
          "weft_breaks": 93
        },
        {
          "date": "2026-07-28",
          "metres": 220.5,
          "efficiency_pct": 69.5,
          "stopped_minutes": 418,
          "warp_breaks": 57,
          "weft_breaks": 110
        },
        {
          "date": "2026-07-29",
          "metres": 229.1,
          "efficiency_pct": 72.3,
          "stopped_minutes": 348,
          "warp_breaks": 70,
          "weft_breaks": 108
        },
        {
          "date": "2026-07-30",
          "metres": 246.3,
          "efficiency_pct": 77.7,
          "stopped_minutes": 305,
          "warp_breaks": 61,
          "weft_breaks": 90
        },
        {
          "date": "2026-07-31",
          "metres": 240.2,
          "efficiency_pct": 75.8,
          "stopped_minutes": 312,
          "warp_breaks": 54,
          "weft_breaks": 92
        }
      ],
      "top_stoppage_causes": [
        {
          "reason": "Power failure",
          "event_count": 39
        },
        {
          "reason": "Voltage fluctuation",
          "event_count": 33
        },
        {
          "reason": "Electrical breakdown",
          "event_count": 24
        },
        {
          "reason": "No weaver (absenteeism)",
          "event_count": 16
        },
        {
          "reason": "Weft feeder fault",
          "event_count": 14
        }
      ],
      "current_status": "CRITICAL"
    },
    "122": {
      "found": true,
      "loom_id": 122,
      "loom_no": "AJ-122",
      "loom_type": "810",
      "install_date": "2022-03-15",
      "history_30d": [
        {
          "date": "2026-07-02",
          "metres": 283.9,
          "efficiency_pct": 89.5,
          "stopped_minutes": 124,
          "warp_breaks": 5,
          "weft_breaks": 57
        },
        {
          "date": "2026-07-03",
          "metres": 290.4,
          "efficiency_pct": 91.6,
          "stopped_minutes": 70,
          "warp_breaks": 19,
          "weft_breaks": 52
        },
        {
          "date": "2026-07-04",
          "metres": 296.4,
          "efficiency_pct": 93.5,
          "stopped_minutes": 57,
          "warp_breaks": 12,
          "weft_breaks": 44
        },
        {
          "date": "2026-07-05",
          "metres": 287.0,
          "efficiency_pct": 90.5,
          "stopped_minutes": 74,
          "warp_breaks": 20,
          "weft_breaks": 52
        },
        {
          "date": "2026-07-06",
          "metres": 277.7,
          "efficiency_pct": 87.6,
          "stopped_minutes": 150,
          "warp_breaks": 18,
          "weft_breaks": 51
        },
        {
          "date": "2026-07-07",
          "metres": 277.0,
          "efficiency_pct": 87.4,
          "stopped_minutes": 136,
          "warp_breaks": 15,
          "weft_breaks": 50
        },
        {
          "date": "2026-07-08",
          "metres": 293.7,
          "efficiency_pct": 92.6,
          "stopped_minutes": 69,
          "warp_breaks": 17,
          "weft_breaks": 44
        },
        {
          "date": "2026-07-09",
          "metres": 284.9,
          "efficiency_pct": 89.9,
          "stopped_minutes": 93,
          "warp_breaks": 14,
          "weft_breaks": 57
        },
        {
          "date": "2026-07-10",
          "metres": 264.2,
          "efficiency_pct": 83.4,
          "stopped_minutes": 225,
          "warp_breaks": 17,
          "weft_breaks": 58
        },
        {
          "date": "2026-07-11",
          "metres": 298.3,
          "efficiency_pct": 94.1,
          "stopped_minutes": 37,
          "warp_breaks": 13,
          "weft_breaks": 41
        },
        {
          "date": "2026-07-12",
          "metres": 263.0,
          "efficiency_pct": 83.0,
          "stopped_minutes": 216,
          "warp_breaks": 19,
          "weft_breaks": 76
        },
        {
          "date": "2026-07-13",
          "metres": 279.7,
          "efficiency_pct": 88.2,
          "stopped_minutes": 148,
          "warp_breaks": 21,
          "weft_breaks": 58
        },
        {
          "date": "2026-07-14",
          "metres": 284.3,
          "efficiency_pct": 89.7,
          "stopped_minutes": 114,
          "warp_breaks": 15,
          "weft_breaks": 45
        },
        {
          "date": "2026-07-15",
          "metres": 303.4,
          "efficiency_pct": 95.7,
          "stopped_minutes": 29,
          "warp_breaks": 9,
          "weft_breaks": 45
        },
        {
          "date": "2026-07-16",
          "metres": 288.4,
          "efficiency_pct": 91.0,
          "stopped_minutes": 116,
          "warp_breaks": 16,
          "weft_breaks": 55
        },
        {
          "date": "2026-07-17",
          "metres": 292.3,
          "efficiency_pct": 92.2,
          "stopped_minutes": 70,
          "warp_breaks": 13,
          "weft_breaks": 55
        },
        {
          "date": "2026-07-18",
          "metres": 267.7,
          "efficiency_pct": 84.5,
          "stopped_minutes": 165,
          "warp_breaks": 23,
          "weft_breaks": 74
        },
        {
          "date": "2026-07-19",
          "metres": 285.9,
          "efficiency_pct": 90.2,
          "stopped_minutes": 125,
          "warp_breaks": 10,
          "weft_breaks": 58
        },
        {
          "date": "2026-07-20",
          "metres": 300.1,
          "efficiency_pct": 94.7,
          "stopped_minutes": 37,
          "warp_breaks": 13,
          "weft_breaks": 39
        },
        {
          "date": "2026-07-21",
          "metres": 277.4,
          "efficiency_pct": 87.5,
          "stopped_minutes": 142,
          "warp_breaks": 12,
          "weft_breaks": 59
        },
        {
          "date": "2026-07-22",
          "metres": 186.4,
          "efficiency_pct": 58.8,
          "stopped_minutes": 547,
          "warp_breaks": 19,
          "weft_breaks": 192
        },
        {
          "date": "2026-07-23",
          "metres": 271.8,
          "efficiency_pct": 85.7,
          "stopped_minutes": 169,
          "warp_breaks": 29,
          "weft_breaks": 63
        },
        {
          "date": "2026-07-24",
          "metres": 288.7,
          "efficiency_pct": 91.1,
          "stopped_minutes": 100,
          "warp_breaks": 14,
          "weft_breaks": 47
        },
        {
          "date": "2026-07-25",
          "metres": 307.8,
          "efficiency_pct": 97.1,
          "stopped_minutes": 19,
          "warp_breaks": 10,
          "weft_breaks": 38
        },
        {
          "date": "2026-07-26",
          "metres": 231.4,
          "efficiency_pct": 73.0,
          "stopped_minutes": 380,
          "warp_breaks": 14,
          "weft_breaks": 29
        },
        {
          "date": "2026-07-27",
          "metres": 281.3,
          "efficiency_pct": 88.7,
          "stopped_minutes": 117,
          "warp_breaks": 12,
          "weft_breaks": 45
        },
        {
          "date": "2026-07-28",
          "metres": 265.1,
          "efficiency_pct": 83.6,
          "stopped_minutes": 216,
          "warp_breaks": 11,
          "weft_breaks": 53
        },
        {
          "date": "2026-07-29",
          "metres": 277.4,
          "efficiency_pct": 87.5,
          "stopped_minutes": 91,
          "warp_breaks": 7,
          "weft_breaks": 87
        },
        {
          "date": "2026-07-30",
          "metres": 292.2,
          "efficiency_pct": 92.2,
          "stopped_minutes": 97,
          "warp_breaks": 11,
          "weft_breaks": 45
        },
        {
          "date": "2026-07-31",
          "metres": 290.6,
          "efficiency_pct": 91.7,
          "stopped_minutes": 78,
          "warp_breaks": 16,
          "weft_breaks": 53
        }
      ],
      "top_stoppage_causes": [
        {
          "reason": "Power failure",
          "event_count": 23
        },
        {
          "reason": "Electrical breakdown",
          "event_count": 23
        },
        {
          "reason": "Voltage fluctuation",
          "event_count": 16
        },
        {
          "reason": "Mechanical breakdown",
          "event_count": 10
        },
        {
          "reason": "Weft feeder fault",
          "event_count": 9
        }
      ],
      "current_status": "ACTIVE"
    },
    "132": {
      "found": true,
      "loom_id": 132,
      "loom_no": "AJ-132",
      "loom_type": "810",
      "install_date": "2022-03-15",
      "history_30d": [
        {
          "date": "2026-07-02",
          "metres": 229.0,
          "efficiency_pct": 72.2,
          "stopped_minutes": 360,
          "warp_breaks": 57,
          "weft_breaks": 88
        },
        {
          "date": "2026-07-03",
          "metres": 238.8,
          "efficiency_pct": 75.3,
          "stopped_minutes": 326,
          "warp_breaks": 51,
          "weft_breaks": 72
        },
        {
          "date": "2026-07-04",
          "metres": 245.2,
          "efficiency_pct": 77.4,
          "stopped_minutes": 304,
          "warp_breaks": 48,
          "weft_breaks": 69
        },
        {
          "date": "2026-07-05",
          "metres": 232.5,
          "efficiency_pct": 73.3,
          "stopped_minutes": 347,
          "warp_breaks": 49,
          "weft_breaks": 84
        },
        {
          "date": "2026-07-06",
          "metres": 227.1,
          "efficiency_pct": 71.6,
          "stopped_minutes": 378,
          "warp_breaks": 64,
          "weft_breaks": 111
        },
        {
          "date": "2026-07-07",
          "metres": 228.8,
          "efficiency_pct": 72.2,
          "stopped_minutes": 383,
          "warp_breaks": 48,
          "weft_breaks": 72
        },
        {
          "date": "2026-07-08",
          "metres": 240.7,
          "efficiency_pct": 75.9,
          "stopped_minutes": 303,
          "warp_breaks": 45,
          "weft_breaks": 79
        },
        {
          "date": "2026-07-09",
          "metres": 235.1,
          "efficiency_pct": 74.2,
          "stopped_minutes": 354,
          "warp_breaks": 55,
          "weft_breaks": 82
        },
        {
          "date": "2026-07-10",
          "metres": 217.6,
          "efficiency_pct": 68.6,
          "stopped_minutes": 427,
          "warp_breaks": 50,
          "weft_breaks": 102
        },
        {
          "date": "2026-07-11",
          "metres": 239.1,
          "efficiency_pct": 75.4,
          "stopped_minutes": 324,
          "warp_breaks": 47,
          "weft_breaks": 79
        },
        {
          "date": "2026-07-12",
          "metres": 219.3,
          "efficiency_pct": 69.2,
          "stopped_minutes": 425,
          "warp_breaks": 55,
          "weft_breaks": 137
        },
        {
          "date": "2026-07-13",
          "metres": 233.0,
          "efficiency_pct": 73.5,
          "stopped_minutes": 345,
          "warp_breaks": 51,
          "weft_breaks": 85
        },
        {
          "date": "2026-07-14",
          "metres": 230.8,
          "efficiency_pct": 72.8,
          "stopped_minutes": 363,
          "warp_breaks": 56,
          "weft_breaks": 70
        },
        {
          "date": "2026-07-15",
          "metres": 245.9,
          "efficiency_pct": 77.6,
          "stopped_minutes": 293,
          "warp_breaks": 37,
          "weft_breaks": 79
        },
        {
          "date": "2026-07-16",
          "metres": 235.2,
          "efficiency_pct": 74.2,
          "stopped_minutes": 335,
          "warp_breaks": 50,
          "weft_breaks": 85
        },
        {
          "date": "2026-07-17",
          "metres": 237.8,
          "efficiency_pct": 75.0,
          "stopped_minutes": 339,
          "warp_breaks": 52,
          "weft_breaks": 77
        },
        {
          "date": "2026-07-18",
          "metres": 220.5,
          "efficiency_pct": 69.6,
          "stopped_minutes": 392,
          "warp_breaks": 115,
          "weft_breaks": 117
        },
        {
          "date": "2026-07-19",
          "metres": 236.6,
          "efficiency_pct": 74.7,
          "stopped_minutes": 327,
          "warp_breaks": 52,
          "weft_breaks": 95
        },
        {
          "date": "2026-07-20",
          "metres": 246.7,
          "efficiency_pct": 77.8,
          "stopped_minutes": 296,
          "warp_breaks": 49,
          "weft_breaks": 72
        },
        {
          "date": "2026-07-21",
          "metres": 230.3,
          "efficiency_pct": 72.6,
          "stopped_minutes": 367,
          "warp_breaks": 55,
          "weft_breaks": 73
        },
        {
          "date": "2026-07-22",
          "metres": 206.1,
          "efficiency_pct": 65.0,
          "stopped_minutes": 483,
          "warp_breaks": 72,
          "weft_breaks": 148
        },
        {
          "date": "2026-07-23",
          "metres": 224.6,
          "efficiency_pct": 70.9,
          "stopped_minutes": 390,
          "warp_breaks": 68,
          "weft_breaks": 72
        },
        {
          "date": "2026-07-24",
          "metres": 236.7,
          "efficiency_pct": 74.7,
          "stopped_minutes": 330,
          "warp_breaks": 50,
          "weft_breaks": 83
        },
        {
          "date": "2026-07-25",
          "metres": 250.5,
          "efficiency_pct": 79.0,
          "stopped_minutes": 272,
          "warp_breaks": 35,
          "weft_breaks": 65
        },
        {
          "date": "2026-07-26",
          "metres": 186.7,
          "efficiency_pct": 58.9,
          "stopped_minutes": 572,
          "warp_breaks": 60,
          "weft_breaks": 77
        },
        {
          "date": "2026-07-27",
          "metres": 233.7,
          "efficiency_pct": 73.7,
          "stopped_minutes": 343,
          "warp_breaks": 40,
          "weft_breaks": 66
        },
        {
          "date": "2026-07-28",
          "metres": 216.2,
          "efficiency_pct": 68.2,
          "stopped_minutes": 433,
          "warp_breaks": 59,
          "weft_breaks": 126
        },
        {
          "date": "2026-07-29",
          "metres": 227.7,
          "efficiency_pct": 71.8,
          "stopped_minutes": 346,
          "warp_breaks": 68,
          "weft_breaks": 109
        },
        {
          "date": "2026-07-30",
          "metres": 240.0,
          "efficiency_pct": 75.7,
          "stopped_minutes": 338,
          "warp_breaks": 42,
          "weft_breaks": 81
        },
        {
          "date": "2026-07-31",
          "metres": 238.0,
          "efficiency_pct": 75.1,
          "stopped_minutes": 328,
          "warp_breaks": 67,
          "weft_breaks": 91
        }
      ],
      "top_stoppage_causes": [
        {
          "reason": "Power failure",
          "event_count": 28
        },
        {
          "reason": "Electrical breakdown",
          "event_count": 27
        },
        {
          "reason": "Voltage fluctuation",
          "event_count": 26
        },
        {
          "reason": "Air pressure low",
          "event_count": 23
        },
        {
          "reason": "Weft feeder fault",
          "event_count": 15
        }
      ],
      "current_status": "CRITICAL"
    },
    "142": {
      "found": true,
      "loom_id": 142,
      "loom_no": "AJ-142",
      "loom_type": "810",
      "install_date": "2022-03-15",
      "history_30d": [
        {
          "date": "2026-07-02",
          "metres": 283.1,
          "efficiency_pct": 89.3,
          "stopped_minutes": 116,
          "warp_breaks": 18,
          "weft_breaks": 51
        },
        {
          "date": "2026-07-03",
          "metres": 289.8,
          "efficiency_pct": 91.4,
          "stopped_minutes": 85,
          "warp_breaks": 23,
          "weft_breaks": 47
        },
        {
          "date": "2026-07-04",
          "metres": 298.0,
          "efficiency_pct": 94.0,
          "stopped_minutes": 63,
          "warp_breaks": 9,
          "weft_breaks": 54
        },
        {
          "date": "2026-07-05",
          "metres": 282.6,
          "efficiency_pct": 89.2,
          "stopped_minutes": 125,
          "warp_breaks": 17,
          "weft_breaks": 53
        },
        {
          "date": "2026-07-06",
          "metres": 278.4,
          "efficiency_pct": 87.8,
          "stopped_minutes": 117,
          "warp_breaks": 24,
          "weft_breaks": 60
        },
        {
          "date": "2026-07-07",
          "metres": 280.1,
          "efficiency_pct": 88.3,
          "stopped_minutes": 146,
          "warp_breaks": 20,
          "weft_breaks": 63
        },
        {
          "date": "2026-07-08",
          "metres": 293.2,
          "efficiency_pct": 92.5,
          "stopped_minutes": 66,
          "warp_breaks": 14,
          "weft_breaks": 52
        },
        {
          "date": "2026-07-09",
          "metres": 285.4,
          "efficiency_pct": 90.0,
          "stopped_minutes": 104,
          "warp_breaks": 20,
          "weft_breaks": 62
        },
        {
          "date": "2026-07-10",
          "metres": 260.3,
          "efficiency_pct": 82.1,
          "stopped_minutes": 235,
          "warp_breaks": 22,
          "weft_breaks": 62
        },
        {
          "date": "2026-07-11",
          "metres": 293.8,
          "efficiency_pct": 92.7,
          "stopped_minutes": 64,
          "warp_breaks": 13,
          "weft_breaks": 50
        },
        {
          "date": "2026-07-12",
          "metres": 265.5,
          "efficiency_pct": 83.7,
          "stopped_minutes": 226,
          "warp_breaks": 25,
          "weft_breaks": 75
        },
        {
          "date": "2026-07-13",
          "metres": 282.5,
          "efficiency_pct": 89.1,
          "stopped_minutes": 124,
          "warp_breaks": 20,
          "weft_breaks": 55
        },
        {
          "date": "2026-07-14",
          "metres": 285.8,
          "efficiency_pct": 90.2,
          "stopped_minutes": 86,
          "warp_breaks": 14,
          "weft_breaks": 65
        },
        {
          "date": "2026-07-15",
          "metres": 303.7,
          "efficiency_pct": 95.8,
          "stopped_minutes": 32,
          "warp_breaks": 13,
          "weft_breaks": 50
        },
        {
          "date": "2026-07-16",
          "metres": 286.4,
          "efficiency_pct": 90.4,
          "stopped_minutes": 85,
          "warp_breaks": 18,
          "weft_breaks": 66
        },
        {
          "date": "2026-07-17",
          "metres": 291.6,
          "efficiency_pct": 92.0,
          "stopped_minutes": 74,
          "warp_breaks": 15,
          "weft_breaks": 59
        },
        {
          "date": "2026-07-18",
          "metres": 270.5,
          "efficiency_pct": 85.3,
          "stopped_minutes": 153,
          "warp_breaks": 31,
          "weft_breaks": 54
        },
        {
          "date": "2026-07-19",
          "metres": 284.3,
          "efficiency_pct": 89.7,
          "stopped_minutes": 97,
          "warp_breaks": 10,
          "weft_breaks": 53
        },
        {
          "date": "2026-07-20",
          "metres": 298.2,
          "efficiency_pct": 94.1,
          "stopped_minutes": 65,
          "warp_breaks": 15,
          "weft_breaks": 50
        },
        {
          "date": "2026-07-21",
          "metres": 279.4,
          "efficiency_pct": 88.1,
          "stopped_minutes": 160,
          "warp_breaks": 22,
          "weft_breaks": 58
        },
        {
          "date": "2026-07-22",
          "metres": 250.1,
          "efficiency_pct": 78.9,
          "stopped_minutes": 269,
          "warp_breaks": 25,
          "weft_breaks": 95
        },
        {
          "date": "2026-07-23",
          "metres": 272.1,
          "efficiency_pct": 85.9,
          "stopped_minutes": 178,
          "warp_breaks": 32,
          "weft_breaks": 82
        },
        {
          "date": "2026-07-24",
          "metres": 290.9,
          "efficiency_pct": 91.8,
          "stopped_minutes": 102,
          "warp_breaks": 15,
          "weft_breaks": 59
        },
        {
          "date": "2026-07-25",
          "metres": 306.9,
          "efficiency_pct": 96.8,
          "stopped_minutes": 23,
          "warp_breaks": 11,
          "weft_breaks": 46
        },
        {
          "date": "2026-07-26",
          "metres": 227.1,
          "efficiency_pct": 71.7,
          "stopped_minutes": 386,
          "warp_breaks": 13,
          "weft_breaks": 54
        },
        {
          "date": "2026-07-27",
          "metres": 283.2,
          "efficiency_pct": 89.3,
          "stopped_minutes": 121,
          "warp_breaks": 14,
          "weft_breaks": 57
        },
        {
          "date": "2026-07-28",
          "metres": 267.5,
          "efficiency_pct": 84.4,
          "stopped_minutes": 203,
          "warp_breaks": 21,
          "weft_breaks": 67
        },
        {
          "date": "2026-07-29",
          "metres": 273.8,
          "efficiency_pct": 86.4,
          "stopped_minutes": 147,
          "warp_breaks": 29,
          "weft_breaks": 72
        },
        {
          "date": "2026-07-30",
          "metres": 290.4,
          "efficiency_pct": 91.6,
          "stopped_minutes": 102,
          "warp_breaks": 21,
          "weft_breaks": 45
        },
        {
          "date": "2026-07-31",
          "metres": 290.4,
          "efficiency_pct": 91.6,
          "stopped_minutes": 80,
          "warp_breaks": 22,
          "weft_breaks": 46
        }
      ],
      "top_stoppage_causes": [
        {
          "reason": "Electrical breakdown",
          "event_count": 21
        },
        {
          "reason": "Voltage fluctuation",
          "event_count": 15
        },
        {
          "reason": "Power failure",
          "event_count": 15
        },
        {
          "reason": "Air pressure low",
          "event_count": 14
        },
        {
          "reason": "Mechanical breakdown",
          "event_count": 9
        }
      ],
      "current_status": "ACTIVE"
    },
    "1": {
      "found": true,
      "loom_id": 1,
      "loom_no": "AJ-001",
      "loom_type": "910",
      "install_date": "2022-03-15",
      "history_30d": [
        {
          "date": "2026-07-02",
          "metres": 287.2,
          "efficiency_pct": 90.6,
          "stopped_minutes": 95,
          "warp_breaks": 24,
          "weft_breaks": 62
        },
        {
          "date": "2026-07-03",
          "metres": 290.7,
          "efficiency_pct": 91.7,
          "stopped_minutes": 62,
          "warp_breaks": 11,
          "weft_breaks": 44
        },
        {
          "date": "2026-07-04",
          "metres": 304.2,
          "efficiency_pct": 96.0,
          "stopped_minutes": 24,
          "warp_breaks": 15,
          "weft_breaks": 44
        },
        {
          "date": "2026-07-05",
          "metres": 289.6,
          "efficiency_pct": 91.3,
          "stopped_minutes": 79,
          "warp_breaks": 22,
          "weft_breaks": 63
        },
        {
          "date": "2026-07-06",
          "metres": 283.2,
          "efficiency_pct": 89.4,
          "stopped_minutes": 122,
          "warp_breaks": 14,
          "weft_breaks": 52
        },
        {
          "date": "2026-07-07",
          "metres": 285.8,
          "efficiency_pct": 90.2,
          "stopped_minutes": 138,
          "warp_breaks": 15,
          "weft_breaks": 52
        },
        {
          "date": "2026-07-08",
          "metres": 300.0,
          "efficiency_pct": 94.6,
          "stopped_minutes": 56,
          "warp_breaks": 12,
          "weft_breaks": 33
        },
        {
          "date": "2026-07-09",
          "metres": 287.5,
          "efficiency_pct": 90.7,
          "stopped_minutes": 90,
          "warp_breaks": 11,
          "weft_breaks": 60
        },
        {
          "date": "2026-07-10",
          "metres": 266.2,
          "efficiency_pct": 84.0,
          "stopped_minutes": 215,
          "warp_breaks": 14,
          "weft_breaks": 62
        },
        {
          "date": "2026-07-11",
          "metres": 302.9,
          "efficiency_pct": 95.6,
          "stopped_minutes": 34,
          "warp_breaks": 16,
          "weft_breaks": 49
        },
        {
          "date": "2026-07-12",
          "metres": 272.1,
          "efficiency_pct": 85.8,
          "stopped_minutes": 194,
          "warp_breaks": 13,
          "weft_breaks": 88
        },
        {
          "date": "2026-07-13",
          "metres": 285.7,
          "efficiency_pct": 90.2,
          "stopped_minutes": 89,
          "warp_breaks": 10,
          "weft_breaks": 61
        },
        {
          "date": "2026-07-14",
          "metres": 290.3,
          "efficiency_pct": 91.6,
          "stopped_minutes": 86,
          "warp_breaks": 20,
          "weft_breaks": 62
        },
        {
          "date": "2026-07-15",
          "metres": 302.8,
          "efficiency_pct": 95.5,
          "stopped_minutes": 42,
          "warp_breaks": 12,
          "weft_breaks": 55
        },
        {
          "date": "2026-07-16",
          "metres": 289.7,
          "efficiency_pct": 91.4,
          "stopped_minutes": 69,
          "warp_breaks": 13,
          "weft_breaks": 57
        },
        {
          "date": "2026-07-17",
          "metres": 297.8,
          "efficiency_pct": 94.0,
          "stopped_minutes": 33,
          "warp_breaks": 16,
          "weft_breaks": 53
        },
        {
          "date": "2026-07-18",
          "metres": 273.9,
          "efficiency_pct": 86.4,
          "stopped_minutes": 131,
          "warp_breaks": 33,
          "weft_breaks": 64
        },
        {
          "date": "2026-07-19",
          "metres": 287.5,
          "efficiency_pct": 90.7,
          "stopped_minutes": 93,
          "warp_breaks": 12,
          "weft_breaks": 52
        },
        {
          "date": "2026-07-20",
          "metres": 308.2,
          "efficiency_pct": 97.2,
          "stopped_minutes": 18,
          "warp_breaks": 10,
          "weft_breaks": 40
        },
        {
          "date": "2026-07-21",
          "metres": 281.6,
          "efficiency_pct": 88.8,
          "stopped_minutes": 100,
          "warp_breaks": 18,
          "weft_breaks": 50
        },
        {
          "date": "2026-07-22",
          "metres": 190.1,
          "efficiency_pct": 60.0,
          "stopped_minutes": 525,
          "warp_breaks": 14,
          "weft_breaks": 186
        },
        {
          "date": "2026-07-23",
          "metres": 276.4,
          "efficiency_pct": 87.2,
          "stopped_minutes": 150,
          "warp_breaks": 14,
          "weft_breaks": 63
        },
        {
          "date": "2026-07-24",
          "metres": 295.3,
          "efficiency_pct": 93.2,
          "stopped_minutes": 53,
          "warp_breaks": 14,
          "weft_breaks": 52
        },
        {
          "date": "2026-07-25",
          "metres": 310.4,
          "efficiency_pct": 97.9,
          "stopped_minutes": 18,
          "warp_breaks": 12,
          "weft_breaks": 35
        },
        {
          "date": "2026-07-26",
          "metres": 231.9,
          "efficiency_pct": 73.2,
          "stopped_minutes": 374,
          "warp_breaks": 15,
          "weft_breaks": 64
        },
        {
          "date": "2026-07-27",
          "metres": 289.8,
          "efficiency_pct": 91.4,
          "stopped_minutes": 89,
          "warp_breaks": 9,
          "weft_breaks": 72
        },
        {
          "date": "2026-07-28",
          "metres": 269.6,
          "efficiency_pct": 85.1,
          "stopped_minutes": 186,
          "warp_breaks": 17,
          "weft_breaks": 52
        },
        {
          "date": "2026-07-29",
          "metres": 281.3,
          "efficiency_pct": 88.7,
          "stopped_minutes": 72,
          "warp_breaks": 16,
          "weft_breaks": 66
        },
        {
          "date": "2026-07-30",
          "metres": 298.7,
          "efficiency_pct": 94.2,
          "stopped_minutes": 60,
          "warp_breaks": 8,
          "weft_breaks": 55
        },
        {
          "date": "2026-07-31",
          "metres": 293.9,
          "efficiency_pct": 92.7,
          "stopped_minutes": 62,
          "warp_breaks": 15,
          "weft_breaks": 46
        }
      ],
      "top_stoppage_causes": [
        {
          "reason": "Voltage fluctuation",
          "event_count": 18
        },
        {
          "reason": "Power failure",
          "event_count": 17
        },
        {
          "reason": "Electrical breakdown",
          "event_count": 13
        },
        {
          "reason": "Weft feeder fault",
          "event_count": 11
        },
        {
          "reason": "No weaver (absenteeism)",
          "event_count": 10
        }
      ],
      "current_status": "ACTIVE"
    }
  },
  "commandCenter": {
    "work_date": "2026-07-31",
    "unit_code": "ATM",
    "plant_name": "Ashok Textile Mills \u2014 Shed 1 & 2 (192 Looms)",
    "data_available": true,
    "view_mode": "OWNER",
    "freshness": {
      "plant_unit": "ATM",
      "overall_health": "LIVE",
      "dqi_score_pct": 97.4,
      "datasets": {
        "production": {
          "status": "LIVE",
          "latency_label": "2 min ago",
          "coverage_pct": 100.0,
          "last_ingested_at": "2026-09-04T16:15:33.716976+00:00",
          "source_type": "MACHINE_CONTROLLER"
        },
        "breakdowns": {
          "status": "LIVE",
          "latency_label": "3 min ago",
          "coverage_pct": 98.5,
          "last_ingested_at": "2026-09-04T16:14:33.716976+00:00",
          "source_type": "PLC_ALARM_FEED"
        },
        "erp_pricing": {
          "status": "UPDATED",
          "latency_label": "4 hrs ago",
          "coverage_pct": 91.0,
          "last_ingested_at": "2026-09-04T12:17:33.716976+00:00",
          "source_type": "SAP_ERP_EXPORT"
        },
        "maintenance": {
          "status": "UPDATED",
          "latency_label": "1 day ago",
          "coverage_pct": 78.0,
          "last_ingested_at": "2026-09-03T16:17:33.716976+00:00",
          "source_type": "CMMS_WORK_ORDERS"
        },
        "quality": {
          "status": "UPDATED",
          "latency_label": "6 hrs ago",
          "coverage_pct": 84.0,
          "last_ingested_at": "2026-09-04T10:17:33.716976+00:00",
          "source_type": "LAB_INSPECTION_SHEET"
        },
        "energy_air": {
          "status": "LIVE",
          "latency_label": "5 min ago",
          "coverage_pct": 95.0,
          "last_ingested_at": "2026-09-04T16:12:33.716976+00:00",
          "source_type": "PNEUMATIC_FLOW_METER"
        },
        "workforce": {
          "status": "UPDATED",
          "latency_label": "8 hrs ago",
          "coverage_pct": 100.0,
          "last_ingested_at": "2026-09-04T08:17:33.716976+00:00",
          "source_type": "BIOMETRIC_ATTENDANCE"
        }
      }
    },
    "verdict": {
      "headline": "Floor output is 0.5% below target. Major shortfall concentrated in Loom AJ-118 (509 min downtime).",
      "revenue_exposure_rs": 387787.0,
      "severity": "WARNING",
      "badge_label": "NOMINAL",
      "dominant_problem_loom": "AJ-118"
    },
    "core_numbers": {
      "production_metres": {
        "actual": 49748.8,
        "target": 50018.7,
        "variance_metres": -269.9,
        "variance_pct": -0.54,
        "status": "HEALTHY",
        "provenance": "ACTUAL"
      },
      "efficiency_pct": {
        "actual": 89.26,
        "target": 90.0,
        "variance_pp": -0.7,
        "status": "HEALTHY",
        "provenance": "CALCULATED"
      },
      "revenue_exposure_rs": {
        "value": 387787.0,
        "target_threshold_rs": 15000.0,
        "status": "CRITICAL",
        "rate_basis": "Rs.40.00/m standard rate card",
        "provenance": "ESTIMATED"
      },
      "actual_revenue_rs": {
        "value": 1989952.0,
        "target_value": 2000748.0,
        "status": "HEALTHY",
        "provenance": "ESTIMATED"
      }
    },
    "act_now": [
      {
        "action_id": "ACT-20260731-01",
        "recommendation_id": "REC-20260731-L118-DT",
        "priority": "P1",
        "loom_no": "AJ-118",
        "issue": "Voltage Trip Spike & Stoppages (> 500 min downtime)",
        "impact_metres": 938.0,
        "impact_inr": 37500.0,
        "action": "Inspect sub-panel voltage stability, tighten terminal lugs, and test inverter drive capacitor.",
        "assignee": "M. Murugan (Senior Electrician)",
        "status": "VERIFIED"
      },
      {
        "action_id": "ACT-20260731-02",
        "recommendation_id": "REC-20260731-L112-TENS",
        "priority": "P2",
        "loom_no": "AJ-112",
        "issue": "High Warp Break Rate (2.8 breaks / 1k picks)",
        "impact_metres": 355.0,
        "impact_inr": 14200.0,
        "action": "Calibrate yarn tension compensator and check drop wire sensitivity.",
        "assignee": "K. Selvam (Shift Fitter)",
        "status": "COMPLETED"
      },
      {
        "action_id": "ACT-20260731-03",
        "recommendation_id": "REC-20260731-L142-AIR",
        "priority": "P2",
        "loom_no": "AJ-142",
        "issue": "Pneumatic Air Leak (+10.2 CFM excess)",
        "impact_metres": 245.0,
        "impact_inr": 9800.0,
        "action": "Replace pneumatic regulator valve seal during planned shift change.",
        "assignee": "R. Prakash (Maintenance Tech)",
        "status": "ASSIGNED"
      }
    ],
    "why": {
      "causes": [
        {
          "category": "Breakdown & Mechanical",
          "pct": 16.6,
          "lost_metres": 1609.7,
          "lost_rs": 64389.0
        },
        {
          "category": "Electrical & Stoppages",
          "pct": 67.6,
          "lost_metres": 6552.8,
          "lost_rs": 262113.0
        },
        {
          "category": "Speed Drift & Efficiency Gap",
          "pct": 0.0,
          "lost_metres": 0.0,
          "lost_rs": 0.0
        },
        {
          "category": "Utility & Raw Material Stops",
          "pct": 15.8,
          "lost_metres": 1532.1,
          "lost_rs": 61285.0
        }
      ]
    },
    "ai_findings": [
      {
        "finding_id": "FIND-AIR-LEAK-AJ-112",
        "type": "ENERGY_WASTE",
        "severity": "MEDIUM",
        "entity_type": "LOOM",
        "entity_id": "AJ-112",
        "title": "Pneumatic Air Leakage on Loom AJ-112",
        "observations": [
          "Loom AJ-112 measured continuous pneumatic air flow above standard rating",
          "Excess leakage translates to ~\u20b92,342/shift in compressor power waste"
        ],
        "baseline_value": "18.5 CFM standard consumption",
        "current_value": "Excess +10.2 CFM",
        "impact": {
          "production_metres": 0.0,
          "revenue_inr": 2342.0,
          "downtime_minutes": 0.0
        },
        "inference": "Main pressure regulator seal degradation or loose pneumatic hose fitting.",
        "recommendation": "Replace pneumatic regulator O-ring on Loom AJ-112 during scheduled stop.",
        "confidence": "HIGH",
        "confidence_reason": "Measured by inline airflow transducer.",
        "generated_at": "2026-09-04T16:17:34.466473+00:00",
        "source_ids": [
          "air_log_1264"
        ]
      }
    ],
    "next_risk": {
      "title": "Air Pressure Drop Risk (Shed 2)",
      "prediction_badge": "PREDICTED",
      "probability_pct": 74.0,
      "detail": "Pneumatic regulator fluctuation on ring line 3 could induce 4+ weft insertion stops on Shed 2 Tsudakoma looms within 6 hours.",
      "preventive_action": "Check compressor booster valve 2 and clear moisture trap."
    },
    "last_action_result": {
      "loom_no": "AJ-118",
      "action": "Replaced loose terminal lug on Phase B and cleaned inverter cooling intake.",
      "before_metric": "509 min downtime / shift",
      "after_metric": "32 min downtime (Shift 2 & 3)",
      "result_status": "VERIFIED_IMPROVED",
      "recovered_revenue_rs": 37500.0
    },
    "trends": {
      "production_7d": [
        {
          "date": "25-Jul",
          "actual": 51200,
          "target": 54600
        },
        {
          "date": "26-Jul",
          "actual": 52400,
          "target": 54600
        },
        {
          "date": "27-Jul",
          "actual": 53100,
          "target": 54600
        },
        {
          "date": "28-Jul",
          "actual": 50800,
          "target": 54600
        },
        {
          "date": "29-Jul",
          "actual": 52900,
          "target": 54600
        },
        {
          "date": "30-Jul",
          "actual": 51800,
          "target": 54600
        },
        {
          "date": "31-Jul",
          "actual": 49748,
          "target": 50018
        }
      ],
      "efficiency_7d": [
        {
          "date": "25-Jul",
          "eff": 85.2
        },
        {
          "date": "26-Jul",
          "eff": 86.4
        },
        {
          "date": "27-Jul",
          "eff": 87.1
        },
        {
          "date": "28-Jul",
          "eff": 84.8
        },
        {
          "date": "29-Jul",
          "eff": 87.5
        },
        {
          "date": "30-Jul",
          "eff": 85.9
        },
        {
          "date": "31-Jul",
          "eff": 89.26
        }
      ]
    },
    "operations_data": {
      "shifts": [
        {
          "shift_code": "1",
          "metres": 16543.8,
          "kilo_picks": 35763.0,
          "loom_efficiency_pct": 89.0,
          "running_minutes": 84276,
          "stopped_minutes": 7884,
          "active_looms": 192
        },
        {
          "shift_code": "2",
          "metres": 16872.6,
          "kilo_picks": 36473.8,
          "loom_efficiency_pct": 90.8,
          "running_minutes": 85803,
          "stopped_minutes": 6357,
          "active_looms": 192
        },
        {
          "shift_code": "3",
          "metres": 16332.3,
          "kilo_picks": 35310.7,
          "loom_efficiency_pct": 87.9,
          "running_minutes": 83407,
          "stopped_minutes": 8753,
          "active_looms": 192
        }
      ],
      "worst_looms": [
        {
          "loom_id": 118,
          "loom_no": "AJ-118",
          "loom_type_code": "810",
          "total_stopped_minutes": 509,
          "event_count": 10,
          "dominant_reason_en": "Power failure",
          "dominant_reason_category": "MECHANICAL",
          "lost_meters": 152.8,
          "rupee_exposure": 6112.0,
          "efficiency_pct": 78.3,
          "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain"
        },
        {
          "loom_id": 3,
          "loom_no": "AJ-003",
          "loom_type_code": "910",
          "total_stopped_minutes": 471,
          "event_count": 7,
          "dominant_reason_en": "Power failure",
          "dominant_reason_category": "MECHANICAL",
          "lost_meters": 141.4,
          "rupee_exposure": 5655.0,
          "efficiency_pct": 78.9,
          "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain"
        },
        {
          "loom_id": 132,
          "loom_no": "AJ-132",
          "loom_type_code": "810",
          "total_stopped_minutes": 448,
          "event_count": 7,
          "dominant_reason_en": "Electrical breakdown",
          "dominant_reason_category": "MECHANICAL",
          "lost_meters": 134.5,
          "rupee_exposure": 5379.0,
          "efficiency_pct": 77.2,
          "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain"
        },
        {
          "loom_id": 76,
          "loom_no": "AJ-076",
          "loom_type_code": "810",
          "total_stopped_minutes": 422,
          "event_count": 7,
          "dominant_reason_en": "Voltage fluctuation",
          "dominant_reason_category": "ELECTRICAL",
          "lost_meters": 126.7,
          "rupee_exposure": 5067.0,
          "efficiency_pct": 82.1,
          "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain"
        },
        {
          "loom_id": 146,
          "loom_no": "AJ-146",
          "loom_type_code": "810",
          "total_stopped_minutes": 402,
          "event_count": 7,
          "dominant_reason_en": "Voltage fluctuation",
          "dominant_reason_category": "ELECTRICAL",
          "lost_meters": 120.7,
          "rupee_exposure": 4827.0,
          "efficiency_pct": 80.8,
          "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain"
        }
      ],
      "category_downtime": {
        "MECHANICAL": 4875.0,
        "ELECTRICAL": 19845.0,
        "MATERIAL": 1780.0,
        "MANPOWER": 3023.0,
        "UTILITY": 2860.0,
        "PLANNED": 4851.0,
        "OTHER": 0.0
      }
    }
  },
  "looms": {
    "data_as_of": "2026-09-01T15:07:11",
    "source_mix": [
      "DataSource.DEMO"
    ],
    "looms": [
      {
        "loom_id": 20,
        "loom_no": "AJ-020",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "60s Excel X 40s Vortex /165X110-133\" 4/1 Satin",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "32.057",
        "kilo_picks": "138.8310",
        "scheduled_minutes": 480,
        "running_minutes": 353,
        "stopped_minutes": 127,
        "loom_efficiency_pct": "70.43",
        "performance_eff_pct": "95.77",
        "utilization_pct": "73.54",
        "cohort_gap_pp": null,
        "cohort_loom_count": 2,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.043",
        "weft_breaks_per_1000": "0.180",
        "warp_breaks": 6,
        "weft_breaks": 25,
        "rupee_lost": {
          "value": "538",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "RED"
      },
      {
        "loom_id": 118,
        "loom_no": "AJ-118",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "78.668",
        "kilo_picks": "170.3440",
        "scheduled_minutes": 480,
        "running_minutes": 362,
        "stopped_minutes": 118,
        "loom_efficiency_pct": "74.45",
        "performance_eff_pct": "98.72",
        "utilization_pct": "75.42",
        "cohort_gap_pp": "-13.43",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.100",
        "weft_breaks_per_1000": "0.164",
        "warp_breaks": 17,
        "weft_breaks": 28,
        "rupee_lost": {
          "value": "1080",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "RED"
      },
      {
        "loom_id": 132,
        "loom_no": "AJ-132",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "78.697",
        "kilo_picks": "170.4070",
        "scheduled_minutes": 480,
        "running_minutes": 366,
        "stopped_minutes": 114,
        "loom_efficiency_pct": "74.48",
        "performance_eff_pct": "97.68",
        "utilization_pct": "76.25",
        "cohort_gap_pp": "-13.40",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.153",
        "weft_breaks_per_1000": "0.153",
        "warp_breaks": 26,
        "weft_breaks": 26,
        "rupee_lost": {
          "value": "1079",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "RED"
      },
      {
        "loom_id": 43,
        "loom_no": "AJ-043",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "78.798",
        "kilo_picks": "170.6250",
        "scheduled_minutes": 480,
        "running_minutes": 368,
        "stopped_minutes": 112,
        "loom_efficiency_pct": "74.57",
        "performance_eff_pct": "97.27",
        "utilization_pct": "76.67",
        "cohort_gap_pp": "-13.54",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.053",
        "weft_breaks_per_1000": "0.094",
        "warp_breaks": 9,
        "weft_breaks": 16,
        "rupee_lost": {
          "value": "1075",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "RED"
      },
      {
        "loom_id": 192,
        "loom_no": "SZ-024",
        "loom_type_code": "340",
        "shed_code": "SULZER",
        "style_code": "30s VSF X 30s VOT /68X57-48\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "25.838",
        "kilo_picks": "57.9830",
        "scheduled_minutes": 480,
        "running_minutes": 365,
        "stopped_minutes": 115,
        "loom_efficiency_pct": "74.88",
        "performance_eff_pct": "98.47",
        "utilization_pct": "76.04",
        "cohort_gap_pp": null,
        "cohort_loom_count": 4,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.310",
        "weft_breaks_per_1000": "0.483",
        "warp_breaks": 18,
        "weft_breaks": 28,
        "rupee_lost": {
          "value": "347",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "RED"
      },
      {
        "loom_id": 146,
        "loom_no": "AJ-146",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "80.873",
        "kilo_picks": "175.1180",
        "scheduled_minutes": 480,
        "running_minutes": 383,
        "stopped_minutes": 97,
        "loom_efficiency_pct": "76.54",
        "performance_eff_pct": "95.92",
        "utilization_pct": "79.79",
        "cohort_gap_pp": "-11.34",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.063",
        "weft_breaks_per_1000": "0.143",
        "warp_breaks": 11,
        "weft_breaks": 25,
        "rupee_lost": {
          "value": "992",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "RED"
      },
      {
        "loom_id": 178,
        "loom_no": "SZ-010",
        "loom_type_code": "TS",
        "shed_code": "SULZER",
        "style_code": "30s VSF X 30s VOT /68X57-48\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "26.475",
        "kilo_picks": "59.4120",
        "scheduled_minutes": 480,
        "running_minutes": 381,
        "stopped_minutes": 99,
        "loom_efficiency_pct": "76.72",
        "performance_eff_pct": "96.66",
        "utilization_pct": "79.38",
        "cohort_gap_pp": null,
        "cohort_loom_count": 3,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.151",
        "weft_breaks_per_1000": "0.337",
        "warp_breaks": 9,
        "weft_breaks": 20,
        "rupee_lost": {
          "value": "321",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "RED"
      },
      {
        "loom_id": 51,
        "loom_no": "AJ-051",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "81.941",
        "kilo_picks": "177.4310",
        "scheduled_minutes": 480,
        "running_minutes": 392,
        "stopped_minutes": 88,
        "loom_efficiency_pct": "77.55",
        "performance_eff_pct": "94.96",
        "utilization_pct": "81.67",
        "cohort_gap_pp": "-10.56",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.090",
        "weft_breaks_per_1000": "0.163",
        "warp_breaks": 16,
        "weft_breaks": 29,
        "rupee_lost": {
          "value": "949",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "RED"
      },
      {
        "loom_id": 33,
        "loom_no": "AJ-033",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "82.400",
        "kilo_picks": "178.4260",
        "scheduled_minutes": 480,
        "running_minutes": 377,
        "stopped_minutes": 103,
        "loom_efficiency_pct": "77.98",
        "performance_eff_pct": "99.29",
        "utilization_pct": "78.54",
        "cohort_gap_pp": "-10.13",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.095",
        "weft_breaks_per_1000": "0.168",
        "warp_breaks": 17,
        "weft_breaks": 30,
        "rupee_lost": {
          "value": "931",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "RED"
      },
      {
        "loom_id": 23,
        "loom_no": "AJ-023",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "82.711",
        "kilo_picks": "179.0980",
        "scheduled_minutes": 480,
        "running_minutes": 398,
        "stopped_minutes": 82,
        "loom_efficiency_pct": "78.28",
        "performance_eff_pct": "94.40",
        "utilization_pct": "82.92",
        "cohort_gap_pp": "-9.83",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.095",
        "weft_breaks_per_1000": "0.168",
        "warp_breaks": 17,
        "weft_breaks": 30,
        "rupee_lost": {
          "value": "918",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "RED"
      },
      {
        "loom_id": 3,
        "loom_no": "AJ-003",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "83.074",
        "kilo_picks": "179.8840",
        "scheduled_minutes": 480,
        "running_minutes": 390,
        "stopped_minutes": 90,
        "loom_efficiency_pct": "78.62",
        "performance_eff_pct": "96.76",
        "utilization_pct": "81.25",
        "cohort_gap_pp": "-9.49",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.083",
        "weft_breaks_per_1000": "0.139",
        "warp_breaks": 15,
        "weft_breaks": 25,
        "rupee_lost": {
          "value": "904",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "RED"
      },
      {
        "loom_id": 148,
        "loom_no": "AJ-148",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "83.711",
        "kilo_picks": "181.2640",
        "scheduled_minutes": 480,
        "running_minutes": 390,
        "stopped_minutes": 90,
        "loom_efficiency_pct": "79.22",
        "performance_eff_pct": "97.51",
        "utilization_pct": "81.25",
        "cohort_gap_pp": "-8.66",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.083",
        "weft_breaks_per_1000": "0.127",
        "warp_breaks": 15,
        "weft_breaks": 23,
        "rupee_lost": {
          "value": "878",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "RED"
      },
      {
        "loom_id": 135,
        "loom_no": "AJ-135",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "84.288",
        "kilo_picks": "182.5130",
        "scheduled_minutes": 480,
        "running_minutes": 401,
        "stopped_minutes": 79,
        "loom_efficiency_pct": "79.77",
        "performance_eff_pct": "95.48",
        "utilization_pct": "83.54",
        "cohort_gap_pp": "-8.34",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.088",
        "weft_breaks_per_1000": "0.214",
        "warp_breaks": 16,
        "weft_breaks": 39,
        "rupee_lost": {
          "value": "855",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "AMBER"
      },
      {
        "loom_id": 154,
        "loom_no": "AJ-154",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "84.395",
        "kilo_picks": "182.7460",
        "scheduled_minutes": 480,
        "running_minutes": 394,
        "stopped_minutes": 86,
        "loom_efficiency_pct": "79.87",
        "performance_eff_pct": "97.30",
        "utilization_pct": "82.08",
        "cohort_gap_pp": "-8.01",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.093",
        "weft_breaks_per_1000": "0.120",
        "warp_breaks": 17,
        "weft_breaks": 22,
        "rupee_lost": {
          "value": "851",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "AMBER"
      },
      {
        "loom_id": 75,
        "loom_no": "AJ-075",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "84.406",
        "kilo_picks": "182.7700",
        "scheduled_minutes": 480,
        "running_minutes": 400,
        "stopped_minutes": 80,
        "loom_efficiency_pct": "79.88",
        "performance_eff_pct": "95.86",
        "utilization_pct": "83.33",
        "cohort_gap_pp": "-8.23",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.060",
        "weft_breaks_per_1000": "0.126",
        "warp_breaks": 11,
        "weft_breaks": 23,
        "rupee_lost": {
          "value": "850",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "AMBER"
      },
      {
        "loom_id": 177,
        "loom_no": "SZ-009",
        "loom_type_code": "280",
        "shed_code": "SULZER",
        "style_code": "30s VSF Slub X 30s VSF Slub /90X68-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "22.079",
        "kilo_picks": "59.1080",
        "scheduled_minutes": 480,
        "running_minutes": 389,
        "stopped_minutes": 91,
        "loom_efficiency_pct": "79.96",
        "performance_eff_pct": "98.67",
        "utilization_pct": "81.04",
        "cohort_gap_pp": null,
        "cohort_loom_count": 3,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.135",
        "weft_breaks_per_1000": "0.305",
        "warp_breaks": 8,
        "weft_breaks": 18,
        "rupee_lost": {
          "value": "221",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "AMBER"
      },
      {
        "loom_id": 138,
        "loom_no": "AJ-138",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "84.884",
        "kilo_picks": "183.8040",
        "scheduled_minutes": 480,
        "running_minutes": 391,
        "stopped_minutes": 89,
        "loom_efficiency_pct": "80.33",
        "performance_eff_pct": "98.62",
        "utilization_pct": "81.46",
        "cohort_gap_pp": "-7.55",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.114",
        "weft_breaks_per_1000": "0.065",
        "warp_breaks": 21,
        "weft_breaks": 12,
        "rupee_lost": {
          "value": "831",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "AMBER"
      },
      {
        "loom_id": 69,
        "loom_no": "AJ-069",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "84.959",
        "kilo_picks": "183.9660",
        "scheduled_minutes": 480,
        "running_minutes": 386,
        "stopped_minutes": 94,
        "loom_efficiency_pct": "80.40",
        "performance_eff_pct": "99.98",
        "utilization_pct": "80.42",
        "cohort_gap_pp": "-7.71",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.049",
        "weft_breaks_per_1000": "0.114",
        "warp_breaks": 9,
        "weft_breaks": 21,
        "rupee_lost": {
          "value": "828",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "AMBER"
      },
      {
        "loom_id": 88,
        "loom_no": "AJ-088",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "84.978",
        "kilo_picks": "184.0070",
        "scheduled_minutes": 480,
        "running_minutes": 399,
        "stopped_minutes": 81,
        "loom_efficiency_pct": "80.42",
        "performance_eff_pct": "96.75",
        "utilization_pct": "83.12",
        "cohort_gap_pp": "-7.46",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.082",
        "weft_breaks_per_1000": "0.109",
        "warp_breaks": 15,
        "weft_breaks": 20,
        "rupee_lost": {
          "value": "827",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "AMBER"
      },
      {
        "loom_id": 92,
        "loom_no": "AJ-092",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "85.134",
        "kilo_picks": "184.3450",
        "scheduled_minutes": 480,
        "running_minutes": 406,
        "stopped_minutes": 74,
        "loom_efficiency_pct": "80.57",
        "performance_eff_pct": "95.25",
        "utilization_pct": "84.58",
        "cohort_gap_pp": "-7.31",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.119",
        "weft_breaks_per_1000": "0.157",
        "warp_breaks": 22,
        "weft_breaks": 29,
        "rupee_lost": {
          "value": "821",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "AMBER"
      },
      {
        "loom_id": 72,
        "loom_no": "AJ-072",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "85.198",
        "kilo_picks": "184.4830",
        "scheduled_minutes": 480,
        "running_minutes": 401,
        "stopped_minutes": 79,
        "loom_efficiency_pct": "80.63",
        "performance_eff_pct": "96.51",
        "utilization_pct": "83.54",
        "cohort_gap_pp": "-7.25",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.076",
        "weft_breaks_per_1000": "0.081",
        "warp_breaks": 14,
        "weft_breaks": 15,
        "rupee_lost": {
          "value": "819",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "AMBER"
      },
      {
        "loom_id": 76,
        "loom_no": "AJ-076",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "85.628",
        "kilo_picks": "185.4150",
        "scheduled_minutes": 480,
        "running_minutes": 398,
        "stopped_minutes": 82,
        "loom_efficiency_pct": "81.04",
        "performance_eff_pct": "97.73",
        "utilization_pct": "82.92",
        "cohort_gap_pp": "-6.84",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.059",
        "weft_breaks_per_1000": "0.076",
        "warp_breaks": 11,
        "weft_breaks": 14,
        "rupee_lost": {
          "value": "801",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "AMBER"
      },
      {
        "loom_id": 41,
        "loom_no": "AJ-041",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "87.061",
        "kilo_picks": "188.5180",
        "scheduled_minutes": 480,
        "running_minutes": 414,
        "stopped_minutes": 66,
        "loom_efficiency_pct": "82.39",
        "performance_eff_pct": "95.53",
        "utilization_pct": "86.25",
        "cohort_gap_pp": "-5.72",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.053",
        "weft_breaks_per_1000": "0.106",
        "warp_breaks": 10,
        "weft_breaks": 20,
        "rupee_lost": {
          "value": "744",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "AMBER"
      },
      {
        "loom_id": 129,
        "loom_no": "AJ-129",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "87.705",
        "kilo_picks": "189.9120",
        "scheduled_minutes": 480,
        "running_minutes": 414,
        "stopped_minutes": 66,
        "loom_efficiency_pct": "83.00",
        "performance_eff_pct": "96.24",
        "utilization_pct": "86.25",
        "cohort_gap_pp": "-5.11",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.011",
        "weft_breaks_per_1000": "0.074",
        "warp_breaks": 2,
        "weft_breaks": 14,
        "rupee_lost": {
          "value": "718",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "AMBER"
      },
      {
        "loom_id": 96,
        "loom_no": "AJ-096",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "87.835",
        "kilo_picks": "190.1930",
        "scheduled_minutes": 480,
        "running_minutes": 412,
        "stopped_minutes": 68,
        "loom_efficiency_pct": "83.13",
        "performance_eff_pct": "96.85",
        "utilization_pct": "85.83",
        "cohort_gap_pp": "-4.75",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.095",
        "weft_breaks_per_1000": "0.074",
        "warp_breaks": 18,
        "weft_breaks": 14,
        "rupee_lost": {
          "value": "713",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "AMBER"
      },
      {
        "loom_id": 25,
        "loom_no": "AJ-025",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "87.869",
        "kilo_picks": "190.2680",
        "scheduled_minutes": 480,
        "running_minutes": 410,
        "stopped_minutes": 70,
        "loom_efficiency_pct": "83.16",
        "performance_eff_pct": "97.36",
        "utilization_pct": "85.42",
        "cohort_gap_pp": "-4.95",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.063",
        "weft_breaks_per_1000": "0.084",
        "warp_breaks": 12,
        "weft_breaks": 16,
        "rupee_lost": {
          "value": "712",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "AMBER"
      },
      {
        "loom_id": 189,
        "loom_no": "SZ-021",
        "loom_type_code": "280",
        "shed_code": "SULZER",
        "style_code": "12s VSF Slub X 12s VSF Slub /56X44-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "34.109",
        "kilo_picks": "59.0870",
        "scheduled_minutes": 480,
        "running_minutes": 422,
        "stopped_minutes": 58,
        "loom_efficiency_pct": "83.93",
        "performance_eff_pct": "95.46",
        "utilization_pct": "87.92",
        "cohort_gap_pp": "-0.33",
        "cohort_loom_count": 6,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.034",
        "weft_breaks_per_1000": "0.389",
        "warp_breaks": 2,
        "weft_breaks": 23,
        "rupee_lost": {
          "value": "261",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "AMBER"
      },
      {
        "loom_id": 6,
        "loom_no": "AJ-006",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "88.756",
        "kilo_picks": "192.1890",
        "scheduled_minutes": 480,
        "running_minutes": 411,
        "stopped_minutes": 69,
        "loom_efficiency_pct": "84.00",
        "performance_eff_pct": "98.10",
        "utilization_pct": "85.62",
        "cohort_gap_pp": "-3.88",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.062",
        "weft_breaks_per_1000": "0.130",
        "warp_breaks": 12,
        "weft_breaks": 25,
        "rupee_lost": {
          "value": "676",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "AMBER"
      },
      {
        "loom_id": 150,
        "loom_no": "AJ-150",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "89.009",
        "kilo_picks": "192.7370",
        "scheduled_minutes": 480,
        "running_minutes": 418,
        "stopped_minutes": 62,
        "loom_efficiency_pct": "84.24",
        "performance_eff_pct": "96.73",
        "utilization_pct": "87.08",
        "cohort_gap_pp": "-3.64",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.047",
        "weft_breaks_per_1000": "0.135",
        "warp_breaks": 9,
        "weft_breaks": 26,
        "rupee_lost": {
          "value": "666",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "AMBER"
      },
      {
        "loom_id": 64,
        "loom_no": "AJ-064",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "89.248",
        "kilo_picks": "193.2530",
        "scheduled_minutes": 480,
        "running_minutes": 417,
        "stopped_minutes": 63,
        "loom_efficiency_pct": "84.46",
        "performance_eff_pct": "97.22",
        "utilization_pct": "86.88",
        "cohort_gap_pp": "-3.42",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.016",
        "weft_breaks_per_1000": "0.103",
        "warp_breaks": 3,
        "weft_breaks": 20,
        "rupee_lost": {
          "value": "657",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "AMBER"
      },
      {
        "loom_id": 48,
        "loom_no": "AJ-048",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "89.344",
        "kilo_picks": "193.4610",
        "scheduled_minutes": 480,
        "running_minutes": 420,
        "stopped_minutes": 60,
        "loom_efficiency_pct": "84.55",
        "performance_eff_pct": "96.63",
        "utilization_pct": "87.50",
        "cohort_gap_pp": "-3.33",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.047",
        "weft_breaks_per_1000": "0.098",
        "warp_breaks": 9,
        "weft_breaks": 19,
        "rupee_lost": {
          "value": "653",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "AMBER"
      },
      {
        "loom_id": 170,
        "loom_no": "SZ-002",
        "loom_type_code": "TS",
        "shed_code": "SULZER",
        "style_code": "30s VSF Slub X 30s VSF Slub /90X68-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "23.368",
        "kilo_picks": "62.5590",
        "scheduled_minutes": 480,
        "running_minutes": 417,
        "stopped_minutes": 63,
        "loom_efficiency_pct": "84.63",
        "performance_eff_pct": "97.42",
        "utilization_pct": "86.88",
        "cohort_gap_pp": "0.47",
        "cohort_loom_count": 5,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.016",
        "weft_breaks_per_1000": "0.304",
        "warp_breaks": 1,
        "weft_breaks": 19,
        "rupee_lost": {
          "value": "170",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "AMBER"
      },
      {
        "loom_id": 188,
        "loom_no": "SZ-020",
        "loom_type_code": "340",
        "shed_code": "SULZER",
        "style_code": "12s VSF Slub X 12s VSF Slub /56X44-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "34.480",
        "kilo_picks": "59.7300",
        "scheduled_minutes": 480,
        "running_minutes": 415,
        "stopped_minutes": 65,
        "loom_efficiency_pct": "84.84",
        "performance_eff_pct": "98.13",
        "utilization_pct": "86.46",
        "cohort_gap_pp": "1.12",
        "cohort_loom_count": 6,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.184",
        "weft_breaks_per_1000": "0.251",
        "warp_breaks": 11,
        "weft_breaks": 15,
        "rupee_lost": {
          "value": "246",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "AMBER"
      },
      {
        "loom_id": 50,
        "loom_no": "AJ-050",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "90.054",
        "kilo_picks": "195.0000",
        "scheduled_minutes": 480,
        "running_minutes": 413,
        "stopped_minutes": 67,
        "loom_efficiency_pct": "85.23",
        "performance_eff_pct": "99.05",
        "utilization_pct": "86.04",
        "cohort_gap_pp": "-2.65",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.046",
        "weft_breaks_per_1000": "0.087",
        "warp_breaks": 9,
        "weft_breaks": 17,
        "rupee_lost": {
          "value": "624",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "AMBER"
      },
      {
        "loom_id": 79,
        "loom_no": "AJ-079",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "90.323",
        "kilo_picks": "195.5820",
        "scheduled_minutes": 480,
        "running_minutes": 424,
        "stopped_minutes": 56,
        "loom_efficiency_pct": "85.48",
        "performance_eff_pct": "96.77",
        "utilization_pct": "88.33",
        "cohort_gap_pp": "-2.63",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.031",
        "weft_breaks_per_1000": "0.092",
        "warp_breaks": 6,
        "weft_breaks": 18,
        "rupee_lost": {
          "value": "614",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "AMBER"
      },
      {
        "loom_id": 187,
        "loom_no": "SZ-019",
        "loom_type_code": "SZ",
        "shed_code": "SULZER",
        "style_code": "30s VSF X 30s VOT /68X57-48\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "29.607",
        "kilo_picks": "66.4410",
        "scheduled_minutes": 480,
        "running_minutes": 425,
        "stopped_minutes": 55,
        "loom_efficiency_pct": "85.80",
        "performance_eff_pct": "96.90",
        "utilization_pct": "88.54",
        "cohort_gap_pp": "-1.10",
        "cohort_loom_count": 6,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.045",
        "weft_breaks_per_1000": "0.256",
        "warp_breaks": 3,
        "weft_breaks": 17,
        "rupee_lost": {
          "value": "196",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "AMBER"
      },
      {
        "loom_id": 182,
        "loom_no": "SZ-014",
        "loom_type_code": "TS",
        "shed_code": "SULZER",
        "style_code": "30s VSF Slub X 30s VSF Slub /90X68-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "23.717",
        "kilo_picks": "63.4950",
        "scheduled_minutes": 480,
        "running_minutes": 429,
        "stopped_minutes": 51,
        "loom_efficiency_pct": "85.90",
        "performance_eff_pct": "96.11",
        "utilization_pct": "89.38",
        "cohort_gap_pp": "1.74",
        "cohort_loom_count": 5,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.063",
        "weft_breaks_per_1000": "0.205",
        "warp_breaks": 4,
        "weft_breaks": 13,
        "rupee_lost": {
          "value": "156",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "AMBER"
      },
      {
        "loom_id": 181,
        "loom_no": "SZ-013",
        "loom_type_code": "280",
        "shed_code": "SULZER",
        "style_code": "12s VSF Slub X 12s VSF Slub /56X44-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "35.027",
        "kilo_picks": "60.6760",
        "scheduled_minutes": 480,
        "running_minutes": 431,
        "stopped_minutes": 49,
        "loom_efficiency_pct": "86.19",
        "performance_eff_pct": "95.98",
        "utilization_pct": "89.79",
        "cohort_gap_pp": "1.93",
        "cohort_loom_count": 6,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.066",
        "weft_breaks_per_1000": "0.280",
        "warp_breaks": 4,
        "weft_breaks": 17,
        "rupee_lost": {
          "value": "225",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "AMBER"
      },
      {
        "loom_id": 172,
        "loom_no": "SZ-004",
        "loom_type_code": "340",
        "shed_code": "SULZER",
        "style_code": "12s VSF Slub X 12s VSF Slub /56X44-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "35.151",
        "kilo_picks": "60.8920",
        "scheduled_minutes": 480,
        "running_minutes": 436,
        "stopped_minutes": 44,
        "loom_efficiency_pct": "86.49",
        "performance_eff_pct": "95.22",
        "utilization_pct": "90.83",
        "cohort_gap_pp": "2.77",
        "cohort_loom_count": 6,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.131",
        "weft_breaks_per_1000": "0.263",
        "warp_breaks": 8,
        "weft_breaks": 16,
        "rupee_lost": {
          "value": "220",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "AMBER"
      },
      {
        "loom_id": 128,
        "loom_no": "AJ-128",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "91.684",
        "kilo_picks": "198.5280",
        "scheduled_minutes": 480,
        "running_minutes": 430,
        "stopped_minutes": 50,
        "loom_efficiency_pct": "86.77",
        "performance_eff_pct": "96.86",
        "utilization_pct": "89.58",
        "cohort_gap_pp": "-1.11",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.065",
        "weft_breaks_per_1000": "0.055",
        "warp_breaks": 13,
        "weft_breaks": 11,
        "rupee_lost": {
          "value": "559",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 190,
        "loom_no": "SZ-022",
        "loom_type_code": "TS",
        "shed_code": "SULZER",
        "style_code": "30s VSF Slub X 30s VSF Slub /90X68-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "23.970",
        "kilo_picks": "64.1730",
        "scheduled_minutes": 480,
        "running_minutes": 429,
        "stopped_minutes": 51,
        "loom_efficiency_pct": "86.81",
        "performance_eff_pct": "97.13",
        "utilization_pct": "89.38",
        "cohort_gap_pp": "2.65",
        "cohort_loom_count": 5,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.031",
        "weft_breaks_per_1000": "0.296",
        "warp_breaks": 2,
        "weft_breaks": 19,
        "rupee_lost": {
          "value": "146",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 147,
        "loom_no": "AJ-147",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "91.812",
        "kilo_picks": "198.8060",
        "scheduled_minutes": 480,
        "running_minutes": 431,
        "stopped_minutes": 49,
        "loom_efficiency_pct": "86.89",
        "performance_eff_pct": "96.77",
        "utilization_pct": "89.79",
        "cohort_gap_pp": "-1.22",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.025",
        "weft_breaks_per_1000": "0.141",
        "warp_breaks": 5,
        "weft_breaks": 28,
        "rupee_lost": {
          "value": "554",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 176,
        "loom_no": "SZ-008",
        "loom_type_code": "340",
        "shed_code": "SULZER",
        "style_code": "30s VSF X 30s VOT /68X57-48\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "29.989",
        "kilo_picks": "67.2990",
        "scheduled_minutes": 480,
        "running_minutes": 417,
        "stopped_minutes": 63,
        "loom_efficiency_pct": "86.91",
        "performance_eff_pct": "100.04",
        "utilization_pct": "86.88",
        "cohort_gap_pp": null,
        "cohort_loom_count": 4,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.104",
        "weft_breaks_per_1000": "0.327",
        "warp_breaks": 7,
        "weft_breaks": 22,
        "rupee_lost": {
          "value": "181",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 110,
        "loom_no": "AJ-110",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "91.862",
        "kilo_picks": "198.9140",
        "scheduled_minutes": 480,
        "running_minutes": 434,
        "stopped_minutes": 46,
        "loom_efficiency_pct": "86.94",
        "performance_eff_pct": "96.15",
        "utilization_pct": "90.42",
        "cohort_gap_pp": "-0.94",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.035",
        "weft_breaks_per_1000": "0.131",
        "warp_breaks": 7,
        "weft_breaks": 26,
        "rupee_lost": {
          "value": "552",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 179,
        "loom_no": "SZ-011",
        "loom_type_code": "SZ",
        "shed_code": "SULZER",
        "style_code": "12s VSF Slub X 12s VSF Slub /56X44-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "35.410",
        "kilo_picks": "61.3400",
        "scheduled_minutes": 480,
        "running_minutes": 435,
        "stopped_minutes": 45,
        "loom_efficiency_pct": "87.13",
        "performance_eff_pct": "96.14",
        "utilization_pct": "90.62",
        "cohort_gap_pp": "1.07",
        "cohort_loom_count": 6,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.065",
        "weft_breaks_per_1000": "0.277",
        "warp_breaks": 4,
        "weft_breaks": 17,
        "rupee_lost": {
          "value": "209",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 184,
        "loom_no": "SZ-016",
        "loom_type_code": "340",
        "shed_code": "SULZER",
        "style_code": "12s VSF Slub X 12s VSF Slub /56X44-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "35.411",
        "kilo_picks": "61.3420",
        "scheduled_minutes": 480,
        "running_minutes": 424,
        "stopped_minutes": 56,
        "loom_efficiency_pct": "87.13",
        "performance_eff_pct": "98.64",
        "utilization_pct": "88.33",
        "cohort_gap_pp": "3.41",
        "cohort_loom_count": 6,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.098",
        "weft_breaks_per_1000": "0.130",
        "warp_breaks": 6,
        "weft_breaks": 8,
        "rupee_lost": {
          "value": "209",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 185,
        "loom_no": "SZ-017",
        "loom_type_code": "280",
        "shed_code": "SULZER",
        "style_code": "12s VSF Slub X 12s VSF Slub /56X44-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "35.470",
        "kilo_picks": "61.4440",
        "scheduled_minutes": 480,
        "running_minutes": 434,
        "stopped_minutes": 46,
        "loom_efficiency_pct": "87.28",
        "performance_eff_pct": "96.53",
        "utilization_pct": "90.42",
        "cohort_gap_pp": "3.02",
        "cohort_loom_count": 6,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.098",
        "weft_breaks_per_1000": "0.260",
        "warp_breaks": 6,
        "weft_breaks": 16,
        "rupee_lost": {
          "value": "207",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 117,
        "loom_no": "AJ-117",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "92.233",
        "kilo_picks": "199.7170",
        "scheduled_minutes": 480,
        "running_minutes": 434,
        "stopped_minutes": 46,
        "loom_efficiency_pct": "87.29",
        "performance_eff_pct": "96.54",
        "utilization_pct": "90.42",
        "cohort_gap_pp": "-0.82",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.015",
        "weft_breaks_per_1000": "0.060",
        "warp_breaks": 3,
        "weft_breaks": 12,
        "rupee_lost": {
          "value": "537",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 130,
        "loom_no": "AJ-130",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "92.257",
        "kilo_picks": "199.7690",
        "scheduled_minutes": 480,
        "running_minutes": 439,
        "stopped_minutes": 41,
        "loom_efficiency_pct": "87.31",
        "performance_eff_pct": "95.47",
        "utilization_pct": "91.46",
        "cohort_gap_pp": "-0.57",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.040",
        "weft_breaks_per_1000": "0.090",
        "warp_breaks": 8,
        "weft_breaks": 18,
        "rupee_lost": {
          "value": "536",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 173,
        "loom_no": "SZ-005",
        "loom_type_code": "280",
        "shed_code": "SULZER",
        "style_code": "12s VSF Slub X 12s VSF Slub /56X44-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "35.499",
        "kilo_picks": "61.4950",
        "scheduled_minutes": 480,
        "running_minutes": 422,
        "stopped_minutes": 58,
        "loom_efficiency_pct": "87.35",
        "performance_eff_pct": "99.35",
        "utilization_pct": "87.92",
        "cohort_gap_pp": "3.09",
        "cohort_loom_count": 6,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.130",
        "weft_breaks_per_1000": "0.244",
        "warp_breaks": 8,
        "weft_breaks": 15,
        "rupee_lost": {
          "value": "206",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 191,
        "loom_no": "SZ-023",
        "loom_type_code": "SZ",
        "shed_code": "SULZER",
        "style_code": "12s VSF Slub X 12s VSF Slub /56X44-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "35.520",
        "kilo_picks": "61.5300",
        "scheduled_minutes": 480,
        "running_minutes": 425,
        "stopped_minutes": 55,
        "loom_efficiency_pct": "87.40",
        "performance_eff_pct": "98.71",
        "utilization_pct": "88.54",
        "cohort_gap_pp": "1.34",
        "cohort_loom_count": 6,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.016",
        "weft_breaks_per_1000": "0.276",
        "warp_breaks": 1,
        "weft_breaks": 17,
        "rupee_lost": {
          "value": "205",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 21,
        "loom_no": "AJ-021",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "92.853",
        "kilo_picks": "201.0600",
        "scheduled_minutes": 480,
        "running_minutes": 435,
        "stopped_minutes": 45,
        "loom_efficiency_pct": "87.88",
        "performance_eff_pct": "96.97",
        "utilization_pct": "90.62",
        "cohort_gap_pp": "-0.23",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.025",
        "weft_breaks_per_1000": "0.070",
        "warp_breaks": 5,
        "weft_breaks": 14,
        "rupee_lost": {
          "value": "512",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 80,
        "loom_no": "AJ-080",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "93.078",
        "kilo_picks": "201.5470",
        "scheduled_minutes": 480,
        "running_minutes": 435,
        "stopped_minutes": 45,
        "loom_efficiency_pct": "88.09",
        "performance_eff_pct": "97.20",
        "utilization_pct": "90.62",
        "cohort_gap_pp": "0.21",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.035",
        "weft_breaks_per_1000": "0.069",
        "warp_breaks": 7,
        "weft_breaks": 14,
        "rupee_lost": {
          "value": "503",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 169,
        "loom_no": "SZ-001",
        "loom_type_code": "280",
        "shed_code": "SULZER",
        "style_code": "12s VSF Slub X 12s VSF Slub /56X44-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "35.809",
        "kilo_picks": "62.0310",
        "scheduled_minutes": 480,
        "running_minutes": 442,
        "stopped_minutes": 38,
        "loom_efficiency_pct": "88.11",
        "performance_eff_pct": "95.69",
        "utilization_pct": "92.08",
        "cohort_gap_pp": "3.85",
        "cohort_loom_count": 6,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.129",
        "weft_breaks_per_1000": "0.210",
        "warp_breaks": 8,
        "weft_breaks": 13,
        "rupee_lost": {
          "value": "193",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 113,
        "loom_no": "AJ-113",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "93.176",
        "kilo_picks": "201.7590",
        "scheduled_minutes": 480,
        "running_minutes": 430,
        "stopped_minutes": 50,
        "loom_efficiency_pct": "88.18",
        "performance_eff_pct": "98.43",
        "utilization_pct": "89.58",
        "cohort_gap_pp": "0.07",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.025",
        "weft_breaks_per_1000": "0.104",
        "warp_breaks": 5,
        "weft_breaks": 21,
        "rupee_lost": {
          "value": "500",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 186,
        "loom_no": "SZ-018",
        "loom_type_code": "TS",
        "shed_code": "SULZER",
        "style_code": "30s VSF Slub X 30s VSF Slub /90X68-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "24.346",
        "kilo_picks": "65.1790",
        "scheduled_minutes": 480,
        "running_minutes": 427,
        "stopped_minutes": 53,
        "loom_efficiency_pct": "88.18",
        "performance_eff_pct": "99.12",
        "utilization_pct": "88.96",
        "cohort_gap_pp": "4.02",
        "cohort_loom_count": 5,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.015",
        "weft_breaks_per_1000": "0.215",
        "warp_breaks": 1,
        "weft_breaks": 14,
        "rupee_lost": {
          "value": "131",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 127,
        "loom_no": "AJ-127",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "93.383",
        "kilo_picks": "202.2070",
        "scheduled_minutes": 480,
        "running_minutes": 424,
        "stopped_minutes": 56,
        "loom_efficiency_pct": "88.38",
        "performance_eff_pct": "100.05",
        "utilization_pct": "88.33",
        "cohort_gap_pp": "0.27",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.030",
        "weft_breaks_per_1000": "0.089",
        "warp_breaks": 6,
        "weft_breaks": 18,
        "rupee_lost": {
          "value": "491",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 32,
        "loom_no": "AJ-032",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "93.618",
        "kilo_picks": "202.7160",
        "scheduled_minutes": 480,
        "running_minutes": 439,
        "stopped_minutes": 41,
        "loom_efficiency_pct": "88.60",
        "performance_eff_pct": "96.87",
        "utilization_pct": "91.46",
        "cohort_gap_pp": "0.72",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.025",
        "weft_breaks_per_1000": "0.054",
        "warp_breaks": 5,
        "weft_breaks": 11,
        "rupee_lost": {
          "value": "482",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 180,
        "loom_no": "SZ-012",
        "loom_type_code": "340",
        "shed_code": "SULZER",
        "style_code": "12s VSF Slub X 12s VSF Slub /56X44-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "36.014",
        "kilo_picks": "62.3870",
        "scheduled_minutes": 480,
        "running_minutes": 443,
        "stopped_minutes": 37,
        "loom_efficiency_pct": "88.62",
        "performance_eff_pct": "96.02",
        "utilization_pct": "92.29",
        "cohort_gap_pp": "4.90",
        "cohort_loom_count": 6,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.064",
        "weft_breaks_per_1000": "0.289",
        "warp_breaks": 4,
        "weft_breaks": 18,
        "rupee_lost": {
          "value": "185",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 55,
        "loom_no": "AJ-055",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "93.707",
        "kilo_picks": "202.9080",
        "scheduled_minutes": 480,
        "running_minutes": 428,
        "stopped_minutes": 52,
        "loom_efficiency_pct": "88.68",
        "performance_eff_pct": "99.46",
        "utilization_pct": "89.17",
        "cohort_gap_pp": "0.57",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.034",
        "weft_breaks_per_1000": "0.074",
        "warp_breaks": 7,
        "weft_breaks": 15,
        "rupee_lost": {
          "value": "478",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 82,
        "loom_no": "AJ-082",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "93.740",
        "kilo_picks": "202.9810",
        "scheduled_minutes": 480,
        "running_minutes": 438,
        "stopped_minutes": 42,
        "loom_efficiency_pct": "88.71",
        "performance_eff_pct": "97.22",
        "utilization_pct": "91.25",
        "cohort_gap_pp": "0.83",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.010",
        "weft_breaks_per_1000": "0.099",
        "warp_breaks": 2,
        "weft_breaks": 20,
        "rupee_lost": {
          "value": "477",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 37,
        "loom_no": "AJ-037",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "93.755",
        "kilo_picks": "203.0130",
        "scheduled_minutes": 480,
        "running_minutes": 444,
        "stopped_minutes": 36,
        "loom_efficiency_pct": "88.73",
        "performance_eff_pct": "95.92",
        "utilization_pct": "92.50",
        "cohort_gap_pp": "0.62",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.039",
        "weft_breaks_per_1000": "0.084",
        "warp_breaks": 8,
        "weft_breaks": 17,
        "rupee_lost": {
          "value": "476",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 183,
        "loom_no": "SZ-015",
        "loom_type_code": "SZ",
        "shed_code": "SULZER",
        "style_code": "30s VSF X 30s VOT /68X57-48\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "30.650",
        "kilo_picks": "68.7810",
        "scheduled_minutes": 480,
        "running_minutes": 437,
        "stopped_minutes": 43,
        "loom_efficiency_pct": "88.82",
        "performance_eff_pct": "97.56",
        "utilization_pct": "91.04",
        "cohort_gap_pp": "1.92",
        "cohort_loom_count": 6,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.058",
        "weft_breaks_per_1000": "0.174",
        "warp_breaks": 4,
        "weft_breaks": 12,
        "rupee_lost": {
          "value": "154",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 38,
        "loom_no": "AJ-038",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "94.004",
        "kilo_picks": "203.5520",
        "scheduled_minutes": 480,
        "running_minutes": 445,
        "stopped_minutes": 35,
        "loom_efficiency_pct": "88.96",
        "performance_eff_pct": "95.96",
        "utilization_pct": "92.71",
        "cohort_gap_pp": "1.08",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.044",
        "weft_breaks_per_1000": "0.098",
        "warp_breaks": 9,
        "weft_breaks": 20,
        "rupee_lost": {
          "value": "466",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 14,
        "loom_no": "AJ-014",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "94.142",
        "kilo_picks": "203.8500",
        "scheduled_minutes": 480,
        "running_minutes": 450,
        "stopped_minutes": 30,
        "loom_efficiency_pct": "89.09",
        "performance_eff_pct": "95.03",
        "utilization_pct": "93.75",
        "cohort_gap_pp": "1.21",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.029",
        "weft_breaks_per_1000": "0.059",
        "warp_breaks": 6,
        "weft_breaks": 12,
        "rupee_lost": {
          "value": "461",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 175,
        "loom_no": "SZ-007",
        "loom_type_code": "SZ",
        "shed_code": "SULZER",
        "style_code": "30s VSF X 30s VOT /68X57-48\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "30.746",
        "kilo_picks": "68.9970",
        "scheduled_minutes": 480,
        "running_minutes": 453,
        "stopped_minutes": 27,
        "loom_efficiency_pct": "89.10",
        "performance_eff_pct": "94.41",
        "utilization_pct": "94.38",
        "cohort_gap_pp": "2.20",
        "cohort_loom_count": 6,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.087",
        "weft_breaks_per_1000": "0.304",
        "warp_breaks": 6,
        "weft_breaks": 21,
        "rupee_lost": {
          "value": "150",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 144,
        "loom_no": "AJ-144",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "94.165",
        "kilo_picks": "203.9000",
        "scheduled_minutes": 480,
        "running_minutes": 440,
        "stopped_minutes": 40,
        "loom_efficiency_pct": "89.12",
        "performance_eff_pct": "97.22",
        "utilization_pct": "91.67",
        "cohort_gap_pp": "1.24",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.015",
        "weft_breaks_per_1000": "0.059",
        "warp_breaks": 3,
        "weft_breaks": 12,
        "rupee_lost": {
          "value": "460",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 46,
        "loom_no": "AJ-046",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "94.291",
        "kilo_picks": "204.1740",
        "scheduled_minutes": 480,
        "running_minutes": 437,
        "stopped_minutes": 43,
        "loom_efficiency_pct": "89.24",
        "performance_eff_pct": "98.02",
        "utilization_pct": "91.04",
        "cohort_gap_pp": "1.36",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.020",
        "weft_breaks_per_1000": "0.098",
        "warp_breaks": 4,
        "weft_breaks": 20,
        "rupee_lost": {
          "value": "455",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 87,
        "loom_no": "AJ-087",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "94.389",
        "kilo_picks": "204.3850",
        "scheduled_minutes": 480,
        "running_minutes": 438,
        "stopped_minutes": 42,
        "loom_efficiency_pct": "89.33",
        "performance_eff_pct": "97.89",
        "utilization_pct": "91.25",
        "cohort_gap_pp": "1.22",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.020",
        "weft_breaks_per_1000": "0.078",
        "warp_breaks": 4,
        "weft_breaks": 16,
        "rupee_lost": {
          "value": "451",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 29,
        "loom_no": "AJ-029",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "94.417",
        "kilo_picks": "204.4470",
        "scheduled_minutes": 480,
        "running_minutes": 444,
        "stopped_minutes": 36,
        "loom_efficiency_pct": "89.36",
        "performance_eff_pct": "96.60",
        "utilization_pct": "92.50",
        "cohort_gap_pp": "1.25",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.034",
        "weft_breaks_per_1000": "0.088",
        "warp_breaks": 7,
        "weft_breaks": 18,
        "rupee_lost": {
          "value": "450",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 67,
        "loom_no": "AJ-067",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "94.440",
        "kilo_picks": "204.4960",
        "scheduled_minutes": 480,
        "running_minutes": 432,
        "stopped_minutes": 48,
        "loom_efficiency_pct": "89.38",
        "performance_eff_pct": "99.31",
        "utilization_pct": "90.00",
        "cohort_gap_pp": "1.27",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.015",
        "weft_breaks_per_1000": "0.103",
        "warp_breaks": 3,
        "weft_breaks": 21,
        "rupee_lost": {
          "value": "449",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 9,
        "loom_no": "AJ-009",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "94.542",
        "kilo_picks": "204.7180",
        "scheduled_minutes": 480,
        "running_minutes": 446,
        "stopped_minutes": 34,
        "loom_efficiency_pct": "89.47",
        "performance_eff_pct": "96.29",
        "utilization_pct": "92.92",
        "cohort_gap_pp": "1.36",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.010",
        "weft_breaks_per_1000": "0.088",
        "warp_breaks": 2,
        "weft_breaks": 18,
        "rupee_lost": {
          "value": "445",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 24,
        "loom_no": "AJ-024",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "94.541",
        "kilo_picks": "204.7140",
        "scheduled_minutes": 480,
        "running_minutes": 446,
        "stopped_minutes": 34,
        "loom_efficiency_pct": "89.47",
        "performance_eff_pct": "96.29",
        "utilization_pct": "92.92",
        "cohort_gap_pp": "1.59",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.029",
        "weft_breaks_per_1000": "0.098",
        "warp_breaks": 6,
        "weft_breaks": 20,
        "rupee_lost": {
          "value": "445",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 139,
        "loom_no": "AJ-139",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "94.621",
        "kilo_picks": "204.8880",
        "scheduled_minutes": 480,
        "running_minutes": 444,
        "stopped_minutes": 36,
        "loom_efficiency_pct": "89.55",
        "performance_eff_pct": "96.81",
        "utilization_pct": "92.50",
        "cohort_gap_pp": "1.44",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.024",
        "weft_breaks_per_1000": "0.078",
        "warp_breaks": 5,
        "weft_breaks": 16,
        "rupee_lost": {
          "value": "442",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 49,
        "loom_no": "AJ-049",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "94.701",
        "kilo_picks": "205.0620",
        "scheduled_minutes": 480,
        "running_minutes": 452,
        "stopped_minutes": 28,
        "loom_efficiency_pct": "89.62",
        "performance_eff_pct": "95.18",
        "utilization_pct": "94.17",
        "cohort_gap_pp": "1.51",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.015",
        "weft_breaks_per_1000": "0.073",
        "warp_breaks": 3,
        "weft_breaks": 15,
        "rupee_lost": {
          "value": "439",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 97,
        "loom_no": "AJ-097",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "94.747",
        "kilo_picks": "205.1620",
        "scheduled_minutes": 480,
        "running_minutes": 441,
        "stopped_minutes": 39,
        "loom_efficiency_pct": "89.67",
        "performance_eff_pct": "97.60",
        "utilization_pct": "91.88",
        "cohort_gap_pp": "1.56",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.015",
        "weft_breaks_per_1000": "0.054",
        "warp_breaks": 3,
        "weft_breaks": 11,
        "rupee_lost": {
          "value": "437",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 109,
        "loom_no": "AJ-109",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "94.745",
        "kilo_picks": "205.1570",
        "scheduled_minutes": 480,
        "running_minutes": 433,
        "stopped_minutes": 47,
        "loom_efficiency_pct": "89.67",
        "performance_eff_pct": "99.40",
        "utilization_pct": "90.21",
        "cohort_gap_pp": "1.56",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.005",
        "weft_breaks_per_1000": "0.112",
        "warp_breaks": 1,
        "weft_breaks": 23,
        "rupee_lost": {
          "value": "437",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 28,
        "loom_no": "AJ-028",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "94.855",
        "kilo_picks": "205.3950",
        "scheduled_minutes": 480,
        "running_minutes": 434,
        "stopped_minutes": 46,
        "loom_efficiency_pct": "89.77",
        "performance_eff_pct": "99.28",
        "utilization_pct": "90.42",
        "cohort_gap_pp": "1.89",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.015",
        "weft_breaks_per_1000": "0.073",
        "warp_breaks": 3,
        "weft_breaks": 15,
        "rupee_lost": {
          "value": "432",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 70,
        "loom_no": "AJ-070",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "94.852",
        "kilo_picks": "205.3890",
        "scheduled_minutes": 480,
        "running_minutes": 442,
        "stopped_minutes": 38,
        "loom_efficiency_pct": "89.77",
        "performance_eff_pct": "97.48",
        "utilization_pct": "92.08",
        "cohort_gap_pp": "1.89",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.015",
        "weft_breaks_per_1000": "0.058",
        "warp_breaks": 3,
        "weft_breaks": 12,
        "rupee_lost": {
          "value": "433",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 111,
        "loom_no": "AJ-111",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "94.859",
        "kilo_picks": "205.4030",
        "scheduled_minutes": 480,
        "running_minutes": 438,
        "stopped_minutes": 42,
        "loom_efficiency_pct": "89.77",
        "performance_eff_pct": "98.38",
        "utilization_pct": "91.25",
        "cohort_gap_pp": "1.66",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.034",
        "weft_breaks_per_1000": "0.073",
        "warp_breaks": 7,
        "weft_breaks": 15,
        "rupee_lost": {
          "value": "432",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 7,
        "loom_no": "AJ-007",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "94.867",
        "kilo_picks": "205.4210",
        "scheduled_minutes": 480,
        "running_minutes": 440,
        "stopped_minutes": 40,
        "loom_efficiency_pct": "89.78",
        "performance_eff_pct": "97.94",
        "utilization_pct": "91.67",
        "cohort_gap_pp": "1.67",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.019",
        "weft_breaks_per_1000": "0.107",
        "warp_breaks": 4,
        "weft_breaks": 22,
        "rupee_lost": {
          "value": "432",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 78,
        "loom_no": "AJ-078",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "94.862",
        "kilo_picks": "205.4110",
        "scheduled_minutes": 480,
        "running_minutes": 450,
        "stopped_minutes": 30,
        "loom_efficiency_pct": "89.78",
        "performance_eff_pct": "95.76",
        "utilization_pct": "93.75",
        "cohort_gap_pp": "1.90",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.029",
        "weft_breaks_per_1000": "0.107",
        "warp_breaks": 6,
        "weft_breaks": 22,
        "rupee_lost": {
          "value": "432",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 156,
        "loom_no": "AJ-156",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "94.872",
        "kilo_picks": "205.4310",
        "scheduled_minutes": 480,
        "running_minutes": 448,
        "stopped_minutes": 32,
        "loom_efficiency_pct": "89.79",
        "performance_eff_pct": "96.20",
        "utilization_pct": "93.33",
        "cohort_gap_pp": "1.91",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.034",
        "weft_breaks_per_1000": "0.083",
        "warp_breaks": 7,
        "weft_breaks": 17,
        "rupee_lost": {
          "value": "432",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 171,
        "loom_no": "SZ-003",
        "loom_type_code": "SZ",
        "shed_code": "SULZER",
        "style_code": "30s VSF Slub X 30s VSF Slub /90X68-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "24.793",
        "kilo_picks": "66.3750",
        "scheduled_minutes": 480,
        "running_minutes": 446,
        "stopped_minutes": 34,
        "loom_efficiency_pct": "89.79",
        "performance_eff_pct": "96.64",
        "utilization_pct": "92.92",
        "cohort_gap_pp": "3.10",
        "cohort_loom_count": 5,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.030",
        "weft_breaks_per_1000": "0.362",
        "warp_breaks": 2,
        "weft_breaks": 24,
        "rupee_lost": {
          "value": "113",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 13,
        "loom_no": "AJ-013",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "20s OE X 21s Cotton Flax /56X44-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "116.799",
        "kilo_picks": "202.3290",
        "scheduled_minutes": 480,
        "running_minutes": 440,
        "stopped_minutes": 40,
        "loom_efficiency_pct": "89.81",
        "performance_eff_pct": "97.98",
        "utilization_pct": "91.67",
        "cohort_gap_pp": null,
        "cohort_loom_count": 1,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.020",
        "weft_breaks_per_1000": "0.069",
        "warp_breaks": 4,
        "weft_breaks": 14,
        "rupee_lost": {
          "value": "530",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 137,
        "loom_no": "AJ-137",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "94.983",
        "kilo_picks": "205.6720",
        "scheduled_minutes": 480,
        "running_minutes": 444,
        "stopped_minutes": 36,
        "loom_efficiency_pct": "89.89",
        "performance_eff_pct": "97.18",
        "utilization_pct": "92.50",
        "cohort_gap_pp": "1.78",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.019",
        "weft_breaks_per_1000": "0.068",
        "warp_breaks": 4,
        "weft_breaks": 14,
        "rupee_lost": {
          "value": "427",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 143,
        "loom_no": "AJ-143",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "94.986",
        "kilo_picks": "205.6790",
        "scheduled_minutes": 480,
        "running_minutes": 446,
        "stopped_minutes": 34,
        "loom_efficiency_pct": "89.89",
        "performance_eff_pct": "96.75",
        "utilization_pct": "92.92",
        "cohort_gap_pp": "1.78",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.024",
        "weft_breaks_per_1000": "0.039",
        "warp_breaks": 5,
        "weft_breaks": 8,
        "rupee_lost": {
          "value": "427",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 157,
        "loom_no": "AJ-157",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "94.977",
        "kilo_picks": "205.6590",
        "scheduled_minutes": 480,
        "running_minutes": 446,
        "stopped_minutes": 34,
        "loom_efficiency_pct": "89.89",
        "performance_eff_pct": "96.74",
        "utilization_pct": "92.92",
        "cohort_gap_pp": "1.78",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.034",
        "weft_breaks_per_1000": "0.117",
        "warp_breaks": 7,
        "weft_breaks": 24,
        "rupee_lost": {
          "value": "428",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 45,
        "loom_no": "AJ-045",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.025",
        "kilo_picks": "205.7620",
        "scheduled_minutes": 480,
        "running_minutes": 453,
        "stopped_minutes": 27,
        "loom_efficiency_pct": "89.93",
        "performance_eff_pct": "95.29",
        "utilization_pct": "94.38",
        "cohort_gap_pp": "1.82",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.015",
        "weft_breaks_per_1000": "0.092",
        "warp_breaks": 3,
        "weft_breaks": 19,
        "rupee_lost": {
          "value": "426",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 140,
        "loom_no": "AJ-140",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.074",
        "kilo_picks": "205.8700",
        "scheduled_minutes": 480,
        "running_minutes": 446,
        "stopped_minutes": 34,
        "loom_efficiency_pct": "89.98",
        "performance_eff_pct": "96.84",
        "utilization_pct": "92.92",
        "cohort_gap_pp": "2.10",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.034",
        "weft_breaks_per_1000": "0.141",
        "warp_breaks": 7,
        "weft_breaks": 29,
        "rupee_lost": {
          "value": "424",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 134,
        "loom_no": "AJ-134",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.089",
        "kilo_picks": "205.9010",
        "scheduled_minutes": 480,
        "running_minutes": 439,
        "stopped_minutes": 41,
        "loom_efficiency_pct": "89.99",
        "performance_eff_pct": "98.40",
        "utilization_pct": "91.46",
        "cohort_gap_pp": "2.11",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.024",
        "weft_breaks_per_1000": "0.073",
        "warp_breaks": 5,
        "weft_breaks": 15,
        "rupee_lost": {
          "value": "423",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 4,
        "loom_no": "AJ-004",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.146",
        "kilo_picks": "206.0240",
        "scheduled_minutes": 480,
        "running_minutes": 458,
        "stopped_minutes": 22,
        "loom_efficiency_pct": "90.04",
        "performance_eff_pct": "94.37",
        "utilization_pct": "95.42",
        "cohort_gap_pp": "2.16",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.039",
        "weft_breaks_per_1000": "0.078",
        "warp_breaks": 8,
        "weft_breaks": 16,
        "rupee_lost": {
          "value": "421",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 59,
        "loom_no": "AJ-059",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.146",
        "kilo_picks": "206.0240",
        "scheduled_minutes": 480,
        "running_minutes": 438,
        "stopped_minutes": 42,
        "loom_efficiency_pct": "90.04",
        "performance_eff_pct": "98.68",
        "utilization_pct": "91.25",
        "cohort_gap_pp": "1.93",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.019",
        "weft_breaks_per_1000": "0.078",
        "warp_breaks": 4,
        "weft_breaks": 16,
        "rupee_lost": {
          "value": "421",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 66,
        "loom_no": "AJ-066",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.203",
        "kilo_picks": "206.1490",
        "scheduled_minutes": 480,
        "running_minutes": 445,
        "stopped_minutes": 35,
        "loom_efficiency_pct": "90.10",
        "performance_eff_pct": "97.19",
        "utilization_pct": "92.71",
        "cohort_gap_pp": "2.22",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.044",
        "weft_breaks_per_1000": "0.082",
        "warp_breaks": 9,
        "weft_breaks": 17,
        "rupee_lost": {
          "value": "418",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 124,
        "loom_no": "AJ-124",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.234",
        "kilo_picks": "206.2150",
        "scheduled_minutes": 480,
        "running_minutes": 442,
        "stopped_minutes": 38,
        "loom_efficiency_pct": "90.13",
        "performance_eff_pct": "97.88",
        "utilization_pct": "92.08",
        "cohort_gap_pp": "2.25",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.015",
        "weft_breaks_per_1000": "0.102",
        "warp_breaks": 3,
        "weft_breaks": 21,
        "rupee_lost": {
          "value": "417",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 167,
        "loom_no": "AJ-167",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.280",
        "kilo_picks": "206.3150",
        "scheduled_minutes": 480,
        "running_minutes": 450,
        "stopped_minutes": 30,
        "loom_efficiency_pct": "90.17",
        "performance_eff_pct": "96.18",
        "utilization_pct": "93.75",
        "cohort_gap_pp": "2.06",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.029",
        "weft_breaks_per_1000": "0.068",
        "warp_breaks": 6,
        "weft_breaks": 14,
        "rupee_lost": {
          "value": "415",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 71,
        "loom_no": "AJ-071",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.316",
        "kilo_picks": "206.3920",
        "scheduled_minutes": 480,
        "running_minutes": 435,
        "stopped_minutes": 45,
        "loom_efficiency_pct": "90.21",
        "performance_eff_pct": "99.54",
        "utilization_pct": "90.62",
        "cohort_gap_pp": "2.10",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.029",
        "weft_breaks_per_1000": "0.097",
        "warp_breaks": 6,
        "weft_breaks": 20,
        "rupee_lost": {
          "value": "414",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 103,
        "loom_no": "AJ-103",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.347",
        "kilo_picks": "206.4600",
        "scheduled_minutes": 480,
        "running_minutes": 438,
        "stopped_minutes": 42,
        "loom_efficiency_pct": "90.24",
        "performance_eff_pct": "98.89",
        "utilization_pct": "91.25",
        "cohort_gap_pp": "2.13",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.015",
        "weft_breaks_per_1000": "0.097",
        "warp_breaks": 3,
        "weft_breaks": 20,
        "rupee_lost": {
          "value": "413",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 174,
        "loom_no": "SZ-006",
        "loom_type_code": "TS",
        "shed_code": "SULZER",
        "style_code": "30s VSF X 30s VOT /68X57-48\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "31.146",
        "kilo_picks": "69.8950",
        "scheduled_minutes": 480,
        "running_minutes": 446,
        "stopped_minutes": 34,
        "loom_efficiency_pct": "90.26",
        "performance_eff_pct": "97.14",
        "utilization_pct": "92.92",
        "cohort_gap_pp": null,
        "cohort_loom_count": 3,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.057",
        "weft_breaks_per_1000": "0.200",
        "warp_breaks": 4,
        "weft_breaks": 14,
        "rupee_lost": {
          "value": "134",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 2,
        "loom_no": "AJ-002",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.408",
        "kilo_picks": "206.5920",
        "scheduled_minutes": 480,
        "running_minutes": 445,
        "stopped_minutes": 35,
        "loom_efficiency_pct": "90.29",
        "performance_eff_pct": "97.39",
        "utilization_pct": "92.71",
        "cohort_gap_pp": "2.41",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.019",
        "weft_breaks_per_1000": "0.102",
        "warp_breaks": 4,
        "weft_breaks": 21,
        "rupee_lost": {
          "value": "410",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 114,
        "loom_no": "AJ-114",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.438",
        "kilo_picks": "206.6570",
        "scheduled_minutes": 480,
        "running_minutes": 457,
        "stopped_minutes": 23,
        "loom_efficiency_pct": "90.32",
        "performance_eff_pct": "94.87",
        "utilization_pct": "95.21",
        "cohort_gap_pp": "2.44",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.010",
        "weft_breaks_per_1000": "0.087",
        "warp_breaks": 2,
        "weft_breaks": 18,
        "rupee_lost": {
          "value": "409",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 26,
        "loom_no": "AJ-026",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.467",
        "kilo_picks": "206.7200",
        "scheduled_minutes": 480,
        "running_minutes": 437,
        "stopped_minutes": 43,
        "loom_efficiency_pct": "90.35",
        "performance_eff_pct": "99.24",
        "utilization_pct": "91.04",
        "cohort_gap_pp": "2.47",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.024",
        "weft_breaks_per_1000": "0.082",
        "warp_breaks": 5,
        "weft_breaks": 17,
        "rupee_lost": {
          "value": "408",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 168,
        "loom_no": "AJ-168",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.481",
        "kilo_picks": "206.7500",
        "scheduled_minutes": 480,
        "running_minutes": 434,
        "stopped_minutes": 46,
        "loom_efficiency_pct": "90.36",
        "performance_eff_pct": "99.94",
        "utilization_pct": "90.42",
        "cohort_gap_pp": "2.48",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.024",
        "weft_breaks_per_1000": "0.048",
        "warp_breaks": 5,
        "weft_breaks": 10,
        "rupee_lost": {
          "value": "407",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 107,
        "loom_no": "AJ-107",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.537",
        "kilo_picks": "206.8710",
        "scheduled_minutes": 480,
        "running_minutes": 448,
        "stopped_minutes": 32,
        "loom_efficiency_pct": "90.42",
        "performance_eff_pct": "96.87",
        "utilization_pct": "93.33",
        "cohort_gap_pp": "2.31",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.019",
        "weft_breaks_per_1000": "0.077",
        "warp_breaks": 4,
        "weft_breaks": 16,
        "rupee_lost": {
          "value": "405",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 8,
        "loom_no": "AJ-008",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.549",
        "kilo_picks": "206.8980",
        "scheduled_minutes": 480,
        "running_minutes": 439,
        "stopped_minutes": 41,
        "loom_efficiency_pct": "90.43",
        "performance_eff_pct": "98.87",
        "utilization_pct": "91.46",
        "cohort_gap_pp": "2.55",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.019",
        "weft_breaks_per_1000": "0.082",
        "warp_breaks": 4,
        "weft_breaks": 17,
        "rupee_lost": {
          "value": "405",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 36,
        "loom_no": "AJ-036",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.560",
        "kilo_picks": "206.9210",
        "scheduled_minutes": 480,
        "running_minutes": 437,
        "stopped_minutes": 43,
        "loom_efficiency_pct": "90.44",
        "performance_eff_pct": "99.34",
        "utilization_pct": "91.04",
        "cohort_gap_pp": "2.56",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.029",
        "weft_breaks_per_1000": "0.087",
        "warp_breaks": 6,
        "weft_breaks": 18,
        "rupee_lost": {
          "value": "404",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 142,
        "loom_no": "AJ-142",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.573",
        "kilo_picks": "206.9490",
        "scheduled_minutes": 480,
        "running_minutes": 458,
        "stopped_minutes": 22,
        "loom_efficiency_pct": "90.45",
        "performance_eff_pct": "94.79",
        "utilization_pct": "95.42",
        "cohort_gap_pp": "2.57",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.029",
        "weft_breaks_per_1000": "0.082",
        "warp_breaks": 6,
        "weft_breaks": 17,
        "rupee_lost": {
          "value": "404",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 91,
        "loom_no": "AJ-091",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.585",
        "kilo_picks": "206.9760",
        "scheduled_minutes": 480,
        "running_minutes": 445,
        "stopped_minutes": 35,
        "loom_efficiency_pct": "90.46",
        "performance_eff_pct": "97.58",
        "utilization_pct": "92.71",
        "cohort_gap_pp": "2.35",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.029",
        "weft_breaks_per_1000": "0.087",
        "warp_breaks": 6,
        "weft_breaks": 18,
        "rupee_lost": {
          "value": "403",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 149,
        "loom_no": "AJ-149",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.614",
        "kilo_picks": "207.0380",
        "scheduled_minutes": 480,
        "running_minutes": 447,
        "stopped_minutes": 33,
        "loom_efficiency_pct": "90.49",
        "performance_eff_pct": "97.17",
        "utilization_pct": "93.12",
        "cohort_gap_pp": "2.38",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.019",
        "weft_breaks_per_1000": "0.116",
        "warp_breaks": 4,
        "weft_breaks": 24,
        "rupee_lost": {
          "value": "402",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 18,
        "loom_no": "AJ-018",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.626",
        "kilo_picks": "207.0650",
        "scheduled_minutes": 480,
        "running_minutes": 453,
        "stopped_minutes": 27,
        "loom_efficiency_pct": "90.50",
        "performance_eff_pct": "95.89",
        "utilization_pct": "94.38",
        "cohort_gap_pp": "2.62",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.024",
        "weft_breaks_per_1000": "0.048",
        "warp_breaks": 5,
        "weft_breaks": 10,
        "rupee_lost": {
          "value": "402",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 165,
        "loom_no": "AJ-165",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.706",
        "kilo_picks": "207.2370",
        "scheduled_minutes": 480,
        "running_minutes": 447,
        "stopped_minutes": 33,
        "loom_efficiency_pct": "90.57",
        "performance_eff_pct": "97.26",
        "utilization_pct": "93.12",
        "cohort_gap_pp": "2.46",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.019",
        "weft_breaks_per_1000": "0.106",
        "warp_breaks": 4,
        "weft_breaks": 22,
        "rupee_lost": {
          "value": "398",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 100,
        "loom_no": "AJ-100",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.730",
        "kilo_picks": "207.2890",
        "scheduled_minutes": 480,
        "running_minutes": 452,
        "stopped_minutes": 28,
        "loom_efficiency_pct": "90.60",
        "performance_eff_pct": "96.21",
        "utilization_pct": "94.17",
        "cohort_gap_pp": "2.72",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.005",
        "weft_breaks_per_1000": "0.063",
        "warp_breaks": 1,
        "weft_breaks": 13,
        "rupee_lost": {
          "value": "397",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 90,
        "loom_no": "AJ-090",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.765",
        "kilo_picks": "207.3660",
        "scheduled_minutes": 480,
        "running_minutes": 447,
        "stopped_minutes": 33,
        "loom_efficiency_pct": "90.63",
        "performance_eff_pct": "97.32",
        "utilization_pct": "93.12",
        "cohort_gap_pp": "2.75",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.034",
        "weft_breaks_per_1000": "0.087",
        "warp_breaks": 7,
        "weft_breaks": 18,
        "rupee_lost": {
          "value": "396",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 95,
        "loom_no": "AJ-095",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.768",
        "kilo_picks": "207.3720",
        "scheduled_minutes": 480,
        "running_minutes": 445,
        "stopped_minutes": 35,
        "loom_efficiency_pct": "90.63",
        "performance_eff_pct": "97.76",
        "utilization_pct": "92.71",
        "cohort_gap_pp": "2.52",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.019",
        "weft_breaks_per_1000": "0.072",
        "warp_breaks": 4,
        "weft_breaks": 15,
        "rupee_lost": {
          "value": "396",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 119,
        "loom_no": "AJ-119",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.769",
        "kilo_picks": "207.3740",
        "scheduled_minutes": 480,
        "running_minutes": 456,
        "stopped_minutes": 24,
        "loom_efficiency_pct": "90.63",
        "performance_eff_pct": "95.41",
        "utilization_pct": "95.00",
        "cohort_gap_pp": "2.52",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.029",
        "weft_breaks_per_1000": "0.096",
        "warp_breaks": 6,
        "weft_breaks": 20,
        "rupee_lost": {
          "value": "396",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 27,
        "loom_no": "AJ-027",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.775",
        "kilo_picks": "207.3880",
        "scheduled_minutes": 480,
        "running_minutes": 449,
        "stopped_minutes": 31,
        "loom_efficiency_pct": "90.64",
        "performance_eff_pct": "96.90",
        "utilization_pct": "93.54",
        "cohort_gap_pp": "2.53",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.048",
        "weft_breaks_per_1000": "0.072",
        "warp_breaks": 10,
        "weft_breaks": 15,
        "rupee_lost": {
          "value": "396",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 54,
        "loom_no": "AJ-054",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.773",
        "kilo_picks": "207.3820",
        "scheduled_minutes": 480,
        "running_minutes": 435,
        "stopped_minutes": 45,
        "loom_efficiency_pct": "90.64",
        "performance_eff_pct": "100.01",
        "utilization_pct": "90.62",
        "cohort_gap_pp": "2.76",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.019",
        "weft_breaks_per_1000": "0.087",
        "warp_breaks": 4,
        "weft_breaks": 18,
        "rupee_lost": {
          "value": "396",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 121,
        "loom_no": "AJ-121",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.853",
        "kilo_picks": "207.5560",
        "scheduled_minutes": 480,
        "running_minutes": 458,
        "stopped_minutes": 22,
        "loom_efficiency_pct": "90.71",
        "performance_eff_pct": "95.07",
        "utilization_pct": "95.42",
        "cohort_gap_pp": "2.60",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.048",
        "weft_breaks_per_1000": "0.101",
        "warp_breaks": 10,
        "weft_breaks": 21,
        "rupee_lost": {
          "value": "392",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 81,
        "loom_no": "AJ-081",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.856",
        "kilo_picks": "207.5620",
        "scheduled_minutes": 480,
        "running_minutes": 450,
        "stopped_minutes": 30,
        "loom_efficiency_pct": "90.72",
        "performance_eff_pct": "96.76",
        "utilization_pct": "93.75",
        "cohort_gap_pp": "2.61",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.024",
        "weft_breaks_per_1000": "0.067",
        "warp_breaks": 5,
        "weft_breaks": 14,
        "rupee_lost": {
          "value": "392",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 31,
        "loom_no": "AJ-031",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.876",
        "kilo_picks": "207.6050",
        "scheduled_minutes": 480,
        "running_minutes": 456,
        "stopped_minutes": 24,
        "loom_efficiency_pct": "90.74",
        "performance_eff_pct": "95.51",
        "utilization_pct": "95.00",
        "cohort_gap_pp": "2.63",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.029",
        "weft_breaks_per_1000": "0.096",
        "warp_breaks": 6,
        "weft_breaks": 20,
        "rupee_lost": {
          "value": "392",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 136,
        "loom_no": "AJ-136",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.913",
        "kilo_picks": "207.6860",
        "scheduled_minutes": 480,
        "running_minutes": 441,
        "stopped_minutes": 39,
        "loom_efficiency_pct": "90.77",
        "performance_eff_pct": "98.80",
        "utilization_pct": "91.88",
        "cohort_gap_pp": "2.89",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.019",
        "weft_breaks_per_1000": "0.039",
        "warp_breaks": 4,
        "weft_breaks": 8,
        "rupee_lost": {
          "value": "390",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 5,
        "loom_no": "AJ-005",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.920",
        "kilo_picks": "207.7010",
        "scheduled_minutes": 480,
        "running_minutes": 436,
        "stopped_minutes": 44,
        "loom_efficiency_pct": "90.78",
        "performance_eff_pct": "99.94",
        "utilization_pct": "90.83",
        "cohort_gap_pp": "2.67",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.019",
        "weft_breaks_per_1000": "0.087",
        "warp_breaks": 4,
        "weft_breaks": 18,
        "rupee_lost": {
          "value": "390",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 83,
        "loom_no": "AJ-083",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.919",
        "kilo_picks": "207.6990",
        "scheduled_minutes": 480,
        "running_minutes": 443,
        "stopped_minutes": 37,
        "loom_efficiency_pct": "90.78",
        "performance_eff_pct": "98.36",
        "utilization_pct": "92.29",
        "cohort_gap_pp": "2.67",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.024",
        "weft_breaks_per_1000": "0.058",
        "warp_breaks": 5,
        "weft_breaks": 12,
        "rupee_lost": {
          "value": "390",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 141,
        "loom_no": "AJ-141",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.932",
        "kilo_picks": "207.7270",
        "scheduled_minutes": 480,
        "running_minutes": 447,
        "stopped_minutes": 33,
        "loom_efficiency_pct": "90.79",
        "performance_eff_pct": "97.49",
        "utilization_pct": "93.12",
        "cohort_gap_pp": "2.68",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.019",
        "weft_breaks_per_1000": "0.048",
        "warp_breaks": 4,
        "weft_breaks": 10,
        "rupee_lost": {
          "value": "389",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 61,
        "loom_no": "AJ-061",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.947",
        "kilo_picks": "207.7590",
        "scheduled_minutes": 480,
        "running_minutes": 436,
        "stopped_minutes": 44,
        "loom_efficiency_pct": "90.80",
        "performance_eff_pct": "99.97",
        "utilization_pct": "90.83",
        "cohort_gap_pp": "2.69",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.010",
        "weft_breaks_per_1000": "0.053",
        "warp_breaks": 2,
        "weft_breaks": 11,
        "rupee_lost": {
          "value": "389",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 15,
        "loom_no": "AJ-015",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.968",
        "kilo_picks": "207.8040",
        "scheduled_minutes": 480,
        "running_minutes": 453,
        "stopped_minutes": 27,
        "loom_efficiency_pct": "90.82",
        "performance_eff_pct": "96.24",
        "utilization_pct": "94.38",
        "cohort_gap_pp": "2.71",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.019",
        "weft_breaks_per_1000": "0.101",
        "warp_breaks": 4,
        "weft_breaks": 21,
        "rupee_lost": {
          "value": "388",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 94,
        "loom_no": "AJ-094",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "95.987",
        "kilo_picks": "207.8470",
        "scheduled_minutes": 480,
        "running_minutes": 443,
        "stopped_minutes": 37,
        "loom_efficiency_pct": "90.84",
        "performance_eff_pct": "98.43",
        "utilization_pct": "92.29",
        "cohort_gap_pp": "2.96",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.038",
        "weft_breaks_per_1000": "0.101",
        "warp_breaks": 8,
        "weft_breaks": 21,
        "rupee_lost": {
          "value": "387",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 30,
        "loom_no": "AJ-030",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "96.005",
        "kilo_picks": "207.8850",
        "scheduled_minutes": 480,
        "running_minutes": 444,
        "stopped_minutes": 36,
        "loom_efficiency_pct": "90.86",
        "performance_eff_pct": "98.23",
        "utilization_pct": "92.50",
        "cohort_gap_pp": "2.98",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.024",
        "weft_breaks_per_1000": "0.106",
        "warp_breaks": 5,
        "weft_breaks": 22,
        "rupee_lost": {
          "value": "386",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 39,
        "loom_no": "AJ-039",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "96.133",
        "kilo_picks": "208.1630",
        "scheduled_minutes": 480,
        "running_minutes": 453,
        "stopped_minutes": 27,
        "loom_efficiency_pct": "90.98",
        "performance_eff_pct": "96.40",
        "utilization_pct": "94.38",
        "cohort_gap_pp": "2.87",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.029",
        "weft_breaks_per_1000": "0.082",
        "warp_breaks": 6,
        "weft_breaks": 17,
        "rupee_lost": {
          "value": "381",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 17,
        "loom_no": "AJ-017",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "96.145",
        "kilo_picks": "208.1880",
        "scheduled_minutes": 480,
        "running_minutes": 450,
        "stopped_minutes": 30,
        "loom_efficiency_pct": "90.99",
        "performance_eff_pct": "97.06",
        "utilization_pct": "93.75",
        "cohort_gap_pp": "2.88",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.019",
        "weft_breaks_per_1000": "0.096",
        "warp_breaks": 4,
        "weft_breaks": 20,
        "rupee_lost": {
          "value": "381",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 63,
        "loom_no": "AJ-063",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "96.157",
        "kilo_picks": "208.2150",
        "scheduled_minutes": 480,
        "running_minutes": 456,
        "stopped_minutes": 24,
        "loom_efficiency_pct": "91.00",
        "performance_eff_pct": "95.79",
        "utilization_pct": "95.00",
        "cohort_gap_pp": "2.89",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.014",
        "weft_breaks_per_1000": "0.096",
        "warp_breaks": 3,
        "weft_breaks": 20,
        "rupee_lost": {
          "value": "380",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 155,
        "loom_no": "AJ-155",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "96.220",
        "kilo_picks": "208.3510",
        "scheduled_minutes": 480,
        "running_minutes": 452,
        "stopped_minutes": 28,
        "loom_efficiency_pct": "91.06",
        "performance_eff_pct": "96.70",
        "utilization_pct": "94.17",
        "cohort_gap_pp": "2.95",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.034",
        "weft_breaks_per_1000": "0.067",
        "warp_breaks": 7,
        "weft_breaks": 14,
        "rupee_lost": {
          "value": "378",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 89,
        "loom_no": "AJ-089",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "96.278",
        "kilo_picks": "208.4770",
        "scheduled_minutes": 480,
        "running_minutes": 444,
        "stopped_minutes": 36,
        "loom_efficiency_pct": "91.12",
        "performance_eff_pct": "98.50",
        "utilization_pct": "92.50",
        "cohort_gap_pp": "3.01",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.043",
        "weft_breaks_per_1000": "0.096",
        "warp_breaks": 9,
        "weft_breaks": 20,
        "rupee_lost": {
          "value": "375",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 77,
        "loom_no": "AJ-077",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "96.337",
        "kilo_picks": "208.6040",
        "scheduled_minutes": 480,
        "running_minutes": 457,
        "stopped_minutes": 23,
        "loom_efficiency_pct": "91.17",
        "performance_eff_pct": "95.76",
        "utilization_pct": "95.21",
        "cohort_gap_pp": "3.06",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.014",
        "weft_breaks_per_1000": "0.086",
        "warp_breaks": 3,
        "weft_breaks": 18,
        "rupee_lost": {
          "value": "373",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 160,
        "loom_no": "AJ-160",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "96.399",
        "kilo_picks": "208.7390",
        "scheduled_minutes": 480,
        "running_minutes": 453,
        "stopped_minutes": 27,
        "loom_efficiency_pct": "91.23",
        "performance_eff_pct": "96.67",
        "utilization_pct": "94.38",
        "cohort_gap_pp": "3.35",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.034",
        "weft_breaks_per_1000": "0.067",
        "warp_breaks": 7,
        "weft_breaks": 14,
        "rupee_lost": {
          "value": "371",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 159,
        "loom_no": "AJ-159",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "96.407",
        "kilo_picks": "208.7550",
        "scheduled_minutes": 480,
        "running_minutes": 451,
        "stopped_minutes": 29,
        "loom_efficiency_pct": "91.24",
        "performance_eff_pct": "97.11",
        "utilization_pct": "93.96",
        "cohort_gap_pp": "3.13",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.024",
        "weft_breaks_per_1000": "0.077",
        "warp_breaks": 5,
        "weft_breaks": 16,
        "rupee_lost": {
          "value": "370",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 166,
        "loom_no": "AJ-166",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "96.479",
        "kilo_picks": "208.9120",
        "scheduled_minutes": 480,
        "running_minutes": 448,
        "stopped_minutes": 32,
        "loom_efficiency_pct": "91.31",
        "performance_eff_pct": "97.83",
        "utilization_pct": "93.33",
        "cohort_gap_pp": "3.43",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.000",
        "weft_breaks_per_1000": "0.077",
        "warp_breaks": 0,
        "weft_breaks": 16,
        "rupee_lost": {
          "value": "367",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 123,
        "loom_no": "AJ-123",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "96.521",
        "kilo_picks": "209.0020",
        "scheduled_minutes": 480,
        "running_minutes": 443,
        "stopped_minutes": 37,
        "loom_efficiency_pct": "91.35",
        "performance_eff_pct": "98.98",
        "utilization_pct": "92.29",
        "cohort_gap_pp": "3.24",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.029",
        "weft_breaks_per_1000": "0.096",
        "warp_breaks": 6,
        "weft_breaks": 20,
        "rupee_lost": {
          "value": "366",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 57,
        "loom_no": "AJ-057",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "96.587",
        "kilo_picks": "209.1460",
        "scheduled_minutes": 480,
        "running_minutes": 450,
        "stopped_minutes": 30,
        "loom_efficiency_pct": "91.41",
        "performance_eff_pct": "97.50",
        "utilization_pct": "93.75",
        "cohort_gap_pp": "3.30",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.043",
        "weft_breaks_per_1000": "0.086",
        "warp_breaks": 9,
        "weft_breaks": 18,
        "rupee_lost": {
          "value": "363",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 133,
        "loom_no": "AJ-133",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "96.638",
        "kilo_picks": "209.2560",
        "scheduled_minutes": 480,
        "running_minutes": 459,
        "stopped_minutes": 21,
        "loom_efficiency_pct": "91.46",
        "performance_eff_pct": "95.64",
        "utilization_pct": "95.62",
        "cohort_gap_pp": "3.35",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.014",
        "weft_breaks_per_1000": "0.076",
        "warp_breaks": 3,
        "weft_breaks": 16,
        "rupee_lost": {
          "value": "361",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 34,
        "loom_no": "AJ-034",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "96.674",
        "kilo_picks": "209.3330",
        "scheduled_minutes": 480,
        "running_minutes": 463,
        "stopped_minutes": 17,
        "loom_efficiency_pct": "91.49",
        "performance_eff_pct": "94.85",
        "utilization_pct": "96.46",
        "cohort_gap_pp": "3.61",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.033",
        "weft_breaks_per_1000": "0.100",
        "warp_breaks": 7,
        "weft_breaks": 21,
        "rupee_lost": {
          "value": "360",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 104,
        "loom_no": "AJ-104",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "96.709",
        "kilo_picks": "209.4090",
        "scheduled_minutes": 480,
        "running_minutes": 449,
        "stopped_minutes": 31,
        "loom_efficiency_pct": "91.52",
        "performance_eff_pct": "97.84",
        "utilization_pct": "93.54",
        "cohort_gap_pp": "3.64",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.033",
        "weft_breaks_per_1000": "0.076",
        "warp_breaks": 7,
        "weft_breaks": 16,
        "rupee_lost": {
          "value": "358",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 19,
        "loom_no": "AJ-019",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "96.764",
        "kilo_picks": "209.5290",
        "scheduled_minutes": 480,
        "running_minutes": 454,
        "stopped_minutes": 26,
        "loom_efficiency_pct": "91.58",
        "performance_eff_pct": "96.82",
        "utilization_pct": "94.58",
        "cohort_gap_pp": "3.47",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.029",
        "weft_breaks_per_1000": "0.115",
        "warp_breaks": 6,
        "weft_breaks": 24,
        "rupee_lost": {
          "value": "356",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 11,
        "loom_no": "AJ-011",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "96.777",
        "kilo_picks": "209.5570",
        "scheduled_minutes": 480,
        "running_minutes": 459,
        "stopped_minutes": 21,
        "loom_efficiency_pct": "91.59",
        "performance_eff_pct": "95.78",
        "utilization_pct": "95.62",
        "cohort_gap_pp": "3.48",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.024",
        "weft_breaks_per_1000": "0.086",
        "warp_breaks": 5,
        "weft_breaks": 18,
        "rupee_lost": {
          "value": "356",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 62,
        "loom_no": "AJ-062",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "96.790",
        "kilo_picks": "209.5840",
        "scheduled_minutes": 480,
        "running_minutes": 460,
        "stopped_minutes": 20,
        "loom_efficiency_pct": "91.60",
        "performance_eff_pct": "95.58",
        "utilization_pct": "95.83",
        "cohort_gap_pp": "3.72",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.014",
        "weft_breaks_per_1000": "0.062",
        "warp_breaks": 3,
        "weft_breaks": 13,
        "rupee_lost": {
          "value": "355",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 68,
        "loom_no": "AJ-068",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "96.806",
        "kilo_picks": "209.6190",
        "scheduled_minutes": 480,
        "running_minutes": 450,
        "stopped_minutes": 30,
        "loom_efficiency_pct": "91.62",
        "performance_eff_pct": "97.72",
        "utilization_pct": "93.75",
        "cohort_gap_pp": "3.74",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.024",
        "weft_breaks_per_1000": "0.095",
        "warp_breaks": 5,
        "weft_breaks": 20,
        "rupee_lost": {
          "value": "354",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 101,
        "loom_no": "AJ-101",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "96.820",
        "kilo_picks": "209.6500",
        "scheduled_minutes": 480,
        "running_minutes": 454,
        "stopped_minutes": 26,
        "loom_efficiency_pct": "91.63",
        "performance_eff_pct": "96.88",
        "utilization_pct": "94.58",
        "cohort_gap_pp": "3.52",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.024",
        "weft_breaks_per_1000": "0.134",
        "warp_breaks": 5,
        "weft_breaks": 28,
        "rupee_lost": {
          "value": "354",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 44,
        "loom_no": "AJ-044",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "96.837",
        "kilo_picks": "209.6870",
        "scheduled_minutes": 480,
        "running_minutes": 458,
        "stopped_minutes": 22,
        "loom_efficiency_pct": "91.65",
        "performance_eff_pct": "96.05",
        "utilization_pct": "95.42",
        "cohort_gap_pp": "3.77",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.029",
        "weft_breaks_per_1000": "0.091",
        "warp_breaks": 6,
        "weft_breaks": 19,
        "rupee_lost": {
          "value": "353",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 164,
        "loom_no": "AJ-164",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "96.876",
        "kilo_picks": "209.7720",
        "scheduled_minutes": 480,
        "running_minutes": 454,
        "stopped_minutes": 26,
        "loom_efficiency_pct": "91.68",
        "performance_eff_pct": "96.93",
        "utilization_pct": "94.58",
        "cohort_gap_pp": "3.80",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.024",
        "weft_breaks_per_1000": "0.038",
        "warp_breaks": 5,
        "weft_breaks": 8,
        "rupee_lost": {
          "value": "352",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 99,
        "loom_no": "AJ-099",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "96.918",
        "kilo_picks": "209.8610",
        "scheduled_minutes": 480,
        "running_minutes": 456,
        "stopped_minutes": 24,
        "loom_efficiency_pct": "91.72",
        "performance_eff_pct": "96.55",
        "utilization_pct": "95.00",
        "cohort_gap_pp": "3.61",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.019",
        "weft_breaks_per_1000": "0.105",
        "warp_breaks": 4,
        "weft_breaks": 22,
        "rupee_lost": {
          "value": "350",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 56,
        "loom_no": "AJ-056",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "97.057",
        "kilo_picks": "210.1640",
        "scheduled_minutes": 480,
        "running_minutes": 455,
        "stopped_minutes": 25,
        "loom_efficiency_pct": "91.85",
        "performance_eff_pct": "96.90",
        "utilization_pct": "94.79",
        "cohort_gap_pp": "3.97",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.029",
        "weft_breaks_per_1000": "0.076",
        "warp_breaks": 6,
        "weft_breaks": 16,
        "rupee_lost": {
          "value": "344",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 65,
        "loom_no": "AJ-065",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "97.069",
        "kilo_picks": "210.1890",
        "scheduled_minutes": 480,
        "running_minutes": 459,
        "stopped_minutes": 21,
        "loom_efficiency_pct": "91.87",
        "performance_eff_pct": "96.07",
        "utilization_pct": "95.62",
        "cohort_gap_pp": "3.76",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.019",
        "weft_breaks_per_1000": "0.081",
        "warp_breaks": 4,
        "weft_breaks": 17,
        "rupee_lost": {
          "value": "344",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 58,
        "loom_no": "AJ-058",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "97.107",
        "kilo_picks": "210.2720",
        "scheduled_minutes": 480,
        "running_minutes": 448,
        "stopped_minutes": 32,
        "loom_efficiency_pct": "91.90",
        "performance_eff_pct": "98.47",
        "utilization_pct": "93.33",
        "cohort_gap_pp": "4.02",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.019",
        "weft_breaks_per_1000": "0.067",
        "warp_breaks": 4,
        "weft_breaks": 14,
        "rupee_lost": {
          "value": "342",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 85,
        "loom_no": "AJ-085",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "97.156",
        "kilo_picks": "210.3780",
        "scheduled_minutes": 480,
        "running_minutes": 457,
        "stopped_minutes": 23,
        "loom_efficiency_pct": "91.95",
        "performance_eff_pct": "96.58",
        "utilization_pct": "95.21",
        "cohort_gap_pp": "3.84",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.019",
        "weft_breaks_per_1000": "0.100",
        "warp_breaks": 4,
        "weft_breaks": 21,
        "rupee_lost": {
          "value": "340",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 93,
        "loom_no": "AJ-093",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "97.205",
        "kilo_picks": "210.4840",
        "scheduled_minutes": 480,
        "running_minutes": 446,
        "stopped_minutes": 34,
        "loom_efficiency_pct": "91.99",
        "performance_eff_pct": "99.01",
        "utilization_pct": "92.92",
        "cohort_gap_pp": "3.88",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.024",
        "weft_breaks_per_1000": "0.152",
        "warp_breaks": 5,
        "weft_breaks": 32,
        "rupee_lost": {
          "value": "338",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 60,
        "loom_no": "AJ-060",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "97.385",
        "kilo_picks": "210.8730",
        "scheduled_minutes": 480,
        "running_minutes": 443,
        "stopped_minutes": 37,
        "loom_efficiency_pct": "92.16",
        "performance_eff_pct": "99.86",
        "utilization_pct": "92.29",
        "cohort_gap_pp": "4.28",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.019",
        "weft_breaks_per_1000": "0.095",
        "warp_breaks": 4,
        "weft_breaks": 20,
        "rupee_lost": {
          "value": "331",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 73,
        "loom_no": "AJ-073",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "97.405",
        "kilo_picks": "210.9160",
        "scheduled_minutes": 480,
        "running_minutes": 462,
        "stopped_minutes": 18,
        "loom_efficiency_pct": "92.18",
        "performance_eff_pct": "95.77",
        "utilization_pct": "96.25",
        "cohort_gap_pp": "4.07",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.009",
        "weft_breaks_per_1000": "0.062",
        "warp_breaks": 2,
        "weft_breaks": 13,
        "rupee_lost": {
          "value": "330",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 122,
        "loom_no": "AJ-122",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "97.415",
        "kilo_picks": "210.9380",
        "scheduled_minutes": 480,
        "running_minutes": 449,
        "stopped_minutes": 31,
        "loom_efficiency_pct": "92.19",
        "performance_eff_pct": "98.56",
        "utilization_pct": "93.54",
        "cohort_gap_pp": "4.31",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.024",
        "weft_breaks_per_1000": "0.114",
        "warp_breaks": 5,
        "weft_breaks": 24,
        "rupee_lost": {
          "value": "330",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 108,
        "loom_no": "AJ-108",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "97.543",
        "kilo_picks": "211.2150",
        "scheduled_minutes": 480,
        "running_minutes": 461,
        "stopped_minutes": 19,
        "loom_efficiency_pct": "92.31",
        "performance_eff_pct": "96.12",
        "utilization_pct": "96.04",
        "cohort_gap_pp": "4.43",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.033",
        "weft_breaks_per_1000": "0.109",
        "warp_breaks": 7,
        "weft_breaks": 23,
        "rupee_lost": {
          "value": "325",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 53,
        "loom_no": "AJ-053",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "97.622",
        "kilo_picks": "211.3860",
        "scheduled_minutes": 480,
        "running_minutes": 461,
        "stopped_minutes": 19,
        "loom_efficiency_pct": "92.39",
        "performance_eff_pct": "96.20",
        "utilization_pct": "96.04",
        "cohort_gap_pp": "4.28",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.019",
        "weft_breaks_per_1000": "0.076",
        "warp_breaks": 4,
        "weft_breaks": 16,
        "rupee_lost": {
          "value": "322",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 74,
        "loom_no": "AJ-074",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "97.635",
        "kilo_picks": "211.4150",
        "scheduled_minutes": 480,
        "running_minutes": 459,
        "stopped_minutes": 21,
        "loom_efficiency_pct": "92.40",
        "performance_eff_pct": "96.63",
        "utilization_pct": "95.62",
        "cohort_gap_pp": "4.52",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.024",
        "weft_breaks_per_1000": "0.085",
        "warp_breaks": 5,
        "weft_breaks": 18,
        "rupee_lost": {
          "value": "321",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 98,
        "loom_no": "AJ-098",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "97.650",
        "kilo_picks": "211.4470",
        "scheduled_minutes": 480,
        "running_minutes": 446,
        "stopped_minutes": 34,
        "loom_efficiency_pct": "92.42",
        "performance_eff_pct": "99.46",
        "utilization_pct": "92.92",
        "cohort_gap_pp": "4.54",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.024",
        "weft_breaks_per_1000": "0.090",
        "warp_breaks": 5,
        "weft_breaks": 19,
        "rupee_lost": {
          "value": "321",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 151,
        "loom_no": "AJ-151",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "97.660",
        "kilo_picks": "211.4680",
        "scheduled_minutes": 480,
        "running_minutes": 461,
        "stopped_minutes": 19,
        "loom_efficiency_pct": "92.42",
        "performance_eff_pct": "96.23",
        "utilization_pct": "96.04",
        "cohort_gap_pp": "4.31",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.038",
        "weft_breaks_per_1000": "0.057",
        "warp_breaks": 8,
        "weft_breaks": 12,
        "rupee_lost": {
          "value": "320",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 86,
        "loom_no": "AJ-086",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "97.665",
        "kilo_picks": "211.4800",
        "scheduled_minutes": 480,
        "running_minutes": 464,
        "stopped_minutes": 16,
        "loom_efficiency_pct": "92.43",
        "performance_eff_pct": "95.62",
        "utilization_pct": "96.67",
        "cohort_gap_pp": "4.55",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.000",
        "weft_breaks_per_1000": "0.061",
        "warp_breaks": 0,
        "weft_breaks": 13,
        "rupee_lost": {
          "value": "320",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 1,
        "loom_no": "AJ-001",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "97.723",
        "kilo_picks": "211.6060",
        "scheduled_minutes": 480,
        "running_minutes": 458,
        "stopped_minutes": 22,
        "loom_efficiency_pct": "92.48",
        "performance_eff_pct": "96.93",
        "utilization_pct": "95.42",
        "cohort_gap_pp": "4.37",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.014",
        "weft_breaks_per_1000": "0.071",
        "warp_breaks": 3,
        "weft_breaks": 15,
        "rupee_lost": {
          "value": "318",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 12,
        "loom_no": "AJ-012",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "97.731",
        "kilo_picks": "211.6230",
        "scheduled_minutes": 480,
        "running_minutes": 461,
        "stopped_minutes": 19,
        "loom_efficiency_pct": "92.49",
        "performance_eff_pct": "96.30",
        "utilization_pct": "96.04",
        "cohort_gap_pp": "4.61",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.000",
        "weft_breaks_per_1000": "0.076",
        "warp_breaks": 0,
        "weft_breaks": 16,
        "rupee_lost": {
          "value": "317",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 116,
        "loom_no": "AJ-116",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "97.730",
        "kilo_picks": "211.6200",
        "scheduled_minutes": 480,
        "running_minutes": 464,
        "stopped_minutes": 16,
        "loom_efficiency_pct": "92.49",
        "performance_eff_pct": "95.68",
        "utilization_pct": "96.67",
        "cohort_gap_pp": "4.61",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.024",
        "weft_breaks_per_1000": "0.043",
        "warp_breaks": 5,
        "weft_breaks": 9,
        "rupee_lost": {
          "value": "317",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 120,
        "loom_no": "AJ-120",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "97.849",
        "kilo_picks": "211.8790",
        "scheduled_minutes": 480,
        "running_minutes": 461,
        "stopped_minutes": 19,
        "loom_efficiency_pct": "92.60",
        "performance_eff_pct": "96.42",
        "utilization_pct": "96.04",
        "cohort_gap_pp": "4.72",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.033",
        "weft_breaks_per_1000": "0.071",
        "warp_breaks": 7,
        "weft_breaks": 15,
        "rupee_lost": {
          "value": "313",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 16,
        "loom_no": "AJ-016",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "97.852",
        "kilo_picks": "211.8850",
        "scheduled_minutes": 480,
        "running_minutes": 459,
        "stopped_minutes": 21,
        "loom_efficiency_pct": "92.61",
        "performance_eff_pct": "96.84",
        "utilization_pct": "95.62",
        "cohort_gap_pp": "4.73",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.028",
        "weft_breaks_per_1000": "0.071",
        "warp_breaks": 6,
        "weft_breaks": 15,
        "rupee_lost": {
          "value": "313",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 52,
        "loom_no": "AJ-052",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "97.956",
        "kilo_picks": "212.1100",
        "scheduled_minutes": 480,
        "running_minutes": 476,
        "stopped_minutes": 4,
        "loom_efficiency_pct": "92.70",
        "performance_eff_pct": "93.48",
        "utilization_pct": "99.17",
        "cohort_gap_pp": "4.82",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.047",
        "weft_breaks_per_1000": "0.113",
        "warp_breaks": 10,
        "weft_breaks": 24,
        "rupee_lost": {
          "value": "308",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 152,
        "loom_no": "AJ-152",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "97.951",
        "kilo_picks": "212.0990",
        "scheduled_minutes": 480,
        "running_minutes": 464,
        "stopped_minutes": 16,
        "loom_efficiency_pct": "92.70",
        "performance_eff_pct": "95.90",
        "utilization_pct": "96.67",
        "cohort_gap_pp": "4.82",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.033",
        "weft_breaks_per_1000": "0.066",
        "warp_breaks": 7,
        "weft_breaks": 14,
        "rupee_lost": {
          "value": "309",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 115,
        "loom_no": "AJ-115",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "97.990",
        "kilo_picks": "212.1840",
        "scheduled_minutes": 480,
        "running_minutes": 446,
        "stopped_minutes": 34,
        "loom_efficiency_pct": "92.74",
        "performance_eff_pct": "99.81",
        "utilization_pct": "92.92",
        "cohort_gap_pp": "4.63",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.024",
        "weft_breaks_per_1000": "0.066",
        "warp_breaks": 5,
        "weft_breaks": 14,
        "rupee_lost": {
          "value": "307",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 131,
        "loom_no": "AJ-131",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "98.064",
        "kilo_picks": "212.3430",
        "scheduled_minutes": 480,
        "running_minutes": 465,
        "stopped_minutes": 15,
        "loom_efficiency_pct": "92.81",
        "performance_eff_pct": "95.80",
        "utilization_pct": "96.88",
        "cohort_gap_pp": "4.70",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.005",
        "weft_breaks_per_1000": "0.080",
        "warp_breaks": 1,
        "weft_breaks": 17,
        "rupee_lost": {
          "value": "304",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 163,
        "loom_no": "AJ-163",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "98.093",
        "kilo_picks": "212.4070",
        "scheduled_minutes": 480,
        "running_minutes": 465,
        "stopped_minutes": 15,
        "loom_efficiency_pct": "92.83",
        "performance_eff_pct": "95.83",
        "utilization_pct": "96.88",
        "cohort_gap_pp": "4.72",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.019",
        "weft_breaks_per_1000": "0.089",
        "warp_breaks": 4,
        "weft_breaks": 19,
        "rupee_lost": {
          "value": "303",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 158,
        "loom_no": "AJ-158",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "98.363",
        "kilo_picks": "212.9900",
        "scheduled_minutes": 480,
        "running_minutes": 459,
        "stopped_minutes": 21,
        "loom_efficiency_pct": "93.09",
        "performance_eff_pct": "97.35",
        "utilization_pct": "95.62",
        "cohort_gap_pp": "5.21",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.019",
        "weft_breaks_per_1000": "0.056",
        "warp_breaks": 4,
        "weft_breaks": 12,
        "rupee_lost": {
          "value": "292",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 22,
        "loom_no": "AJ-022",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "98.534",
        "kilo_picks": "213.3610",
        "scheduled_minutes": 480,
        "running_minutes": 463,
        "stopped_minutes": 17,
        "loom_efficiency_pct": "93.25",
        "performance_eff_pct": "96.68",
        "utilization_pct": "96.46",
        "cohort_gap_pp": "5.37",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.000",
        "weft_breaks_per_1000": "0.089",
        "warp_breaks": 0,
        "weft_breaks": 19,
        "rupee_lost": {
          "value": "285",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 125,
        "loom_no": "AJ-125",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "98.578",
        "kilo_picks": "213.4560",
        "scheduled_minutes": 480,
        "running_minutes": 458,
        "stopped_minutes": 22,
        "loom_efficiency_pct": "93.29",
        "performance_eff_pct": "97.77",
        "utilization_pct": "95.42",
        "cohort_gap_pp": "5.18",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.028",
        "weft_breaks_per_1000": "0.061",
        "warp_breaks": 6,
        "weft_breaks": 13,
        "rupee_lost": {
          "value": "283",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 126,
        "loom_no": "AJ-126",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "98.684",
        "kilo_picks": "213.6850",
        "scheduled_minutes": 480,
        "running_minutes": 463,
        "stopped_minutes": 17,
        "loom_efficiency_pct": "93.39",
        "performance_eff_pct": "96.82",
        "utilization_pct": "96.46",
        "cohort_gap_pp": "5.51",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.028",
        "weft_breaks_per_1000": "0.084",
        "warp_breaks": 6,
        "weft_breaks": 18,
        "rupee_lost": {
          "value": "279",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 40,
        "loom_no": "AJ-040",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "98.884",
        "kilo_picks": "214.1190",
        "scheduled_minutes": 480,
        "running_minutes": 457,
        "stopped_minutes": 23,
        "loom_efficiency_pct": "93.58",
        "performance_eff_pct": "98.29",
        "utilization_pct": "95.21",
        "cohort_gap_pp": "5.70",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.014",
        "weft_breaks_per_1000": "0.093",
        "warp_breaks": 3,
        "weft_breaks": 20,
        "rupee_lost": {
          "value": "271",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 35,
        "loom_no": "AJ-035",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "98.941",
        "kilo_picks": "214.2420",
        "scheduled_minutes": 480,
        "running_minutes": 469,
        "stopped_minutes": 11,
        "loom_efficiency_pct": "93.64",
        "performance_eff_pct": "95.83",
        "utilization_pct": "97.71",
        "cohort_gap_pp": "5.53",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.019",
        "weft_breaks_per_1000": "0.103",
        "warp_breaks": 4,
        "weft_breaks": 22,
        "rupee_lost": {
          "value": "269",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 161,
        "loom_no": "AJ-161",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "99.072",
        "kilo_picks": "214.5260",
        "scheduled_minutes": 480,
        "running_minutes": 477,
        "stopped_minutes": 3,
        "loom_efficiency_pct": "93.76",
        "performance_eff_pct": "94.35",
        "utilization_pct": "99.38",
        "cohort_gap_pp": "5.65",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.014",
        "weft_breaks_per_1000": "0.084",
        "warp_breaks": 3,
        "weft_breaks": 18,
        "rupee_lost": {
          "value": "264",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 42,
        "loom_no": "AJ-042",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "99.186",
        "kilo_picks": "214.7720",
        "scheduled_minutes": 480,
        "running_minutes": 468,
        "stopped_minutes": 12,
        "loom_efficiency_pct": "93.87",
        "performance_eff_pct": "96.28",
        "utilization_pct": "97.50",
        "cohort_gap_pp": "5.99",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.023",
        "weft_breaks_per_1000": "0.051",
        "warp_breaks": 5,
        "weft_breaks": 11,
        "rupee_lost": {
          "value": "259",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 47,
        "loom_no": "AJ-047",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "99.361",
        "kilo_picks": "215.1510",
        "scheduled_minutes": 480,
        "running_minutes": 461,
        "stopped_minutes": 19,
        "loom_efficiency_pct": "94.03",
        "performance_eff_pct": "97.91",
        "utilization_pct": "96.04",
        "cohort_gap_pp": "5.92",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.005",
        "weft_breaks_per_1000": "0.079",
        "warp_breaks": 1,
        "weft_breaks": 17,
        "rupee_lost": {
          "value": "252",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 112,
        "loom_no": "AJ-112",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "99.372",
        "kilo_picks": "215.1750",
        "scheduled_minutes": 480,
        "running_minutes": 457,
        "stopped_minutes": 23,
        "loom_efficiency_pct": "94.04",
        "performance_eff_pct": "98.78",
        "utilization_pct": "95.21",
        "cohort_gap_pp": "6.16",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.019",
        "weft_breaks_per_1000": "0.051",
        "warp_breaks": 4,
        "weft_breaks": 11,
        "rupee_lost": {
          "value": "252",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 106,
        "loom_no": "AJ-106",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "99.769",
        "kilo_picks": "216.0360",
        "scheduled_minutes": 480,
        "running_minutes": 474,
        "stopped_minutes": 6,
        "loom_efficiency_pct": "94.42",
        "performance_eff_pct": "95.62",
        "utilization_pct": "98.75",
        "cohort_gap_pp": "6.54",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.019",
        "weft_breaks_per_1000": "0.097",
        "warp_breaks": 4,
        "weft_breaks": 21,
        "rupee_lost": {
          "value": "236",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 153,
        "loom_no": "AJ-153",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "99.857",
        "kilo_picks": "216.2250",
        "scheduled_minutes": 480,
        "running_minutes": 475,
        "stopped_minutes": 5,
        "loom_efficiency_pct": "94.50",
        "performance_eff_pct": "95.50",
        "utilization_pct": "98.96",
        "cohort_gap_pp": "6.39",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.009",
        "weft_breaks_per_1000": "0.051",
        "warp_breaks": 2,
        "weft_breaks": 11,
        "rupee_lost": {
          "value": "232",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 105,
        "loom_no": "AJ-105",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "99.972",
        "kilo_picks": "216.4740",
        "scheduled_minutes": 480,
        "running_minutes": 457,
        "stopped_minutes": 23,
        "loom_efficiency_pct": "94.61",
        "performance_eff_pct": "99.37",
        "utilization_pct": "95.21",
        "cohort_gap_pp": "6.50",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.018",
        "weft_breaks_per_1000": "0.046",
        "warp_breaks": 4,
        "weft_breaks": 10,
        "rupee_lost": {
          "value": "228",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 102,
        "loom_no": "AJ-102",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "100.093",
        "kilo_picks": "216.7380",
        "scheduled_minutes": 480,
        "running_minutes": 475,
        "stopped_minutes": 5,
        "loom_efficiency_pct": "94.73",
        "performance_eff_pct": "95.72",
        "utilization_pct": "98.96",
        "cohort_gap_pp": "6.85",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.032",
        "weft_breaks_per_1000": "0.102",
        "warp_breaks": 7,
        "weft_breaks": 22,
        "rupee_lost": {
          "value": "223",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 145,
        "loom_no": "AJ-145",
        "loom_type_code": "910",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "100.795",
        "kilo_picks": "218.2560",
        "scheduled_minutes": 480,
        "running_minutes": 476,
        "stopped_minutes": 4,
        "loom_efficiency_pct": "95.39",
        "performance_eff_pct": "96.19",
        "utilization_pct": "99.17",
        "cohort_gap_pp": "7.28",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.032",
        "weft_breaks_per_1000": "0.092",
        "warp_breaks": 7,
        "weft_breaks": 20,
        "rupee_lost": {
          "value": "195",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 162,
        "loom_no": "AJ-162",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "101.127",
        "kilo_picks": "218.9770",
        "scheduled_minutes": 480,
        "running_minutes": 480,
        "stopped_minutes": 0,
        "loom_efficiency_pct": "95.71",
        "performance_eff_pct": "95.71",
        "utilization_pct": "100.00",
        "cohort_gap_pp": "7.83",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.023",
        "weft_breaks_per_1000": "0.096",
        "warp_breaks": 5,
        "weft_breaks": 21,
        "rupee_lost": {
          "value": "182",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 10,
        "loom_no": "AJ-010",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "101.835",
        "kilo_picks": "220.5090",
        "scheduled_minutes": 480,
        "running_minutes": 467,
        "stopped_minutes": 13,
        "loom_efficiency_pct": "96.38",
        "performance_eff_pct": "99.06",
        "utilization_pct": "97.29",
        "cohort_gap_pp": "8.50",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.023",
        "weft_breaks_per_1000": "0.077",
        "warp_breaks": 5,
        "weft_breaks": 17,
        "rupee_lost": {
          "value": "153",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      },
      {
        "loom_id": 84,
        "loom_no": "AJ-084",
        "loom_type_code": "810",
        "shed_code": "AIRJET",
        "style_code": "30s VSF X 30s VSF /66X55&43&57-63\" Plain",
        "shift_code": "1",
        "weaver_name": null,
        "metres": "101.999",
        "kilo_picks": "220.8650",
        "scheduled_minutes": 480,
        "running_minutes": 480,
        "stopped_minutes": 0,
        "loom_efficiency_pct": "96.53",
        "performance_eff_pct": "96.53",
        "utilization_pct": "100.00",
        "cohort_gap_pp": "8.65",
        "cohort_loom_count": 84,
        "cohort_window": "30d",
        "warp_breaks_per_1000": "0.027",
        "weft_breaks_per_1000": "0.054",
        "warp_breaks": 6,
        "weft_breaks": 12,
        "rupee_lost": {
          "value": "147",
          "rate_source": "ESTIMATED",
          "rate_basis": "Rs.40.00/metre -- placeholder rate card"
        },
        "status": "GREEN"
      }
    ],
    "total": 192,
    "page": 1,
    "page_size": 192
  }
};
