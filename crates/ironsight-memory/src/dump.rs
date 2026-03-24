//! Memory dumping utility.

use std::path::{Path, PathBuf};
use std::io::{Read, Seek, SeekFrom, Write};
use crate::maps::read_maps;

/// Dump readable memory regions for a process into a secure file.
#[cfg(target_os = "linux")]
pub fn dump_memory(pid: u32, output_dir: &Path) -> anyhow::Result<(PathBuf, u32, u64)> {
    let now = chrono::Utc::now().format("%Y-%m-%dT%H:%M:%S%.3fZ").to_string();
    let mem_path = format!("/proc/{pid}/mem");
    let dump_path = output_dir.join(format!("memdump_{pid}_{}.bin", now.replace(':', "-")));

    // Read parsed memory maps
    let regions = read_maps(pid).map_err(|e| anyhow::anyhow!("Cannot read maps: {e}"))?;

    let mut mem_file = std::fs::File::open(&mem_path)
        .map_err(|e| anyhow::anyhow!("Cannot open /proc/{pid}/mem: {e}"))?;

    ensure_dump_dir(output_dir)?;

    let mut output = std::fs::File::create(&dump_path)
        .map_err(|e| anyhow::anyhow!("Cannot create dump file: {e}"))?;

    let mut total_bytes: u64 = 0;
    let mut regions_dumped = 0u32;
    const MAX_TOTAL_DUMP_SIZE: u64 = 256 * 1024 * 1024; // 256 MiB

    for region in regions {
        // Only dump readable regions
        if !region.permissions.read {
            continue;
        }

        let size = region.size();

        // Skip very large regions (>32 MiB)
        if size > 32 * 1024 * 1024 {
            continue;
        }

        if mem_file.seek(SeekFrom::Start(region.start)).is_err() {
            continue;
        }

        if total_bytes + size > MAX_TOTAL_DUMP_SIZE {
            tracing::warn!("Dump size limit reached ({} MiB), stopping", MAX_TOTAL_DUMP_SIZE / (1024 * 1024));
            break;
        }

        let mut buf = vec![0u8; size as usize];
        if mem_file.read_exact(&mut buf).is_ok() {
            let _ = output.write_all(&buf);
            total_bytes += size;
            regions_dumped += 1;
        }
    }

    Ok((dump_path, regions_dumped, total_bytes))
}

#[cfg(not(target_os = "linux"))]
pub fn dump_memory(_pid: u32, _output_dir: &Path) -> anyhow::Result<(PathBuf, u32, u64)> {
    Err(anyhow::anyhow!("Memory dump is only supported on Linux"))
}

#[cfg(target_os = "linux")]
fn ensure_dump_dir(path: &Path) -> std::io::Result<()> {
    use std::os::unix::fs::PermissionsExt;
    std::fs::create_dir_all(path)?;
    let perms = std::fs::Permissions::from_mode(0o700);
    std::fs::set_permissions(path, perms)?;
    let meta = std::fs::metadata(path)?;
    if std::os::unix::fs::MetadataExt::uid(&meta) != 0 {
        tracing::warn!("Dump directory not owned by root: {}", path.display());
    }
    Ok(())
}
