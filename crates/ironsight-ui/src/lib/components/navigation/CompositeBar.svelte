<script lang="ts">
	import type { Component } from 'svelte';

	export type CompositeItem = {
		id: string;
		label: string;
		icon: Component;
		badge?: number | string;
		pinned?: boolean;
		visible?: boolean;
		order?: number;
	};

	let {
		items = [] as CompositeItem[],
		activeId = $bindable(''),
		orientation = 'vertical' as 'vertical' | 'horizontal',
		onselect,
		onpin,
		onreorder,
		oncontextmenu,
		class: className = ''
	}: {
		items?: CompositeItem[];
		activeId?: string;
		orientation?: 'vertical' | 'horizontal';
		onselect?: (item: CompositeItem) => void;
		onpin?: (item: CompositeItem) => void;
		onreorder?: (fromIndex: number, toIndex: number) => void;
		oncontextmenu?: (e: MouseEvent, item: CompositeItem) => void;
		class?: string;
	} = $props();

	let dragIndex = $state(-1);

	const visibleItems = $derived(
		items.filter((i) => i.visible !== false).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
	);

	function handleDragStart(e: DragEvent, index: number) {
		dragIndex = index;
		e.dataTransfer!.effectAllowed = 'move';
	}

	function handleDrop(e: DragEvent, toIndex: number) {
		e.preventDefault();
		if (dragIndex >= 0 && dragIndex !== toIndex) {
			onreorder?.(dragIndex, toIndex);
		}
		dragIndex = -1;
	}
</script>

<div
	class="flex {orientation === 'vertical'
		? 'flex-col'
		: 'flex-row'} items-center gap-0.5 {className}"
	role="tablist"
	aria-orientation={orientation}
>
	{#each visibleItems as item, i (i)}
		{@const isActive = item.id === activeId}
		{@const Icon = item.icon}
		<button
			class="group relative m-0 flex h-[48px] w-[48px] cursor-pointer items-center justify-center border-none bg-transparent p-0
				{isActive ? 'text-activitybar-fg' : 'text-activitybar-inactive-fg hover:text-activitybar-fg'}"
			role="tab"
			aria-selected={isActive}
			aria-label={item.label}
			title={item.label}
			draggable="true"
			ondragstart={(e) => handleDragStart(e, i)}
			ondragover={(e) => e.preventDefault()}
			ondrop={(e) => handleDrop(e, i)}
			onclick={() => {
				activeId = item.id;
				onselect?.(item);
			}}
			oncontextmenu={(e) => {
				if (oncontextmenu) {
					e.preventDefault();
					oncontextmenu(e, item);
				}
			}}
		>
			{#if isActive}
				<div
					class="absolute {orientation === 'vertical'
						? 'top-1/4 left-0 h-1/2 w-0.5'
						: 'bottom-0 left-1/4 h-0.5 w-1/2'} bg-activitybar-fg rounded-full"
				></div>
			{/if}
			<Icon class="h-6 w-6" />
			{#if item.badge !== undefined}
				<span
					class="bg-badge-bg text-badge-fg absolute top-1.5 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] leading-none font-bold"
				>
					{item.badge}
				</span>
			{/if}
		</button>
	{/each}
</div>
