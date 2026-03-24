//! Binary signature verification (placeholder for cross-platform).
//!
//! - Windows: Authenticode signature verification
//! - macOS: Developer ID / notarization
//! - Linux: PGP / distro signature (best-effort)

use std::path::Path;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct SignatureResult {
    pub is_signed: Option<bool>,
    pub signer: Option<String>,
    pub verified: Option<bool>,
    pub method: String,
    pub platform_note: String,
}

/// Check if a binary is signed (platform-specific).
pub fn verify_signature(path: &Path) -> SignatureResult {
    #[cfg(target_os = "linux")]
    {
        let pkg_output = std::process::Command::new("dpkg")
            .args(["-S", &path.to_string_lossy()])
            .output();
        
        let package = match pkg_output {
            Ok(out) if out.status.success() => {
                let stdout = String::from_utf8_lossy(&out.stdout);
                Some(stdout.split(':').next().unwrap_or("").trim().to_string())
            },
            _ => None,
        };

        let verified = if let Some(ref pkg) = package {
            let verify = std::process::Command::new("dpkg")
                .args(["--verify", pkg])
                .output();
            match verify {
                Ok(out) => out.status.success(),
                _ => false,
            }
        } else {
            false
        };

        SignatureResult {
            is_signed: Some(package.is_some()),
            signer: package,
            verified: Some(verified),
            method: "dpkg-verify".to_string(),
            platform_note: "Linux: Using dpkg signature verification".into(),
        }
    }

    #[cfg(target_os = "windows")]
    {
        let mut is_signed = None;
        let mut signer = None;
        let mut verified = None;
        let mut platform_note = "Windows: Authenticode verification via cross-authenticode".to_string();

        if let Ok(file_data) = std::fs::read(path) {
            use cross_authenticode::AuthenticodeInfo;
            if let Ok(ai) = AuthenticodeInfo::try_from(file_data.as_slice()) {
                is_signed = Some(true);
                // Extracting subject name from the first certificate if available
                signer = ai.certificates.first()
                    .map(|cert| cert.subject.clone())
                    .unwrap_or(None);
                
                if let Ok(true) = ai.verify() {
                    verified = Some(true);
                } else {
                    verified = Some(false);
                }
            } else {
                is_signed = Some(false);
                verified = Some(false);
            }
        }

        SignatureResult {
            is_signed,
            signer,
            verified,
            method: "cross-authenticode".to_string(),
            platform_note,
        }
    }

    #[cfg(target_os = "macos")]
    {
        let verify = std::process::Command::new("codesign")
            .args(["-v", "--strict", &path.to_string_lossy()])
            .output();
        
        // Output from codesign goes to stderr
        let verified = match verify {
            Ok(out) => out.status.success(),
            _ => false,
        };

        let details = std::process::Command::new("codesign")
            .args(["-dvv", &path.to_string_lossy()])
            .output();

        let mut signer = None;
        if let Ok(out) = details {
            let stderr = String::from_utf8_lossy(&out.stderr);
            for line in stderr.lines() {
                if line.starts_with("Authority=") {
                    signer = Some(line.replace("Authority=", "").trim().to_string());
                    break;
                }
            }
        }

        SignatureResult {
            is_signed: Some(signer.is_some()),
            signer,
            verified: Some(verified),
            method: "codesign".to_string(),
            platform_note: "macOS: Code signing verification".into(),
        }
    }

    #[cfg(not(any(target_os = "linux", target_os = "windows", target_os = "macos")))]
    {
        SignatureResult {
            is_signed: None,
            signer: None,
            verified: None,
            method: "unknown".to_string(),
            platform_note: "Unsupported platform for signature verification".into(),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::PathBuf;

    #[cfg(target_os = "linux")]
    #[test]
    fn system_binary_is_trusted() {
        let result = verify_signature(&PathBuf::from("/usr/bin/ls"));
        assert_eq!(result.is_signed, Some(true));
    }

    #[cfg(target_os = "linux")]
    #[test]
    fn tmp_binary_is_untrusted() {
        let result = verify_signature(&PathBuf::from("/tmp/suspicious"));
        assert_eq!(result.is_signed, Some(false));
    }
}
