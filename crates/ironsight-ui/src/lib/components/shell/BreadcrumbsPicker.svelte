<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';

	export type BreadcrumbItem = {
		label: string;
		icon?: import('svelte').Component;
		items?: { label: string; icon?: import('svelte').Component; onclick?: () => void }[];
	};

	let {
		segments = [] as BreadcrumbItem[],
		onselect,
		class: className = ''
	}: {
		segments?: BreadcrumbItem[];
		onselect?: (segment: BreadcrumbItem, index: number) => void;
		class?: string;
	} = $props();

	let openIndex = $state(-1);

	function togglePicker(index: number) {
		openIndex = openIndex === index ? -1 : index;
	}

	function handleClickOutside() {
		openIndex = -1;
	}

	$effect(() => {
		if (openIndex >= 0) {
			document.addEventListener('click', handleClickOutside, true);
			return () => document.removeEventListener('click', handleClickOutside, true);
		}
	});
</script>

<nav
	class="text-foreground/60 bg-breadcrumb-bg flex h-[22px] items-center gap-0.5 overflow-hidden px-2 text-[11px] select-none {className}"
	aria-label="Breadcrumb"
>
	{#each segments as segment, i (i)}
		{#if i > 0}
			<ChevronRight class="h-3 w-3 shrink-0 opacity-40" />
		{/if}
		<div class="relative">
			<button
				class="hover:text-foreground m-0 flex cursor-pointer items-center gap-1 rounded border-none bg-transparent px-1 py-0.5 text-current hover:bg-white/10"
				onclick={(e) => {
					e.stopPropagation();
					(() => {
						onselect?.(segment, i);
						if (segment.items?.length) togglePicker(i);
					})();
				}}
				aria-haspopup={segment.items?.length ? 'listbox' : undefined}
			>
				{#if segment.icon}
					<segment.icon class="h-3.5 w-3.5 shrink-0 opacity-70" />
				{/if}
				<span class="truncate">{segment.label}</span>
			</button>

			{#if openIndex === i && segment.items?.length}
				<div
					class="bg-menu-bg border-menu-border absolute top-full left-0 z-50 mt-0.5 min-w-[160px] rounded border py-1 shadow-lg"
					role="listbox"
				>
					{#each segment.items as item (item.label)}
						<button
							class="text-menu-fg hover:bg-menu-selection hover:text-menu-selection-fg m-0 flex w-full cursor-pointer items-center gap-2 border-none bg-transparent px-3 py-1 text-left text-xs"
							role="option"
							aria-selected={false}
							onclick={(e) => {
								e.stopPropagation();
								(() => {
									item.onclick?.();
									openIndex = -1;
								})();
							}}
						>
							{#if item.icon}
								<item.icon class="h-3.5 w-3.5 opacity-70" />
							{/if}
							<span>{item.label}</span>
						</button>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</nav>
