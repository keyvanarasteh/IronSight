<script lang="ts">
	import { browser } from '$app/environment';
	import type { Snippet } from 'svelte';
	import { onMount, setContext } from 'svelte';
	import { THEME_CONTEXT_KEY, type QixTheme, type ThemeContext } from '../../theme';
	import { cn } from '../../utils';

	let {
		children,
		theme = $bindable('system'),
		storageKey = 'qix-theme',
		class: className,
		...rest
	}: {
		children?: Snippet;
		theme?: QixTheme;
		storageKey?: string;
		class?: string;
		[key: string]: unknown;
	} = $props();

	let resolved = $derived<'light' | 'dark'>(resolveTheme(theme));

	function resolveTheme(t: QixTheme): 'light' | 'dark' {
		if (t === 'system') {
			if (browser) {
				return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
			}
			return 'dark'; // SSR fallback
		}
		return t;
	}

	function setTheme(t: QixTheme) {
		theme = t;
		if (browser) {
			localStorage.setItem(storageKey, t);
		}
	}

	function toggleTheme() {
		setTheme(resolved === 'dark' ? 'light' : 'dark');
	}

	// Read persisted preference and listen for system changes
	onMount(() => {
		const stored = localStorage.getItem(storageKey) as QixTheme | null;
		if (stored && ['light', 'dark', 'system'].includes(stored)) {
			theme = stored;
		}

		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		const handler = () => {
			if (theme === 'system') {
				// Re-assign to trigger $derived recalculation
				theme = 'system';
			}
		};
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	});

	$effect(() => {
		if (browser) {
			if (resolved === 'dark') {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
	});

	setContext<ThemeContext>(THEME_CONTEXT_KEY, {
		get theme() {
			return theme;
		},
		get resolved() {
			return resolved;
		},
		setTheme,
		toggleTheme
	});
</script>

<div class={cn('', className)} {...rest}>
	{@render children?.()}
</div>
