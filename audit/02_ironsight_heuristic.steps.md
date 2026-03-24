# ironsight-heuristic — Implementation Steps

> Audit: [02_ironsight_heuristic.md](02_ironsight_heuristic.md) · 9 Issues (4 High, 5 Medium)

---

## STEP 1: Decay Engine Entegrasyonu _(High #1)_

**Dosyalar:** `crates/ironsight-heuristic/src/engine.rs`, `crates/ironsight-service/src/main.rs`

### Ne Yapılacak
1. `main.rs`'e `DecayEngine` instance oluştur
2. Her scan döngüsünde `decay.record(pid, score)` çağır
3. Decay edilmiş skoru rapor et
4. Daemon mode'da sürekli güncelle

### Kod Değişikliği
```rust
// main.rs
use ironsight_heuristic::decay::DecayEngine;

let mut decay = DecayEngine::new(Duration::from_secs(3600)); // 1 saat half-life

// Scan loop içinde:
let raw_score = engine.assess(&signals).raw_score;
decay.record(pid, raw_score);
let decayed = decay.current_score(pid); // Zamanla düşen skor
```

### Test
```rust
#[test]
fn test_decay_reduces_transient_spike() {
    let mut decay = DecayEngine::new(Duration::from_secs(60));
    decay.record(100, 80.0);
    std::thread::sleep(Duration::from_secs(2));
    let score = decay.current_score(100);
    assert!(score < 80.0, "Skor zamanla düşmeli");
}
```

---

## STEP 2: Konfigüre Edilebilir Ağırlıklar _(High #2)_

**Dosya:** `crates/ironsight-heuristic/src/engine.rs`

### Ne Yapılacak
1. `HeuristicConfig` struct oluştur
2. Kategori ağırlıkları (multiplier) ekle
3. Eşik değerleri config'den al
4. Config'i TOML'dan okuma desteği

### Kod Değişikliği
```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HeuristicConfig {
    pub max_score: f64,
    pub category_weights: CategoryWeights,
    pub thresholds: ThresholdConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CategoryWeights {
    pub process_behavior: f64,    // default: 1.0
    pub network_anomaly: f64,     // default: 1.2
    pub memory_anomaly: f64,      // default: 1.5
    pub static_analysis: f64,     // default: 1.0
    pub privilege_escalation: f64, // default: 2.0
    pub persistence: f64,         // default: 1.3
}

impl HeuristicEngine {
    pub fn with_config(config: HeuristicConfig) -> Self { ... }
}
```

### Test
```rust
#[test]
fn test_memory_anomaly_weighted_higher() {
    let config = HeuristicConfig {
        category_weights: CategoryWeights { memory_anomaly: 2.0, ..Default::default() },
        ..Default::default()
    };
    let engine = HeuristicEngine::with_config(config);
    let signals = vec![Signal::wx_violation()];
    let result = engine.assess(&signals);
    // memory_anomaly 2x ağırlıklı olmalı
}
```

---

## STEP 3: Sinyal Ağırlık Doğrulama _(High #3)_

**Dosya:** `crates/ironsight-heuristic/src/signals.rs`

### Ne Yapılacak
1. `Signal::new()` içinde weight clamp: `weight.clamp(0.0, 100.0)`
2. Negatif ağırlık testi ekle

```rust
pub fn new(name: &str, category: SignalCategory, weight: f64, description: &str) -> Self {
    Self {
        name: name.to_string(),
        category,
        weight: weight.clamp(0.0, 100.0),  // CLAMP
        description: description.to_string(),
        evidence: Vec::new(),
    }
}
```

### Test
```rust
#[test]
fn test_negative_weight_clamped_to_zero() {
    let signal = Signal::new("test", SignalCategory::ProcessBehavior, -10.0, "");
    assert_eq!(signal.weight, 0.0);
}

#[test]
fn test_excessive_weight_clamped() {
    let signal = Signal::new("test", SignalCategory::ProcessBehavior, 200.0, "");
    assert_eq!(signal.weight, 100.0);
}
```

---

## STEP 4: Sinyal Deduplication _(High #4)_

**Dosya:** `crates/ironsight-heuristic/src/engine.rs`

### Ne Yapılacak
1. `assess()` içinde sinyalleri isme göre deduplicate et
2. Aynı isimli sinyallerde en yüksek ağırlığı al

```rust
pub fn assess(&self, signals: &[Signal]) -> ThreatAssessment {
    let mut seen: HashMap<&str, &Signal> = HashMap::new();
    for signal in signals {
        seen.entry(&signal.name)
            .and_modify(|existing| {
                if signal.weight > existing.weight { *existing = signal; }
            })
            .or_insert(signal);
    }
    let deduped: Vec<&Signal> = seen.values().copied().collect();
    // ... scoring with deduped
}
```

### Test
```rust
#[test]
fn test_duplicate_signals_deduped() {
    let engine = HeuristicEngine::new(100.0);
    let signals = vec![
        Signal::high_entropy(),  // 30 puan
        Signal::high_entropy(),  // tekrar 30 puan — sadece 1 kez sayılmalı
    ];
    let result = engine.assess(&signals);
    assert!(result.raw_score <= 30.0);  // 60 değil!
}
```

---

## STEP 5: ThreatLevel Yuvarlama _(Medium #8)_

**Dosya:** `crates/ironsight-heuristic/src/engine.rs`

### Ne Yapılacak
```rust
// ÖNCE (truncate):
match score as u32 { ... }

// SONRA (round):
match score.round() as u32 { ... }
```

### Test
```rust
#[test]
fn test_score_10_9_rounds_to_low() {
    let level = ThreatLevel::from_score(10.9);
    assert_eq!(level, ThreatLevel::Low);  // 11 → Low, 10 değil
}
```

---

## STEP 6: Confidence Score _(Medium #6)_

**Dosya:** `crates/ironsight-heuristic/src/engine.rs`

### Ne Yapılacak
1. `ThreatAssessment`'a `confidence: f64` ekle
2. Hesaplama: `min(1.0, signal_count * 0.2 + category_diversity * 0.15)`
3. Tek sinyal = düşük güven, çok sinyal farklı kategorilerden = yüksek güven

```rust
pub struct ThreatAssessment {
    pub raw_score: f64,
    pub level: ThreatLevel,
    pub confidence: f64,  // 0.0 - 1.0
    pub category_scores: CategoryScores,
    pub signals: Vec<Signal>,
}
```

---

## STEP 7: CategoryScores HashMap _(Medium #9)_

**Dosya:** `crates/ironsight-heuristic/src/engine.rs`

### Ne Yapılacak
```rust
// ÖNCE:
pub struct CategoryScores {
    pub process_behavior: f64,
    pub network_anomaly: f64,
    // ... her kategori için ayrı field
}

// SONRA:
pub type CategoryScores = HashMap<SignalCategory, f64>;
```

Bu sayede yeni kategori ekleme otomatik çalışır.

---

## Doğrulama Planı

```bash
cargo test --package ironsight-heuristic
cargo test --package ironsight-heuristic -- decay
cargo test --package ironsight-heuristic -- engine::tests::test_duplicate
cargo clippy --package ironsight-heuristic -- -W warnings
```
