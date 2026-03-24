//! # IronSight Response
//!
//! Automated response handler — suspend, forensic dump, kill, with exclusion lists.
//!
//! **Forensic Order:** Suspend → Dump → Kill

pub mod actions;
pub mod exclusions;
pub mod handler;
pub mod audit;
pub mod rate_limit;

pub use actions::{ActionResult, ActionType};
pub use exclusions::ExclusionList;
pub use handler::{ResponseHandler, ResponseLog};
