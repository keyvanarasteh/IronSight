use std::collections::VecDeque;
use std::time::{Instant, Duration};
use crate::actions::ActionType;

pub struct ActionRateLimiter {
    actions: VecDeque<(Instant, ActionType)>,
    pub max_kills_per_minute: usize,
    pub max_suspends_per_minute: usize,
}

impl Default for ActionRateLimiter {
    fn default() -> Self {
        Self {
            actions: VecDeque::new(),
            max_kills_per_minute: 5,
            max_suspends_per_minute: 10,
        }
    }
}

impl ActionRateLimiter {
    pub fn new() -> Self {
        Self::default()
    }

    fn cleanup_old(&mut self) {
        let now = Instant::now();
        let minute_ago = now.checked_sub(Duration::from_secs(60)).unwrap_or(now);
        while let Some(&(time, _)) = self.actions.front() {
            if time < minute_ago {
                self.actions.pop_front();
            } else {
                break;
            }
        }
    }

    pub fn can_act(&mut self, action: &ActionType) -> bool {
        self.cleanup_old();
        let count = self.actions.iter().filter(|(_, a)| a == action).count();
        match action {
            ActionType::Kill | ActionType::SuspendDumpKill => count < self.max_kills_per_minute,
            ActionType::Suspend => count < self.max_suspends_per_minute,
            _ => true,
        }
    }

    pub fn record_action(&mut self, action: ActionType) {
        self.actions.push_back((Instant::now(), action));
    }
}
