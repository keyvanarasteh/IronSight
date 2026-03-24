<script lang="ts">
	import { Search } from 'lucide-svelte';
	import type { Component } from 'svelte';

	export type QuickAccessItem = {
		label: string;
		description?: string;
		detail?: string;
		icon?: Component;
		keybinding?: string;
		group?: string;
		onclick?: () => void;
	};

	let {
		visible = $bindable(false),
		placeholder = '',
		prefix = '',
		value = $bindable(''),
		items = [] as QuickAccessItem[],
		onselect,
		onclose,
		class: className = ''
	}: {
		visible?: boolean;
		placeholder?: string;
		prefix?: string;
		value?: string;
		items?: QuickAccessItem[];
		onselect?: (item: QuickAccessItem) => void;
		onclose?: () => void;
		class?: string;
	} = $props();

	let inputRef = $state<HTMLInputElement | null>(null);
	let highlightIndex = $state(0);

	const filtered = $derived(
		value ? items.filter((i) => i.label.toLowerCase().includes(value.toLowerCase())) : items
	);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			highlightIndex = Math.min(highlightIndex + 1, filtered.length - 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			highlightIndex = Math.max(highlightIndex - 1, 0);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			const item = filtered[highlightIndex];
			if (item) {
				onselect?.(item);
				item.onclick?.();
				visible = false;
			}
		} else if (e.key === 'Escape') {
			visible = false;
			onclose?.();
		}
	}

	$effect(() => {
		if (visible) {
			highlightIndex = 0;
			setTimeout(() => inputRef?.focus(), 50);
		}
	});
</script>

{#if visible}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-[200]"
		onclick={() => {
			visible = false;
			onclose?.();
		}}
		role="presentation"
	></div>

	<!-- Quick access widget -->
	<div
		class="bg-quickinput-bg border-quickinput-border fixed top-0 left-1/2 z-[201] mt-1 w-[600px] max-w-[90vw] -translate-x-1/2 overflow-hidden rounded-lg border shadow-2xl {className}"
		role="combobox"
		aria-expanded={true}
		aria-controls="quick-access-listbox"
	>
		<!-- Input -->
		<div class="border-quickinput-border flex h-[34px] items-center gap-2 border-b px-3">
			<Search class="text-quickinput-fg h-3.5 w-3.5 shrink-0 opacity-50" />
			{#if prefix}
				<span class="text-quickinput-fg text-xs opacity-60">{prefix}</span>
			{/if}
			<input
				type="text"
				bind:value
				bind:this={inputRef}
				{placeholder}
				class="text-quickinput-fg placeholder:text-foreground/30 m-0 min-w-0 flex-1 border-none bg-transparent p-0 text-xs outline-none"
				onkeydown={handleKeydown}
				aria-label="Quick Access Input"
			/>
		</div>

		<!-- Results -->
		<div class="max-h-[300px] overflow-y-auto" role="listbox" id="quick-access-listbox">
			{#each filtered as item, i (i)}
				{@const isHighlighted = i === highlightIndex}
				<button
					class="m-0 flex w-full cursor-pointer items-center gap-2 border-none bg-transparent px-3 py-1.5 text-left text-xs
						{isHighlighted
						? 'bg-list-active-bg text-list-active-fg'
						: 'text-quickinput-fg hover:bg-list-hover-bg'}"
					role="option"
					aria-selected={isHighlighted}
					onclick={() => {
						onselect?.(item);
						item.onclick?.();
						visible = false;
					}}
					onmouseenter={() => (highlightIndex = i)}
				>
					{#if item.icon}
						{@const Icon = item.icon}
						<Icon class="h-4 w-4 shrink-0 opacity-70" />
					{/if}
					<div class="min-w-0 flex-1">
						<span class="truncate">{item.label}</span>
						{#if item.description}
							<span class="ml-2 opacity-50">{item.description}</span>
						{/if}
					</div>
					{#if item.keybinding}
						<kbd class="shrink-0 font-mono text-[10px] opacity-40">{item.keybinding}</kbd>
					{/if}
				</button>
			{/each}

			{#if filtered.length === 0}
				<div class="text-quickinput-fg px-3 py-4 text-center text-xs opacity-40">
					No matching results
				</div>
			{/if}
		</div>
	</div>
{/if}
