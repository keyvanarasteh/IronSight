<script lang="ts">
	import { cn } from '../../utils';
	import { getContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import type { TabsContext } from './TabHeader.svelte';

	let {
		children,
		class: className,
		...rest
	}: {
		children?: Snippet;
		class?: string;
		[key: string]: unknown;
	} = $props();

	const ctx = getContext<TabsContext>('vscode-tabs');
	const tabId = ctx.registerPanel();

	let active = $derived(ctx.state.selectedIndex === tabId);
	let panel = $derived(ctx.state.panel);
</script>

{#if active}
	<div
		role="tabpanel"
		tabindex="0"
		class={cn(
			'focus-visible:outline-primary block overflow-hidden focus-visible:outline-1 focus-visible:outline-offset-[3px] focus-visible:outline-solid',
			panel && 'bg-background-panel',
			className
		)}
		{...rest}
	>
		{@render children?.()}
	</div>
{/if}
