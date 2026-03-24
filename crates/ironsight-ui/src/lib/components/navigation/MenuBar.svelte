<script lang="ts" module>
	export type MenuBarItemData = {
		label: string;
		mnemonic?: string;
		submenu: import('./ContextMenuItem.svelte').MenuItemData[];
	};
</script>

<script lang="ts">
	import { cn } from '../../utils';
	import ContextMenu from './ContextMenu.svelte';

	let {
		items = [],
		class: className,
		...rest
	}: {
		items?: MenuBarItemData[];
		class?: string;
		[key: string]: unknown;
	} = $props();

	let activeIndex = $state(-1);
	let isOpen = $state(false);

	function handleItemClick(index: number) {
		if (isOpen && activeIndex === index) {
			isOpen = false;
			activeIndex = -1;
		} else {
			activeIndex = index;
			isOpen = true;
		}
	}

	function handleMouseEnter(index: number) {
		if (isOpen) {
			activeIndex = index;
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (!isOpen && !['ArrowLeft', 'ArrowRight', 'Enter', ' '].includes(e.key)) return;

		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			activeIndex = activeIndex <= 0 ? items.length - 1 : activeIndex - 1;
			if (!isOpen) isOpen = true;
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			activeIndex = activeIndex >= items.length - 1 ? 0 : activeIndex + 1;
			if (!isOpen) isOpen = true;
		} else if (e.key === 'Escape') {
			e.preventDefault();
			isOpen = false;
			activeIndex = -1;
		} else if ((e.key === 'Enter' || e.key === ' ') && activeIndex >= 0 && !isOpen) {
			e.preventDefault();
			isOpen = true;
		}

		// Alt+letter mnemonic
		if (e.altKey && e.key.length === 1) {
			const letter = e.key.toLowerCase();
			const idx = items.findIndex(
				(item) => (item.mnemonic ?? item.label[0])?.toLowerCase() === letter
			);
			if (idx >= 0) {
				e.preventDefault();
				activeIndex = idx;
				isOpen = true;
			}
		}
	}

	function handleMenuSelect() {
		isOpen = false;
		activeIndex = -1;
	}

	function getMnemonicLabel(item: MenuBarItemData): {
		before: string;
		letter: string;
		after: string;
	} {
		const mnemonic = item.mnemonic ?? item.label[0] ?? '';
		const idx = item.label.toLowerCase().indexOf(mnemonic.toLowerCase());
		if (idx === -1) return { before: item.label, letter: '', after: '' };
		return {
			before: item.label.slice(0, idx),
			letter: item.label[idx]!,
			after: item.label.slice(idx + 1)
		};
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

<div
	class={cn(
		'flex h-[30px] items-stretch font-sans text-[13px] select-none',
		'bg-menu-bg text-menu-fg',
		className
	)}
	role="menubar"
	{...rest}
>
	{#each items as item, index (index)}
		{@const parts = getMnemonicLabel(item)}
		<div class="relative">
			<button
				type="button"
				role="menuitem"
				class={cn(
					'flex h-full cursor-pointer items-center border-none px-[8px] transition-colors',
					'text-menu-fg hover:bg-menu-selection hover:text-menu-selection-fg bg-transparent',
					activeIndex === index && isOpen && 'bg-menu-selection text-menu-selection-fg'
				)}
				onclick={() => handleItemClick(index)}
				onmouseenter={() => handleMouseEnter(index)}
			>
				{parts.before}<span class="underline">{parts.letter}</span>{parts.after}
			</button>

			{#if activeIndex === index && isOpen}
				<div class="absolute top-full left-0 z-9999">
					<ContextMenu data={item.submenu} bind:show={isOpen} onselect={handleMenuSelect} />
				</div>
			{/if}
		</div>
	{/each}
</div>
