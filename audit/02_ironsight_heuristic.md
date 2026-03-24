# ironsight-heuristic — Deep Audit Report

**Description:** Heuristic threat scoring engine — weighted signals, decay, risk aggregation  
**Dependencies:** ironsight-core, serde, tracing  
**Files:** lib.rs, engine.rs, signals.rs, decay.rs

---

## ✅ What Works Well

- **Clean signal architecture** — `Signal` struct with category, weight, description, and evidence
- **Pre-built signal factories** — 10 factory functions for common threat indicators
- **Exponential decay engine** — Mathematically correct decay formula `score × e^(−λt)` with configurable half-life
- **Comprehensive tests** — 20+ tests covering all threat levels, category scoring, decay math, active count, risk index
- **ThreatLevel ordering** — Properly implements `PartialOrd`/`Ord` for comparison

---

## 🟠 High Issues

### 1. Decay Engine Not Integrated into Main Pipeline

**Issue:** `DecayEngine` is fully implemented and tested, but `ironsight-service/src/main.rs` never uses it. The service performs single-shot scans without time-based scoring.

**Impact:** Transient CPU spikes (e.g., compilation) get the same score as persistent threats. This is the entire purpose of the decay engine — reducing false positives.

**Fix Required:** Integrate `DecayEngine` into the main scan loop for continuous monitoring mode.

### 2. HeuristicEngine Has No Configurable Weights

**File:** `engine.rs:100-103`  
**Issue:** `HeuristicEngine::new()` only takes `max_score`. There's no way to:
- Configure per-category weight multipliers
- Set custom thresholds for threat levels
- Adjust scoring sensitivity per deployment

**Fix Required:** Add `HeuristicConfig` with customizable thresholds and category weights.

### 3. Signal Weight Not Validated

**File:** `signals.rs:31-39`  
**Issue:** `Signal::new()` accepts any `f64` weight, including negative values. A negative weight would decrease the threat score, which could be exploited.

**Fix Required:** Clamp weight to `0.0..=100.0` range.

### 4. No Signal Deduplication

**Issue:** The engine sums all signals without checking for duplicates. If `high_entropy()` is accidentally called twice, the score doubles. No dedup by signal name.

---

## 🟡 Medium Issues

### 5. CategoryScores Not Weighted

**File:** `engine.rs:125-129`  
**Issue:** Raw score is a simple sum of all category scores. In a real EDR, categories should have different weights (e.g., MemoryAnomaly should weigh more than ProcessBehavior).

### 6. No Confidence Score

**Issue:** ThreatAssessment lacks a confidence metric. A single signal with weight=60 gives a different confidence than three signals summing to 60.

### 7. DecayEngine::risk_index is Simplistic

**File:** `decay.rs:153-160`  
**Issue:** Risk index is a simple average. Should weight by severity — one Critical process should drive the index higher than 10 Low processes.

### 8. ThreatLevel::from_score Truncates

**File:** `engine.rs:19`  
```rust
match score as u32 { ... }
```
**Issue:** Casting `f64` to `u32` truncates. Score `10.9` becomes `10` (Clean) instead of rounding to `11` (Low). Should use `score.round() as u32`.

### 9. Missing CategoryScores for New Categories

**Issue:** If a new `SignalCategory` variant is added (e.g., `IoAnomaly`), the `match` in `engine.rs:116-122` will not compile (good — exhaustive match), but `CategoryScores` struct won't have the field (bad — manual update needed). Consider using a `HashMap<SignalCategory, f64>` instead.

---

## ❌ Missing Implementations

| Feature | Status | Notes |
|---|---|---|
| Configurable engine weights | ❌ | Hardcoded thresholds |
| Decay integration in service | ❌ | Engine works but unused |
| Signal correlation | ❌ | No cross-signal analysis |
| Machine learning scoring | ❌ | Static rules only |
| Historical trend analysis | ❌ | No persistence |
| Custom signal registration | ❌ | Only pre-built factories |
| Signal severity vs confidence | ❌ | Single weight value |
| Risk index weighting | ❌ | Simple average |

---

## 🧪 Test Coverage

| Area | Tested | Notes |
|---|---|---|
| Clean assessment | ✅ | Empty signals → Clean |
| All threat levels | ✅ | Low through Critical |
| Score clamping | ✅ | >100 capped to 100 |
| Category scores | ✅ | Per-category validation |
| Decay math | ✅ | Half-life, quarter-life, floor |
| Record/retrieve | ✅ | Basic history |
| Peak tracking | ✅ | Highest score tracking |
| Risk index | ✅ | Basic average |
| Signal deduplication | ❌ | Not tested or implemented |
| Negative weights | ❌ | Not validated |
