<script lang="ts" module>
	export type TabsContext = {
		state: { selectedIndex: number; panel: boolean };
		registerHeader: () => number;
		registerPanel: () => number;
		selectTab: (index: number) => void;
	};
</script>

<script lang="ts">
	import { cn } from '../../utils';
	import { getContext } from 'svelte';
	import type { Snippet } from 'svelte';

	let {
		children,
		contentBefore,
		contentAfter,
		class: className,
		...rest
	}: {
		children?: Snippet;
		contentBefore?: Snippet;
		contentAfter?: Snippet;
		class?: string;
		[key: string]: unknown;
	} = $props();

	const ctx = getContext<TabsContext>('vscode-tabs');
	const tabId = ctx.registerHeader();

	let active = $derived(ctx.state.selectedIndex === tabId);
	let panel = $derived(ctx.state.panel);

	function handleClick() {
		ctx.selectTab(tabId);
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleClick();
		}
	}
</script>

<div
	role="tab"
	aria-selected={active}
	tabindex={active ? 0 : -1}
	onclick={handleClick}
	onkeydown={handleKeyDown}
	class={cn(
		'focus-visible:outline-primary relative flex min-h-[20px] cursor-pointer items-center overflow-hidden border-b border-solid px-[8px] py-[7px] text-ellipsis whitespace-nowrap select-none focus:outline-none focus-visible:outline-1 focus-visible:outline-offset-[3px] focus-visible:outline-solid',
		panel
			? 'mb-0 h-[31px] border-b-0 px-[10px] py-[2px] text-[11px] uppercase focus-visible:-outline-offset-2'
			: 'border-b-transparent',
		!panel && active ? 'text-foreground border-b-foreground' : 'text-foreground',
		panel && !active ? 'text-foreground-muted hover:text-foreground' : '',
		panel && active ? 'text-foreground' : '',
		className
	)}
	{...rest}
>
	{#if contentBefore}
		<div class="mr-[8px]">
			{@render contentBefore()}
		</div>
	{/if}
	<div class="overflow-inherit text-ellipsis">
		{@render children?.()}
	</div>
	{#if contentAfter}
		<div class="ml-[8px]">
			{@render contentAfter()}
		</div>
	{/if}

	{#if active && panel}
		<span
			class="border-primary pointer-events-none absolute right-[8px] bottom-[4px] left-[8px] block border-t border-solid"
		></span>
	{/if}
</div>
