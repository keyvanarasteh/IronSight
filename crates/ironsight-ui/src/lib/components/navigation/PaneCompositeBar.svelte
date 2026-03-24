<script lang="ts">
	import type { Component } from 'svelte';

	export type PaneCompositeItem = {
		id: string;
		label: string;
		icon?: Component;
		badge?: number;
	};

	let {
		items = [] as PaneCompositeItem[],
		activeId = $bindable(''),
		onselect,
		class: className = ''
	}: {
		items?: PaneCompositeItem[];
		activeId?: string;
		onselect?: (item: PaneCompositeItem) => void;
		class?: string;
	} = $props();
</script>

<div
	class="scrollbar-none flex h-[35px] items-center gap-0 overflow-x-auto px-2 {className}"
	role="tablist"
>
	{#each items as item, i (i)}
		{@const isActive = item.id === activeId}
		<button
			class="relative m-0 flex h-full cursor-pointer items-center gap-1.5 border-none bg-transparent px-3 text-[11px] font-medium tracking-wider uppercase select-none
				{isActive ? 'text-foreground' : 'text-foreground/50 hover:text-foreground/70'}"
			role="tab"
			aria-selected={isActive}
			onclick={() => {
				activeId = item.id;
				onselect?.(item);
			}}
		>
			{#if item.icon}
				<item.icon class="h-3.5 w-3.5" />
			{/if}
			<span>{item.label}</span>
			{#if item.badge && item.badge > 0}
				<span class="bg-badge-bg text-badge-fg rounded-full px-1 text-[9px] leading-4 font-bold"
					>{item.badge}</span
				>
			{/if}
			{#if isActive}
				<div class="bg-focusborder absolute right-2 bottom-0 left-2 h-px"></div>
			{/if}
		</button>
	{/each}
</div>
