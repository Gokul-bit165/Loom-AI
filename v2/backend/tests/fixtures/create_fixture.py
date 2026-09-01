"""
Script to build test fixture `tests/fixtures/daily_prep_report.xlsx`
reconstructed cell-for-cell from ATM's Daily Preparatory Production Report layout:

SHIFT              |   I   |  II   |  III  | TOTAL |  REMARKS
CARDING 24 HRS     | 13291 | 13291 | 13291 | 39873 |  SCHEDULED
TARGET @ 22.5 HRS  | 12460 | 12460 | 12959 | 37879 |  SHIFT : 1
ACTUAL             | 11150 | 11361 | 11408 | 33919 |  CARD : 9 & 10 ESS STOP - 360 MIN.
EFFI %             | 89.48 | 91.18 | 88.03 | 89.54 |  ...
"""
import openpyxl

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Daily Prep Report"

# Row 1: Header
ws.append(["SHIFT", "I", "II", "III", "TOTAL", "REMARKS"])

# Row 2: Carding 24 hrs
ws.append(["CARDING 24 HRS", 13291, 13291, 13291, 39873, "SCHEDULED"])

# Row 3: Target @ 22.5 hrs
ws.append(["TARGET @ 22.5 HRS", 12460, 12460, 12959, 37879, "SHIFT : 1"])

# Row 4: Actual
ws.append(["ACTUAL", 11150, 11361, 11408, 33919, "CARD : 9 & 10 ESS STOP - 360 MIN."])

# Row 5: Effi %
ws.append(["EFFI %", 89.48, 91.18, 88.03, 89.54, "SHIFT : 2"])

# Row 6: Additional remarks
ws.append(["", "", "", "", "", "MAINTENANCE - 120 MIN."])

wb.save(r"C:\Users\Admin\Documents\gokul\Loom-AI\v2\backend\tests\fixtures\daily_prep_report.xlsx")
print("Saved daily_prep_report.xlsx fixture successfully.")
