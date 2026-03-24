use anyhow::{anyhow, Result};

pub trait KernelMonitor: Send + Sync {
    #[allow(dead_code)]
    fn start(&self) -> Result<()>;
    #[allow(dead_code)]
    fn stop(&self) -> Result<()>;
}

#[cfg(target_os = "windows")]
pub struct EtwMonitor;

#[cfg(target_os = "windows")]
impl EtwMonitor {
    pub fn new() -> Self {
        Self
    }
}

#[cfg(target_os = "windows")]
impl KernelMonitor for EtwMonitor {
    fn start(&self) -> Result<()> {
        Err(anyhow!("ETW monitoring not yet implemented"))
    }
    
    fn stop(&self) -> Result<()> {
        Err(anyhow!("ETW monitoring not yet implemented"))
    }
}
