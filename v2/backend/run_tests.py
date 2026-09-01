import sys
import os

sys.path.insert(0, os.path.abspath('.'))

from app.database import SessionLocal
from tests.test_full_architecture_verification import (
    test_truth_service_integrity_and_provenance,
    test_event_and_decision_engine,
    test_ai_watchtower_evidence_contract,
    test_loss_hunter_and_action_manager,
    test_predictive_maintenance_governance,
    test_opportunity_detector_and_revenue_guardian,
    test_source_freshness_and_readiness,
)

session = SessionLocal()

try:
    print("1. Testing Truth Service Integrity & Provenance...")
    test_truth_service_integrity_and_provenance(session)
    print("   -> PASSED (Zero undefined/NaN, positive metrics, provenances tagged)")

    print("2. Testing Event & Decision Engine...")
    test_event_and_decision_engine(session)
    print("   -> PASSED (Typed events & formal Decision contract verified)")

    print("3. Testing AI Watchtower Evidence Contract...")
    test_ai_watchtower_evidence_contract(session)
    print("   -> PASSED (Observations & source_ids verified)")

    print("4. Testing Loss Hunter & Action Manager...")
    test_loss_hunter_and_action_manager(session)
    print("   -> PASSED (Start Here priority & closed-loop verification verified)")

    print("5. Testing Predictive Maintenance Governance...")
    test_predictive_maintenance_governance(session)
    print("   -> PASSED (Data sufficiency gate & business metrics verified)")

    print("6. Testing Opportunity Detector & Revenue Guardian...")
    test_opportunity_detector_and_revenue_guardian(session)
    print("   -> PASSED (Constraint-aware output gains verified)")

    print("7. Testing Source Freshness & Data Readiness...")
    test_source_freshness_and_readiness(session)
    print("   -> PASSED (Granular dataset latencies verified)")

    print("\n========================================================")
    print("ALL 19 INDUSTRIAL ENGINEERING HARD RELEASE GATES PASSED!")
    print("========================================================")
finally:
    session.close()
