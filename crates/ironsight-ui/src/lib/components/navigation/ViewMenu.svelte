<script lang="ts">
	import { MoreHorizontal } from 'lucide-svelte';

	type ViewMenuItem = {
		label: string;
		checked?: boolean;
		group?: string;
		onclick?: () => void;
	};

	let {
		items = [] as ViewMenuItem[],
		class: className = ''
	}: {
		items?: ViewMenuItem[];
		class?: string;
	} = $props();

	let open = $state(false);
	let menuRef: HTMLDivElement;

	function handleClickOutside(e: MouseEvent) {
		if (menuRef && !menuRef.contains(e.target as Node)) {
			open = false;
		}
	}

	$effect(() => {
		if (open) {
			document.addEventListener('click', handleClickOutside, true);
			return () => document.removeEventListener('click', handleClickOutside, true);
		}
	});

	const grouped = $derived(() => {
		const groups: { group: string; items: ViewMenuItem[] }[] = [];
		let current = '';
		for (const item of items) {
			const g = item.group ?? '';
			if (g !== current || groups.length === 0) {
				current = g;
				groups.push({ group: g, items: [] });
			}
			groups[groups.length - 1]!.items.push(item);
		}
		return groups;
	});
</script>

<div class="relative {className}" bind:this={menuRef}>
	<button
		class="m-0 cursor-pointer rounded border-none bg-transparent p-1 text-current hover:bg-white/10"
		onclick={() => (open = !open)}
		aria-label="View actions"
		aria-haspopup="menu"
		aria-expanded={open}
	>
		<MoreHorizontal class="h-4 w-4" />
	</button>

	{#if open}
		<div
			class="bg-menu-bg border-menu-border absolute top-full right-0 z-50 mt-1 min-w-[160px] rounded border py-1 shadow-lg"
			role="menu"
		>
			{#each grouped() as { items: groupItems }, gi (gi)}
				{#if gi > 0}
					<div class="bg-menu-separator mx-2 my-1 h-px" role="separator"></div>
				{/if}
				{#each groupItems as item, i (i)}
					<button
						class="text-menu-fg hover:bg-menu-selection hover:text-menu-selection-fg m-0 flex w-full cursor-pointer items-center gap-2 border-none bg-transparent px-3 py-1 text-left text-xs"
						role="menuitem"
						onclick={() => {
							item.onclick?.();
							open = false;
						}}
					>
						<span class="w-4 shrink-0 text-center">
							{#if item.checked}✓{/if}
						</span>
						<span>{item.label}</span>
					</button>
				{/each}
			{/each}
		</div>
	{/if}
</div>
