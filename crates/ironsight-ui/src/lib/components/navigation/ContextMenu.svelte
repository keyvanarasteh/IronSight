<script lang="ts">
	import { cn } from '../../utils';
	import type { Snippet } from 'svelte';
	import ContextMenuItem, { type MenuItemData } from './ContextMenuItem.svelte';

	let {
		children,
		data = [],
		show = $bindable(false),
		preventClose = false,
		class: className,
		onselect,
		...rest
	}: {
		children?: Snippet;
		data?: MenuItemData[];
		show?: boolean;
		preventClose?: boolean;
		class?: string;
		onselect?: (detail: MenuItemData) => void;
		[key: string]: unknown;
	} = $props();

	let containerNode: HTMLDivElement | undefined = $state();
	let selectedIndex = $state(-1);

	let clickableIndexes = $derived(
		data.map((item, index) => (!item.separator ? index : -1)).filter((i) => i !== -1)
	);

	function handleClickOutside(e: MouseEvent) {
		if (containerNode && !containerNode.contains(e.target as Node)) {
			show = false;
		}
	}

	$effect(() => {
		if (show) {
			selectedIndex = -1;
			if (containerNode) containerNode.focus();
			// Delay slightly to avoid immediately closing from the click that opened it
			requestAnimationFrame(() => {
				document.addEventListener('click', handleClickOutside);
			});
		} else {
			document.removeEventListener('click', handleClickOutside);
		}
		return () => document.removeEventListener('click', handleClickOutside);
	});

	function handleKeyDown(e: KeyboardEvent) {
		if (!show) return;

		const { key } = e;
		if (['ArrowUp', 'ArrowDown', 'Escape', 'Enter'].includes(key)) {
			e.preventDefault();
		}

		if (key === 'Escape') {
			show = false;
		} else if (key === 'ArrowUp') {
			const currentListIdx = clickableIndexes.indexOf(selectedIndex);
			if (currentListIdx <= 0) {
				selectedIndex = clickableIndexes[clickableIndexes.length - 1] ?? -1;
			} else {
				selectedIndex = clickableIndexes[currentListIdx - 1] ?? -1;
			}
		} else if (key === 'ArrowDown') {
			const currentListIdx = clickableIndexes.indexOf(selectedIndex);
			if (currentListIdx === -1 || currentListIdx === clickableIndexes.length - 1) {
				selectedIndex = clickableIndexes[0] ?? -1;
			} else {
				selectedIndex = clickableIndexes[currentListIdx + 1] ?? -1;
			}
		} else if (key === 'Enter') {
			if (selectedIndex !== -1 && data[selectedIndex]) {
				handleSelect(data[selectedIndex] as MenuItemData);
			}
		}
	}

	function handleSelect(item: MenuItemData) {
		onselect?.(item);
		if (!preventClose) {
			show = false;
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if show}
	<div
		bind:this={containerNode}
		role="menu"
		tabindex="0"
		class={cn(
			'bg-background border-border-subtle text-foreground relative block rounded-[5px] border border-solid py-[4px] font-sans text-[13px] leading-[1.4] whitespace-nowrap shadow-[0_2px_8px_var(--shadow)] focus:outline-none',
			className
		)}
		style="width: max-content;"
		{...rest}
	>
		{#if data && data.length > 0}
			{#each data as item, index (index)}
				<ContextMenuItem
					{...item}
					selected={index === selectedIndex}
					onmouseover={() => {
						if (!item.separator) selectedIndex = index;
					}}
					onmouseout={() => {
						selectedIndex = -1;
					}}
					onselect={() => handleSelect(item)}
				/>
			{/each}
		{:else}
			{@render children?.()}
		{/if}
	</div>
{/if}
