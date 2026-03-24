<script lang="ts">
	import { cn } from '../../utils';
	import { setContext } from 'svelte';
	import type { Snippet } from 'svelte';

	let {
		children,
		header,
		addons,
		selectedIndex = $bindable(0),
		panel = false,
		class: className,
		...rest
	}: {
		children?: Snippet;
		header?: Snippet;
		addons?: Snippet;
		selectedIndex?: number;
		panel?: boolean;
		class?: string;
		[key: string]: unknown;
	} = $props();

	let headerCount = 0;
	let panelCount = 0;

	const tabState = $state({
		selectedIndex,
		panel: false
	});

	$effect(() => {
		tabState.selectedIndex = selectedIndex;
	});
	$effect(() => {
		tabState.panel = panel;
	});
	$effect(() => {
		selectedIndex = tabState.selectedIndex;
	});

	setContext('vscode-tabs', {
		get state() {
			return tabState;
		},
		registerHeader: () => headerCount++,
		registerPanel: () => panelCount++,
		selectTab: (index: number) => {
			tabState.selectedIndex = index;
		}
	});
</script>

<div class={cn('block', className)} {...rest}>
	<div
		class={cn(
			'border-border-tab flex w-full items-center border-b border-solid font-sans text-[13px]',
			panel && 'bg-background-panel box-border border-b-0 px-[8px]'
		)}
	>
		<div role="tablist" class="-mb-[1px] flex">
			{@render header?.()}
		</div>
		{#if addons}
			<div class="ml-auto block">
				{@render addons()}
			</div>
		{/if}
	</div>
	{@render children?.()}
</div>
