<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils';

	let {
		children,
		class: className
	}: {
		children?: Snippet;
		class?: string;
	} = $props();
</script>

<div
	class={cn(
		'inline-flex w-full items-stretch',
		// Strip border radiuses manually via descendant combinations
		'[&>.btn-base:not(:first-child)]:rounded-l-none [&>.btn-base:not(:first-child)]:border-l-0',
		'[&>.btn-base:not(:last-child)]:rounded-r-none [&>.btn-base:not(:last-child)]:border-r-0',
		// Add separator simulation
		'[&>.btn-base:not(:last-child)]:after:absolute [&>.btn-base:not(:last-child)]:after:top-[4px] [&>.btn-base:not(:last-child)]:after:right-0 [&>.btn-base:not(:last-child)]:after:bottom-[4px] [&>.btn-base:not(:last-child)]:after:w-[1px] [&>.btn-base:not(:last-child)]:after:bg-white/40',
		// Adjust separation line contrast for secondary button styles
		// Separator contrast for secondary buttons handled via CSS below
		className
	)}
>
	{@render children?.()}
</div>

<style>
	/* Secondary button separator contrast — avoids Lightning CSS warning from escaped Tailwind selectors */
	div > :global(.btn-base:not(:last-child)[class*='bg-']):after {
		background-color: var(--divider);
	}
</style>
