/**
 * Q-Static settings store stub.
 * Provides a minimal interface for ported SecOps components that reference settingsStore.
 */
class SettingsStore {
	settings = $state<Record<string, string>>({});
	loading = $state(false);

	getSetting(key: string, fallback: string = ''): string {
		return this.settings[key] ?? fallback;
	}
}

export const settingsStore = new SettingsStore();
