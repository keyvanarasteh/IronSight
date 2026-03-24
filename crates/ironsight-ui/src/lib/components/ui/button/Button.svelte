<script lang="ts">
	import { resolve } from '$app/paths';
	import { cn } from '$lib/utils/cn';
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'default' | 'outline' | 'shine' | 'ghost' | 'link' | 'secondary';
		size?: 'default' | 'sm' | 'lg' | 'icon';
		href?: string;
		class?: string;
		children?: Snippet;
		onclick?: (e: MouseEvent) => void;
		[key: string]: unknown;
	}

	let {
		variant = 'default',
		size = 'default',
		href,
		class: className = '',
		children,
		onclick,
		...rest
	}: Props = $props();

	const variants = {
		default: 'bg-primary text-primary-foreground hover:bg-primary/90',
		outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
		shine:
			'animate-shimmer border border-border bg-[linear-gradient(110deg,var(--color-primary),45%,var(--color-primary-foreground),55%,var(--color-primary))] bg-[length:200%_100%] text-primary-foreground transition-colors font-medium',
		// Fallback shine if theme variables aren't perfect
		shine_alt:
			'animate-shimmer border border-border bg-[linear-gradient(110deg,#000,45%,#333,55%,#000)] dark:bg-[linear-gradient(110deg,#fff,45%,#ccc,55%,#fff)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50',
		ghost: 'hover:bg-accent hover:text-accent-foreground',
		link: 'text-primary underline-offset-4 hover:underline',
		secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
	};

	const sizes = {
		default: 'h-10 px-4 py-2',
		sm: 'h-9 rounded-md px-3',
		lg: 'h-11 rounded-md px-8',
		icon: 'h-10 w-10'
	};

	const baseClass =
		'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

	const isShine = $derived(variant === 'shine');

	const finalClass = $derived(
		cn(
			baseClass,
			isShine
				? 'animate-shimmer border border-border bg-[linear-gradient(110deg,var(--color-primary),45%,rgba(255,255,255,0.3),55%,var(--color-primary))] bg-[length:200%_100%] text-white'
				: variants[variant as keyof typeof variants] || variants.default,
			sizes[size as keyof typeof sizes] || sizes.default,
			className
		)
	);
</script>

{#if href}
	<a href={resolve(href, {})} class={finalClass} {...rest}>
		{@render children?.()}
	</a>
{:else}
	<button {onclick} class={finalClass} {...rest}>
		{@render children?.()}
	</button>
{/if}

<style>
	:global(.animate-shimmer) {
		animation: shimmer 2s linear infinite;
	}

	@keyframes shimmer {
		from {
			background-position: 0 0;
		}
		to {
			background-position: -200% 0;
		}
	}
</style>
