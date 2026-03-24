use reqwest::Client;
use serde::Serialize;
use anyhow::{Result, Context};
use crate::incident::IncidentReport;

#[derive(Clone)]
pub struct SplunkExporter {
    client: Client,
    url: String,
    token: String,
    source: String,
}

#[derive(Serialize)]
struct HecPayload<'a> {
    time: i64,
    host: &'a str,
    source: &'a str,
    sourcetype: &'static str,
    event: &'a IncidentReport,
}

impl SplunkExporter {
    pub fn new(url: String, token: String, source: String) -> Self {
        Self {
            client: Client::builder()
                .danger_accept_invalid_certs(true) // For local self-signed splunk
                .build()
                .unwrap_or_default(),
            url,
            token,
            source,
        }
    }

    pub async fn export_incident(&self, report: &IncidentReport) -> Result<()> {
        let payload = HecPayload {
            time: report.timestamp.timestamp(),
            host: &report.hostname,
            source: &self.source,
            sourcetype: "_json",
            event: report,
        };

        let res = self.client.post(&self.url)
            .header("Authorization", format!("Splunk {}", self.token))
            .json(&payload)
            .send()
            .await
            .context("Failed to send Splunk HEC event")?;

        if !res.status().is_success() {
            anyhow::bail!("Splunk rejected event: {}", res.status());
        }

        Ok(())
    }
}
