# CampusArge: Logo Optimization Audit Report

Generated: 2026-10-31T19:46:53.517Z  
Execution Time: 6.5s  
Total Institutions: 426

## Quality Tier Breakdown

| Tier | Description | Dimension | Count | Percentage |
|:-----|:------------|:----------|:------|:-----------|
| **Tier A** | High Resolution (Crisp) | ≥ 128 px | 267 | 62.7% |
| **Tier B** | Medium Resolution | 64 – 127 px | 23 | 5.4% |
| **Tier C** | Low Resolution | < 64 px | 101 | 23.7% |
| **Tier D** | Fallback / Monogram | Missing | 35 | 8.2% |

- **Dark Backdrop Required (`bg: "dark"`):** 17 institutions (white/light logos given contrast framing).
- **Optimization Format:** WebP (lossless/90 quality, Lanczos3 downscaling, max 256×256 bounding box).

## Sample Audit Entries

| ID | Institution Name | Tier | Resolution | Backdrop | File Path |
|:---|:-----------------|:----:|:----------:|:--------:|:----------|
| `u_1` | Massachusetts Institute of Technology (MIT) | A | 192×192 | light | `/logos/u_1.webp` |
| `u_7` | Yale University | A | 180×180 | light | `/logos/u_7.webp` |
| `u_4` | Columbia University | C | 48×48 | light | `/logos/u_4.webp` |
| `u_17` | Rice University | A | 128×128 | light | `/logos/u_17.webp` |
| `u_10` | University of California, Berkeley | A | 256×256 | light | `/logos/u_10.webp` |
| `u_2` | Harvard University | A | 192×192 | light | `/logos/u_2.webp` |
| `u_5` | Princeton University | A | 196×196 | light | `/logos/u_5.webp` |
| `u_8` | University of Chicago | C | 48×48 | light | `/logos/u_8.webp` |
| `u_20` | Georgetown University | A | 180×180 | light | `/logos/u_20.webp` |
| `u_15` | Brown University | A | 180×180 | light | `/logos/u_15.webp` |
| `u_9` | Johns Hopkins University | A | 180×180 | light | `/logos/u_9.webp` |
| `u_6` | Cornell University | A | 256×256 | light | `/logos/u_6.webp` |
| `u_19` | Boston University | C | 57×57 | light | `/logos/u_19.webp` |
| `u_13` | Duke University | A | 192×192 | light | `/logos/u_13.webp` |
| `u_16` | New York University (NYU) | C | 16×16 | light | `/logos/u_16.webp` |

## Reversion & Integration
- Local WebP icons are served from `/logos/{id}.webp`.
- Manifest is loaded statically from `src/lib/logoManifest.json`.
- If an image fails in browser, `InstitutionLogo` automatically falls back to the brand monogram.
