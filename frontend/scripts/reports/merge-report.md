# Institutions Data Merge Report

- **Date:** 2026-10-30T18:30:19.510Z
- **CSV Source:** `frontend/data/institutions.csv`
- **Base Institutions:** 422 (u_1 to u_422)
- **Total CSV Rows:** 433
- **Distinct Institutions Output:** 426 (u_1 to u_426)
- **New Institutions Added:** 4
  - `u_423`: Antioch University Seattle (https://www.antioch.edu/seattle)
  - `u_424`: Antioch University Los Angeles (https://www.antioch.edu/los-angeles)
  - `u_425`: Antioch University Santa Barbara (https://www.antioch.edu/santa-barbara)
  - `u_426`: Antioch University New England (https://www.antioch.edu/new-england)
- **Duplicate Rows Merged:** 7
  - `u_58` (Wheaton College (Massachusetts)): merged 2 CSV rows (Row 59 [6/23 cols], Row 153 [22/23 cols])
  - `u_215` (Saint Vincent College): merged 2 CSV rows (Row 217 [22/23 cols], Row 429 [22/23 cols])
  - `u_218` (Unity Environmental University): merged 2 CSV rows (Row 220 [22/23 cols], Row 431 [22/23 cols])
  - `u_242` (San Francisco Conservatory of Music): merged 2 CSV rows (Row 244 [22/23 cols], Row 430 [22/23 cols])
  - `u_327` (Saybrook University): merged 2 CSV rows (Row 329 [22/23 cols], Row 427 [22/23 cols])
  - `u_381` (Pacific Oaks College): merged 2 CSV rows (Row 383 [22/23 cols], Row 433 [22/23 cols])
  - `u_417` (University of the Potomac): merged 2 CSV rows (Row 423 [22/23 cols], Row 434 [22/23 cols])
- **Sparse Institutions (Core text only, <=6 cols):** 19
  - `u_10`: University of California, Berkeley
  - `u_11`: University of Pennsylvania
  - `u_14`: University of Michigan–Ann Arbor
  - `u_18`: University of California, Los Angeles (UCLA)
  - `u_21`: Washington University in St. Louis (WashU)
  - `u_24`: California Institute of Technology (Caltech)
  - `u_33`: Rensselaer Polytechnic Institute (RPI)
  - `u_59`: Savannah College of Art and Design (SCAD)
  - `u_65`: Rhode Island School of Design (RISD)
  - `u_86`: California Institute of the Arts (CalArts)
  - `u_91`: School of the Art Institute of Chicago (SAIC)
  - `u_109`: California College of the Arts (CCA)
  - `u_115`: Milwaukee School of Engineering (MSOE)
  - `u_126`: Maryland Institute College of Art (MICA)
  - `u_173`: Minneapolis College of Art and Design (MCAD)
  - `u_220`: Keck Graduate Institute (KGI)
  - `u_238`: Northwestern College (Iowa)
  - `u_240`: Southern California Institute of Architecture (SCI-Arc)
  - `u_396`: Labouré College
- **Mojibake / Special Characters Repaired:** 8
  - University of Michiganâ€“Ann Arbor ➔ University of Michigan–Ann Arbor
  - LabourÃ© College ➔ Labouré College
  - University of Michiganâ€“Ann Arbor ➔ University of Michigan–Ann Arbor
  - Martin Luther College primarily trains called workersâ€”past ➔ Martin Luther College primarily trains called workers—pastor
  - LabourÃ© College ➔ Labouré College
  - LabourÃ© College specializes in nursing and allied health ed ➔ Labouré College specializes in nursing and allied health edu
  - N/A â€” institution is permanently closed; no active researc ➔ N/A — institution is permanently closed; no active research 
  - N/A â€” institution is permanently closed and no longer offe ➔ N/A — institution is permanently closed and no longer offers

## Verification of Non-Negotiable Rules
1. **URLs Preserved:** `/institutions/u_1` through `/institutions/u_422` remain identical with exact IDs.
2. **New Institutions Appended:** `u_423` through `u_426` added sequentially.
3. **No Fabricated Data:** Empty CSV fields result in null or omitted sections.
4. **Bundle Performance:** Slim index created for directory/home (`universitiesIndex.ts`); full 23-column dataset dynamically imported on detail route (`universitiesFull.json`).
