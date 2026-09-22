# MERIDIAN V61 — DATA AUDIT

Automated audit of the migrated database. This document reports **what the data does not establish**. A finding is not an error in the world — it is a limit on what this platform can evidence.

---

## 1. RECORDS MIGRATED

| Record type | Count | Lost | Mutated |
|---|---|---|---|
| Theaters | 76 | 0 | 0 |
| Contested claims | 147 | 0 | 0 |
| Sources | 531 | 0 | 0 |
| External relations | 275 | 0 | 0 |

Verified by direct field-level diff against `db.v60.backup.json`: **zero fields removed, zero top-level fields mutated, zero claim texts or verdict strings altered.**

## 2. FIELDS SET TO UNKNOWN

**3,340 fields** were set to UNKNOWN because V60 contained no evidence to populate them. None were guessed.

| Field | Scope | Why |
|---|---|---|
| `evidence_confidence` | all 76 theaters | V60 records source counts, never source independence |
| `last_verified` | all 76 theaters + 147 claims | no verification timestamps exist in V60 |
| `claim_type` | all 147 claims | V60 verdicts are 126 distinct free-text strings |
| `event_date` | all 147 claims | dates appear in prose, never as a field |
| `independent_corrob` | all 147 claims | never recorded |
| `source_type` / `source_interest` | all 531 sources | never recorded |
| `relationship_type` | all 275 relations | V60 records involvement as prose |
| `layers.*` | all 76 theaters | prose cannot be auto-split without risking mislabelling |
| `escalation_components` | all 76 theaters | V60 stores narrative rationale, no weights |

## 3. DERIVED FROM REAL V60 SIGNALS

Only where V60 already encoded the information in machine-readable form.

| Derived field | Count | Derived from |
|---|---|---|
| `analytical_confidence` | 76 | `rival.conf` (HIGH→B, MODERATE→C) |
| `evidence_status` | 331 | `external.tier` + explicit verdict strings |
| `trend_state` | 66 | `trend`, forced UNCERTAIN where not swept |

**No value was mapped to confidence grade A.** Every assessment in V60 is a single-analyst judgement, which cannot meet the A standard of "interpretation strongly supported".

## 4. VALIDATION FINDINGS

**1,294 findings** — HIGH 14, MEDIUM 699, LOW 581.

| Count | Check | Severity |
|---|---|---|
| 531 | `src_unclassified` | LOW |
| 275 | `6_ext_no_reltype` | MEDIUM |
| 147 | `3_no_date` | MEDIUM |
| 147 | `4_stale_verification` | MEDIUM |
| 76 | `7_no_components` | MEDIUM |
| 54 | `13_active_unverified` | MEDIUM |
| 50 | `hist_backfilled` | LOW |
| 14 | `1_documented_no_source` | HIGH |

## 5. STALE AND UNVERIFIED RECORDS

- **147 of 147 claims** have never been independently re-verified, or the date was not recorded.
- **10 theaters** were date-stamped but not re-researched in the current cycle. Their `trend_state` is forced to UNCERTAIN: south-africa, global-economy, mexico, kashmir, cameroon, moldova, iraq, angola, tanzania, oman.
- **54 theaters** present an active/escalating/volatile status with no verification date on record.

## 6. CONTRADICTIONS AND UNSUPPORTED CONFIDENCE

- **Conflicting fields discovered: 0.** Every `tier` value matches its escalation band.
- **14 claims** carry `evidence_status: DOCUMENTED` derived from verdict text rather than from verified per-claim sourcing. Each carries an `evidence_status_basis` marking the derivation provisional. These are the only status upgrades in the migration and all are flagged.
- **0 external relations** assert causation. `causation_established` is `false` across all 275.

## 7. PRE-EXISTING HONESTY FLAGS CARRIED FORWARD

V60 already encoded several integrity markers. All were preserved and surfaced:

- **50 theaters** have back-filled escalation history; the trajectory chart remains suppressed.
- **32 theaters** carry casualty figures explicitly flagged ESTIMATE.
- **16 of 20 control blocks** are flagged ESTIMATE.
- **129 standing monitors** are listed explicitly as NOT cited as evidence for any specific claim.

## 8. DATA THAT COULD NOT SAFELY BE MIGRATED

| Item | Reason |
|---|---|
| Observation/interpretation split | Auto-splitting prose would risk presenting inference as observation |
| Escalation component weights | Inventing components summing to the existing score would manufacture false precision |
| Per-claim source attachment | V60 attaches sources to theaters; the claim↔source mapping does not exist and cannot be reconstructed |
| Audit before/after values | V60 changelog is free text; structured prior assessments were never stored |
| Sub-national map geometry | V60 holds one centroid per theater; no time-enabled map objects exist to migrate |

## 9. MANUAL REVIEW QUEUE

**802 records flagged.** Ranked by analytical value per unit of effort:

1. **Falsifiers** — 76 theaters. Highest value: makes every assessment testable.
2. **Relationship typing** — 275 relations. Highest risk: the CONTACT vs SUPPORT vs CAUSAL distinction.
3. **Per-claim sourcing and typing** — 147 claims.
4. **Source classification and independence** — 531 sources. Blocks `evidence_confidence` entirely.
5. **Observation/interpretation separation** — 76 theaters.

---

*Generated 2026-09-19 from dbV61.json and qa_report.json.*