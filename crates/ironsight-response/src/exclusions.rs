//! Exclusion list — processes that should never be automatically responded to.

use serde::{Deserialize, Serialize};

/// Exclusion list to protect critical system processes from automated response.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct ExclusionList {
    /// Process names to exclude (exact match).
    pub names: Vec<String>,
    /// PIDs to exclude.
    pub pids: Vec<u32>,
    /// Path prefixes to exclude (e.g., "/usr/sbin/").
    pub path_prefixes: Vec<String>,
    /// Glob/Regex patterns for process names.
    pub patterns: Vec<String>,
    #[serde(skip)]
    pub name_patterns: Vec<regex::Regex>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(default)]
pub struct ExclusionConfig {
    pub names: Vec<String>,
    pub pids: Vec<u32>,
    pub paths: Vec<String>,
    pub patterns: Vec<String>,
}

impl Default for ExclusionConfig {
    fn default() -> Self {
        Self {
            names: vec![
                "systemd".into(),
                "init".into(),
                "sshd".into(),
                "dbus-daemon".into(),
            ],
            paths: vec!["/usr/lib/systemd/".into(), "/usr/sbin/".into()],
            pids: vec![1],
            patterns: vec![],
        }
    }
}



impl From<&ExclusionConfig> for ExclusionList {
    fn from(config: &ExclusionConfig) -> Self {
        let mut list = ExclusionList::new();
        for name in &config.names { list.add_name(name); }
        for pid in &config.pids { list.add_pid(*pid); }
        for path in &config.paths { list.path_prefixes.push(path.to_string()); }
        for pattern in &config.patterns {
            let _ = list.add_pattern(pattern);
        }
        list
    }
}

impl ExclusionList {
    pub fn new() -> Self {
        Self::default()
    }

    /// Create an exclusion list with common system processes pre-populated.
    pub fn system_defaults() -> Self {
        ExclusionList {
            names: vec![
                "init".into(),
                "systemd".into(),
                "systemd-journald".into(),
                "systemd-logind".into(),
                "systemd-udevd".into(),
                "sshd".into(),
                "dbus-daemon".into(),
                "NetworkManager".into(),
                "cron".into(),
                "rsyslogd".into(),
                "kthreadd".into(),
            ],
            pids: vec![1], // PID 1 = init/systemd — never kill
            path_prefixes: vec![
                "/usr/lib/systemd/".into(),
                "/usr/sbin/".into(),
            ],
            patterns: Vec::new(),
            name_patterns: Vec::new(),
        }
    }

    /// Check if a process should be excluded from automated response (consolidated).
    pub fn is_excluded(&self, name: &str, pid: u32, path: Option<&str>) -> bool {
        if self.pids.contains(&pid) {
            return true;
        }
        if self.names.iter().any(|n| n == name) {
            return true;
        }
        if self.name_patterns.iter().any(|re| re.is_match(name)) {
            return true;
        }
        if let Some(p) = path {
            if self.path_prefixes.iter().any(|prefix| p.starts_with(prefix)) {
                return true;
            }
        }
        false
    }

    /// Check if a process path is excluded.
    pub fn is_path_excluded(&self, path: &str) -> bool {
        self.path_prefixes.iter().any(|p| path.starts_with(p))
    }

    pub fn add_name(&mut self, name: &str) {
        self.names.push(name.to_string());
    }

    pub fn add_pid(&mut self, pid: u32) {
        self.pids.push(pid);
    }
    
    pub fn add_pattern(&mut self, pattern: &str) -> Result<(), regex::Error> {
        let re = regex::Regex::new(pattern)?;
        self.name_patterns.push(re);
        self.patterns.push(pattern.to_string());
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn system_defaults_protect_init() {
        let list = ExclusionList::system_defaults();
        assert!(list.is_excluded("systemd", 1, None));
        assert!(list.is_excluded("init", 99, None));
        assert!(list.is_excluded("sshd", 500, None));
    }

    #[test]
    fn custom_exclusion() {
        let mut list = ExclusionList::new();
        list.add_name("my_service");
        list.add_pid(42);
        list.add_pattern("^test_.*").unwrap();

        assert!(list.is_excluded("my_service", 100, None));
        assert!(list.is_excluded("unknown", 42, None));
        assert!(list.is_excluded("test_runner", 999, None));
        assert!(!list.is_excluded("malware", 999, None));
    }

    #[test]
    fn path_exclusion() {
        let list = ExclusionList::system_defaults();
        assert!(list.is_path_excluded("/usr/sbin/sshd"));
        assert!(list.is_path_excluded("/usr/lib/systemd/systemd-logind"));
        assert!(!list.is_path_excluded("/tmp/evil"));
    }
}
