import { getContext } from 'svelte';

export type QixTheme = 'light' | 'dark' | 'system';

export interface ThemeContext {
	/** Current theme setting ('light' | 'dark' | 'system') */
	readonly theme: QixTheme;
	/** Resolved theme after system detection ('light' | 'dark') */
	readonly resolved: 'light' | 'dark';
	/** Set a specific theme */
	setTheme: (theme: QixTheme) => void;
	/** Toggle between light and dark */
	toggleTheme: () => void;
}

export const THEME_CONTEXT_KEY = 'qix-theme';

/**
 * Get the theme context from a parent ThemeProvider.
 * Must be called from a component that is a child of ThemeProvider.
 */
export function getThemeContext(): ThemeContext {
	return getContext<ThemeContext>(THEME_CONTEXT_KEY);
}
