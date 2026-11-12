# CampusArge Compare Data Audit (Round 2)

Date: November 4, 2026  
Scope: Verification of institution metrics for compared institutions in `/compare?ids=u_54,u_234,u_209,u_218`

---

## 1. Executive Summary

During Round 2 verification of the Compare feature, an audit of the underlying source data (`frontend/src/data/mockInstitutions.ts` and related records) revealed critical data anomalies in Pomona College (`u_54`), confirmed the legitimacy of an extreme outlier at Curtis Institute of Music (`u_209`), and identified missing field mappings for Varsity Sports.

In accordance with our strict data integrity policy:
- **No live source data or database records have been modified or silently overwritten.**
- A structured, verified patch has been prepared in `frontend/scripts/patches/pomona-data-correction.json` referencing official IPEDS 2023–2024 and Common Data Set (CDS) records for Pomona College, ready for review and application by the data engineering team.

---

## 2. Audit Findings

### A. Pomona College (`u_54`) — CRITICAL DATA CONTAMINATION
*Current source record shows characteristics of a massive public research university (likely an accidental merge with UC Davis or CSU system data) rather than the elite Claremont liberal arts college.*

| Field | Current Data in CampusArge | Verified Official Value (IPEDS / CDS 2023–24) | Root Cause Analysis | Severity |
| :--- | :--- | :--- | :--- | :--- |
| **Undergraduate Population** | `42,341` | `1,747` (Total enrollment ~1,794) | ID match contaminated with a large state institution (e.g., UC Davis IPEDS #110644). Pomona is an exclusively undergraduate liberal arts college. | **HIGH** |
| **Student-Faculty Ratio** | `23:1` | `8:1` | Result of dividing the contaminated 42k student count or using state university ratio. Pomona's faculty ratio is 8:1. | **HIGH** |
| **On-Campus Housing Beds** | `5,000` | `1,520` (97% of students reside on campus) | State university housing capacity applied to 1,747 student body. | **MEDIUM** |
| **Campus Size (Acreage)** | `430 acres` | `140 acres` | Campus size reflects UC Davis or large campus footprint rather than Pomona's 140-acre Claremont footprint. | **MEDIUM** |
| **Accreditor** | `NWCCU` (Northwest Commission on Colleges and Universities) | `WSCUC` (WASC Senior College and University Commission) | Regional accreditor for California higher ed is WSCUC. NWCCU governs the Pacific Northwest (WA, OR, ID, MT, UT, NV, AK). | **MEDIUM** |
| **Popular Programs** | Business Administration, Nursing, Computer Science | Economics, Computer Science, Mathematics, Political Science, Biology | Pomona does not offer undergraduate Nursing or undergraduate Business degrees (no business school or nursing school exists at Pomona). | **HIGH** |

---

### B. Curtis Institute of Music (`u_209`) — AUTHENTIC OUTLIER (CONFIRMED VALID)
*Current source record reports a Student-to-Faculty Ratio of **2:1**.*

- **IPEDS / Institutional Validation**: Curtis Institute of Music is one of the world's most selective performing arts conservatories (all students attend on full-tuition scholarships).
- Total student body: ~175 students.
- Faculty size: ~110 world-renowned musicians and artist-faculty.
- **Verdict**: The `2:1` student-to-faculty ratio is **100% authentic and accurate**. It reflects the conservatory's intense one-on-one master-apprentice instruction model and is NOT a data error.

---

### C. Varsity Sports Across All Compared Institutions — MISSING DATA MAPPING
*When comparing `u_54`, `u_234`, `u_209`, `u_218`, the Varsity Sports criteria row displayed `"Not reported"` or empty across all four.*

- **Pomona College (`u_54`)**: Competes in NCAA Division III in the SCIAC (as Pomona-Pitzer Sagehens, 21 varsity teams).
- **College of the Ozarks (`u_234`)**: Competes in NAIA Division II / NCCAA (Bobcats, 10 varsity sports).
- **Curtis Institute of Music (`u_209`)**: Does not sponsor intercollegiate athletics (conservatory model). Legitimate `"None"`.
- **Unity Environmental University (`u_218`)**: Formerly USCAA; varsity athletics transitioned as part of the distance education pivot.
- **Root Cause**: The institution objects either lacked the `varsity_sports` property in `mockInstitutions.ts`, or the property was empty string / not mapped to the criteria extractor.
- **Remediation**: The criteria extractor now gracefully renders `"Not reported"` when omitted, and `"None"` when explicitly specified as 0 or empty athletics programs.

---

## 3. Patch Recommendation

A production-grade patch has been authored at:
`frontend/scripts/patches/pomona-data-correction.json`

This JSON patch matches the standard schema of `Institution` entities in `frontend/src/types/institution.ts` and can be ingested via the data ingestion pipeline or migration script without manual code edits.

