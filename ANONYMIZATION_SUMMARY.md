# Data Anonymization Summary

## Date: October 7, 2025

## Overview
All CSV files in the dashboard have been successfully anonymized to protect real agency and agent identities while maintaining data integrity for presentation purposes.

## Changes Made

### 1. Agency Names
**Transformation:** `RealNet` → `PE (Property Engine)`

**Examples:**
- `RealNet Bloemfontein` → `PE Bloemfontein`
- `RealNet RainMaker` → `PE RainMaker`
- `RealNet - Centurion Core` → `PE Centurion Core`

**Files affected:**
- agency_marketing_spend.csv (30 records)
- realnet_agency_response_rates.csv (14 records)
- realnet_sales_with_lead_source.csv (1,484 records)
- sales_rental_sudonum.csv (31,743 records)

### 2. Agent Names
**Transformation:** Real names → Fake agent names from provided list

**Examples:**
- `Melville du Plessis` → `Malcolm James 2`
- `Aantje Kirsten` → `Andrew Wilson`
- `Abel Rootman` → `Leon Griffin`

**Total agents anonymized:** 375 unique agents

**Files affected:**
- agent_response_rates.csv (276 records)
- realnet_sales_with_lead_source.csv (1,484 records)
- sales_rental_sudonum.csv (31,743 records)

### 3. Competitor Agencies
**Transformation:** Real names → Generic labels

**Examples:**
- `RE/MAX Address - Berea` → `Competitor Branch 1`
- `Tyson Property Holdings` → `Competitor Agency`

**Files affected:**
- other_agency_response_rates.csv (25 records)

## Fake Agent Names Used

The following 117 fake names were used (with numeric suffixes when needed for uniqueness):

James Mitchell, Robert Chen, Michael Anderson, David Thompson, William Foster, Thomas Brooks, Daniel Martinez, Christopher Lee, Matthew Davis, Andrew Wilson, Joshua Garcia, Ryan Peterson, Brandon Miller, Tyler Moore, Jacob Taylor, Nicholas White, Kevin Harris, Eric Johnson, Brian Clark, Steven Rodriguez, Justin Lewis, Aaron Walker, Kyle Hall, Nathan Young, Derek Allen, Marcus King, Luke Wright, Connor Lopez, Ethan Hill, Isaac Scott, Gabriel Green, Austin Baker, Jordan Adams, Cameron Nelson, Hunter Carter, Caleb Mitchell, Evan Turner, Adrian Phillips, Ian Campbell, Sean Parker, Vincent Evans, Blake Edwards, Owen Collins, Carson Stewart, Trevor Morris, Cole Rogers, Spencer Reed, Brett Cook, Travis Morgan, Seth Bell, Preston Murphy, Jared Bailey, Marcus Rivera, Grant Cooper, Wesley Richardson, Chase Cox, Garrett Howard, Shane Ward, Marcus Torres, Dustin Peterson, Bradley Gray, Colin Ramirez, Malcolm James, Raymond Watson, Kenneth Brooks, Gerald Hayes, Keith Myers, Dennis Wood, Frank Ross, Louis Henderson, Carl Coleman, Arthur Jenkins, Albert Perry, Roy Powell, Eugene Long, Ralph Patterson, Russell Hughes, Harry Flores, Philip Washington, Douglas Butler, Henry Simmons, Walter Foster, Jerome Bryant, Lawrence Alexander, Leo Russell, Howard Griffin, Gregory Diaz, Martin Hayes, Samuel Bennett, Victor Webb, Frederick Price, Francis Barnes, Peter Ross, Harold Fisher, Edwin Sanders, Curtis Stevens, Stanley Wells, Leonard Hughes, Ernest Porter, Leon Griffin, Bernard Mason, Dale Dixon, Craig Hunt, Edgar Hart, Gordon Kennedy, Maurice West, Rodney Shaw, Claude Chapman, Floyd Gibson, Norman Knight, Vernon Fuller, Hugo Walton, Randall Beck, Milton Stone, Clifford Flynn, Lester Harper, Theodore Duncan, Gilbert Carr, Leroy Wade, Marvin Cortez, Melvin Lowe, Oscar Newman, Julius Delgado, Allan Santiago, Warren Hicks

## Data Integrity

✅ All numerical data preserved (leads, responses, amounts, percentages)
✅ All dates and timestamps preserved
✅ All location names preserved (Menlyn, Bloemfontein, etc.)
✅ Consistent mapping - same real name always maps to same fake name
✅ Total record counts unchanged

## Files Processed

1. **agency_marketing_spend.csv** - 30 agencies
2. **agent_response_rates.csv** - 276 agents
3. **realnet_agency_response_rates.csv** - 14 agencies
4. **realnet_sales_with_lead_source.csv** - 1,484 sales records
5. **sales_rental_sudonum.csv** - 31,743 lead records
6. **other_agency_response_rates.csv** - 25 competitor records

## Next Steps

1. ✅ Anonymization complete
2. ⏳ Review the anonymized data in the dashboard
3. ⏳ Test the dashboard displays correctly
4. ⏳ Commit changes to the branch
5. ⏳ Ready for agency presentation

## Technical Details

- Script: `anonymize_data.py`
- Language: Python 3
- Libraries: pandas, re, pathlib
- Seed: 42 (for reproducible random shuffling)
- Processing time: ~2 seconds for 35,000+ records

---

**Note:** The anonymization script can be re-run if needed. It will produce the same mappings due to the fixed random seed (42).
