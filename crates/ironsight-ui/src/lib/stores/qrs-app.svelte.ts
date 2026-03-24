import { browser } from '$app/environment';
import { logger } from '$lib/services/logger';

export interface QrsAppState {
	debugConsoleVisible: boolean;
	debugConsoleExpanded: boolean;
	devMode: boolean;
	pinnedRoutes: string[];
}

class QrsAppStateStore {
	state = $state<QrsAppState>({
		debugConsoleVisible: false,
		debugConsoleExpanded: false,
		devMode: false,
		pinnedRoutes: []
	});

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	customActionsComponent = $state<any>(null);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	customActionsProps = $state<Record<string, any>>({});

	constructor() {
		if (browser) {
			this.load();
			// Watch for state changes and save
			$effect.root(() => {
				$effect(() => {
					// Track changes to state
					this.state.debugConsoleVisible;
					this.state.debugConsoleExpanded;
					this.state.devMode;
					this.state.pinnedRoutes; // Proxy dependency trigger
					this.save();
				});
			});
		}
	}

	load() {
		try {
			const stored = localStorage.getItem('qrs-app-state');
			if (stored) {
				const parsed = JSON.parse(stored);
				this.state = {
					debugConsoleVisible: parsed.debugConsoleVisible ?? false,
					debugConsoleExpanded: parsed.debugConsoleExpanded ?? false,
					devMode: parsed.devMode ?? false,
					pinnedRoutes: Array.isArray(parsed.pinnedRoutes) ? parsed.pinnedRoutes : []
				};
				logger.debug('App state loaded from storage', { target: 'app' });
			}
		} catch (e) {
			logger.error('Failed to load app state', { target: 'app', details: { error: String(e) } });
		}
	}

	save() {
		if (browser) {
			localStorage.setItem('qrs-app-state', JSON.stringify(this.state));
		}
	}

	toggleDebugConsole() {
		this.state.debugConsoleVisible = !this.state.debugConsoleVisible;
		logger.info(`Debug console ${this.state.debugConsoleVisible ? 'opened' : 'closed'}`, {
			target: 'app'
		});
	}

	setDebugConsoleExpanded(expanded: boolean) {
		this.state.debugConsoleExpanded = expanded;
	}

	toggleDebugConsoleExpanded() {
		this.state.debugConsoleExpanded = !this.state.debugConsoleExpanded;
		logger.debug(`Debug console ${this.state.debugConsoleExpanded ? 'expanded' : 'collapsed'}`, {
			target: 'app'
		});
	}

	toggleDevMode(enable: boolean) {
		this.state.devMode = enable;
		logger.info(`Dev mode ${enable ? 'enabled' : 'disabled'}`, {
			target: 'app'
		});
	}

	togglePinnedRoute(routePath: string) {
		if (this.state.pinnedRoutes.includes(routePath)) {
			// Proxy mutation
			this.state.pinnedRoutes = this.state.pinnedRoutes.filter((p) => p !== routePath);
		} else {
			this.state.pinnedRoutes = [...this.state.pinnedRoutes, routePath];
		}
	}

	isRoutePinned(routePath: string): boolean {
		return this.state.pinnedRoutes.includes(routePath);
	}
}

export const qrsAppState = new QrsAppStateStore();
