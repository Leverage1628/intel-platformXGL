# MERIDIAN V61 — POST-AUTHORING STATUS

Supplement to the CHANGELOG and DATA AUDIT. Those describe the **migration**. This records the **analytical work completed after it**, and what remains genuinely open.

---

## COMPLETED SINCE MIGRATION

### 1. Falsifiers authored — 34 theaters, 129 falsifiers

Every theater at escalation 70 or above can now answer *what would prove this wrong*. Each set is written against that theater's own primary assessment and carries the note: **"None asserts that any such evidence exists."** These are tests, not claims.

Coverage: **10/10 CRITICAL · 24/24 SEVERE · 0/29 ELEVATED · 0/13 GUARDED.**

Theaters below escalation 70 still render the honest empty state rather than a generated placeholder.

### 2. External relationships typed — 162 of 275

| Relationship type | Count |
|---|---|
| WEAPONS_SUPPORT | 57 |
| ECONOMIC_RELATIONSHIP | 46 |
| FINANCIAL_SUPPORT | 21 |
| MILITARY_RELATIONSHIP | 19 |
| POLITICAL_RELATIONSHIP | 19 |
| FACILITATION | 18 |
| LOGISTICAL_SUPPORT | 17 |
| CONTACT | 5 |
| **UNKNOWN — no explicit language** | 113 |

**Three invariants, held and tested:**

- `causation_established` is **false on all 275**. Causation is never assigned by rule.
- Contact is never upgraded to support. **5 relations are CONTACT-only** and stay that way.
- Hedged wording is **flagged, not used to rewrite status** — 9 relations carry qualified language such as "reportedly" or "alleged".

Every assignment records the rule that fired and the phrase that triggered it, so each classification is auditable and reversible.

### 3. Sources classified — 500 of 531

| Source type | Count | Share |
|---|---|---|
| ACADEMIC | 134 | 25% |
| LOCAL_JOURNALISM | 105 | 20% |
| CONSOLIDATED_RECORD | 81 | 15% |
| INVESTIGATIVE_JOURNALISM | 71 | 13% |
| OSINT | 46 | 9% |
| INTERNATIONAL_ORGANIZATION | 36 | 7% |
| UNKNOWN | 31 | 6% |
| GOVERNMENT | 12 | 2% |
| NGO | 8 | 2% |
| MILITARY | 7 | 1% |

---

## TWO FINDINGS THE PLATFORM SHOULD NOT HIDE

### Wikipedia is 15% of the source base

**81 of 531 citations** resolve to Wikipedia, classified as CONSOLIDATED_RECORD. MERIDIAN's stated methodology is that Wikipedia is used only for consolidated conflict records and never for analysis. That use is defensible — but a 15% share is higher than the methodology statement implies, and a reader should be told.

### Shared-origin risk on 56 of 76 theaters

These theaters cite the same domain more than once. **Repeat citations to one publisher are not independent corroboration.** The heaviest cases:

- **drc** — aljazeera.com ×2, criticalthreats.org ×4
- **lebanon** — en.wikipedia.org ×4
- **korea** — aei.org ×4
- **caucasus** — en.wikipedia.org ×4
- **mozambique** — en.wikipedia.org ×4
- **syria** — en.wikipedia.org ×4

---

## WHY `evidence_confidence` IS STILL UNKNOWN ON ALL 76

This is the most important open item, and it is deliberate.

Classifying sources by type does **not** establish independence. Two outlets can reproduce the same wire report, the same UN press release, or the same government statement. The platform can now compute a **ceiling** — the number of distinct domains cited — but a ceiling is not a count.

Grading `evidence_confidence` from domain diversity would manufacture exactly the false precision this upgrade exists to prevent. The field stays `UNKNOWN` until sources are read and genuine independence is established.

---

## VALIDATION

| | At migration | Now |
|---|---|---|
| QA findings | 1,294 | 789 |
| HIGH severity | 14 | 34 |
| Theaters / claims / sources | 76 / 147 / 531 | 76 / 147 / 531 |

All 26 boards render. All 76 theater views render. **No claim, source or theater was lost at any stage.**

---

## REMAINING QUEUE, RANKED BY VALUE PER UNIT OF EFFORT

1. **Observation/interpretation split** — 76 theaters. The last structural item. Requires authoring: prose cannot be auto-split without risking labelling inference as observation.
2. **Per-claim sourcing** — 147 claims. V60 attached sources to theaters; the claim↔source mapping does not exist and must be built by hand.
3. **Claim typing** — 147 claims still `UNKNOWN`. The 126 legacy verdict strings are preserved verbatim as `legacy_verdict`.
4. **Source independence** — blocks `evidence_confidence` entirely. Requires reading sources, not classifying domains.
5. **Falsifiers for ELEVATED and GUARDED** — 42 theaters.
6. **Escalation component decomposition** — 76 theaters. Would require a documented weighting methodology that does not currently exist and must not be invented.

*Generated 2026-09-22 from dbV61.json and qa_report.json.*