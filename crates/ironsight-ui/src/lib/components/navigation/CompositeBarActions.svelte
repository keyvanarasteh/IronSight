<script lang="ts">
	import type { Component } from 'svelte';

	export type CompositeAction = {
		id: string;
		label: string;
		icon?: Component;
		type: 'pin' | 'unpin' | 'hide' | 'move-up' | 'move-down';
	};

	let {
		itemLabel = '',
		pinned = false,
		onpin,
		onunpin,
		onhide,
		onmoveup,
		onmovedown,
		class: className = ''
	}: {
		itemLabel?: string;
		pinned?: boolean;
		onpin?: () => void;
		onunpin?: () => void;
		onhide?: () => void;
		onmoveup?: () => void;
		onmovedown?: () => void;
		class?: string;
	} = $props();
</script>

<div
	class="bg-menu-bg border-menu-border flex min-w-[140px] flex-col rounded border py-1 shadow-lg {className}"
	role="menu"
>
	{#if pinned}
		<button
			class="text-menu-fg hover:bg-menu-selection hover:text-menu-selection-fg m-0 w-full cursor-pointer border-none bg-transparent px-3 py-1 text-left text-xs"
			role="menuitem"
			onclick={onunpin}
		>
			Unpin {itemLabel}
		</button>
	{:else}
		<button
			class="text-menu-fg hover:bg-menu-selection hover:text-menu-selection-fg m-0 w-full cursor-pointer border-none bg-transparent px-3 py-1 text-left text-xs"
			role="menuitem"
			onclick={onpin}
		>
			Pin {itemLabel}
		</button>
	{/if}

	<div class="bg-menu-separator mx-2 my-1 h-px" role="separator"></div>

	{#if onmoveup}
		<button
			class="text-menu-fg hover:bg-menu-selection hover:text-menu-selection-fg m-0 w-full cursor-pointer border-none bg-transparent px-3 py-1 text-left text-xs"
			role="menuitem"
			onclick={onmoveup}
		>
			Move Up
		</button>
	{/if}
	{#if onmovedown}
		<button
			class="text-menu-fg hover:bg-menu-selection hover:text-menu-selection-fg m-0 w-full cursor-pointer border-none bg-transparent px-3 py-1 text-left text-xs"
			role="menuitem"
			onclick={onmovedown}
		>
			Move Down
		</button>
	{/if}

	<div class="bg-menu-separator mx-2 my-1 h-px" role="separator"></div>

	{#if onhide}
		<button
			class="text-menu-fg hover:bg-menu-selection hover:text-menu-selection-fg m-0 w-full cursor-pointer border-none bg-transparent px-3 py-1 text-left text-xs"
			role="menuitem"
			onclick={onhide}
		>
			Hide {itemLabel}
		</button>
	{/if}
</div>
