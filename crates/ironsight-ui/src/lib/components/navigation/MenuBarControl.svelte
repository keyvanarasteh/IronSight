<script lang="ts">
	import type { Snippet, Component } from 'svelte';

	export type MenuBarItem = {
		label: string;
		items?: {
			label: string;
			shortcut?: string;
			separator?: boolean;
			disabled?: boolean;
			onclick?: () => void;
		}[];
	};

	let {
		items = [] as MenuBarItem[],
		compact = false,
		children,
		class: className = ''
	}: {
		items?: MenuBarItem[];
		compact?: boolean;
		children?: Snippet;
		class?: string;
	} = $props();

	let openIndex = $state(-1);

	function handleClickOutside(e: MouseEvent) {
		openIndex = -1;
	}

	$effect(() => {
		if (openIndex >= 0) {
			document.addEventListener('click', handleClickOutside, true);
			return () => document.removeEventListener('click', handleClickOutside, true);
		}
	});

	function handleMenuEnter(index: number) {
		if (openIndex >= 0) openIndex = index;
	}
</script>

<div class="flex h-full items-center {className}" role="menubar">
	{#each items as menu, i (i)}
		<div class="relative">
			<button
				class="m-0 cursor-pointer rounded-sm border-none bg-transparent px-2 py-1 text-[12px]
					{openIndex === i
					? 'bg-menubar-selection-bg text-menubar-selection-fg'
					: 'text-menubar-fg hover:bg-menubar-selection-bg/50'}"
				role="menuitem"
				aria-haspopup="menu"
				aria-expanded={openIndex === i}
				onclick={(e) => {
					e.stopPropagation();
					openIndex = openIndex === i ? -1 : i;
				}}
				onmouseenter={() => handleMenuEnter(i)}
			>
				{menu.label}
			</button>

			{#if openIndex === i && menu.items}
				<div
					class="bg-menu-bg border-menu-border absolute top-full left-0 z-50 mt-0.5 min-w-[220px] rounded border py-1 shadow-xl"
					role="menu"
				>
					{#each menu.items as submenu, i (i)}
						{#if submenu.separator}
							<div class="bg-menu-separator mx-2 my-1 h-px" role="separator"></div>
						{:else}
							<button
								class="m-0 flex w-full cursor-pointer items-center border-none bg-transparent px-4 py-1 text-left text-xs
									{submenu.disabled
									? 'cursor-default opacity-40'
									: 'text-menu-fg hover:bg-menu-selection hover:text-menu-selection-fg'}"
								role="menuitem"
								disabled={submenu.disabled}
								onclick={(e) => {
									e.stopPropagation();
									if (!submenu.disabled) {
										submenu.onclick?.();
										openIndex = -1;
									}
								}}
							>
								<span class="flex-1">{submenu.label}</span>
								{#if submenu.shortcut}
									<kbd class="ml-6 text-right font-mono text-[10px] opacity-50"
										>{submenu.shortcut}</kbd
									>
								{/if}
							</button>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	{/each}

	{#if children}
		{@render children()}
	{/if}
</div>
