use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SharedLibrary {
    pub name: String,
    pub path: Option<PathBuf>,
    pub address: Option<u64>,
}

#[cfg(target_os = "linux")]
pub fn enumerate_modules(path: &Path) -> std::io::Result<Vec<SharedLibrary>> {
    let output = std::process::Command::new("ldd")
        .arg(path)
        .output()?;
        
    let lines = String::from_utf8_lossy(&output.stdout);
    let mut libs = Vec::new();
    
    for line in lines.lines() {
        if line.trim().is_empty() { continue; }
        
        // linux-vdso.so.1 (0x00007ffe34380000)
        // libdl.so.2 => /lib/x86_64-linux-gnu/libdl.so.2 (0x00007fb184e0c000)
        
        let parts: Vec<&str> = line.split_whitespace().collect();
        if parts.is_empty() { continue; }
        
        let name = parts[0].to_string();
        let lib_path = if parts.len() >= 3 && parts[1] == "=>" {
            Some(PathBuf::from(parts[2]))
        } else {
            None
        };
        
        let addr_str = parts.last().unwrap().trim_matches(|c| c == '(' || c == ')');
        let address = if addr_str.starts_with("0x") {
            u64::from_str_radix(&addr_str[2..], 16).ok()
        } else {
            None
        };

        libs.push(SharedLibrary {
            name,
            path: lib_path,
            address,
        });
    }
    
    Ok(libs)
}

#[cfg(not(target_os = "linux"))]
pub fn enumerate_modules(_path: &Path) -> std::io::Result<Vec<SharedLibrary>> {
    Ok(Vec::new())
}
