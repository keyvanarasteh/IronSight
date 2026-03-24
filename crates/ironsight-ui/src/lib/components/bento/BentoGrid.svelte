<script lang="ts">
	import { cn } from '../../utils';
	import type { Snippet } from 'svelte';
	import BentoItem from './BentoItem.svelte';

	/**
	 * Comprehensive BentoGrid — supports 4-col, 6-col, and custom layouts.
	 *
	 * Usage:
	 *   <BentoGrid columns={4} variant="1" {items} />
	 *   <BentoGrid columns={6} variant="2" {items} />
	 *   <BentoGrid columns={3} gap="4" {items} />
	 *   <BentoGrid {items} layout={[                  // ← fully custom spans
	 *     { colSpan: 2, rowSpan: 2 },
	 *     { colSpan: 1 },
	 *     { colSpan: 1 },
	 *   ]} />
	 *   <BentoGrid>{children}</BentoGrid>              // ← slot-based
	 */

	interface BentoGridItem {
		title?: string;
		content?: string;
		className?: string;
		children?: Snippet;
	}

	interface LayoutSpec {
		colSpan?: number;
		rowSpan?: number;
		colStart?: number;
	}

	let {
		columns = 4,
		variant = '1',
		items = [],
		layout,
		gap = '2',
		itemHeight = 'h-40',
		showPlaceholders = true,
		class: className = '',
		children
	}: {
		/** Number of grid columns on md+ (1–12). Default: 4 */
		columns?: number;
		/** Preset layout variant. '1'–'4' for 4-col, '1'–'4' for 6-col */
		variant?: '1' | '2' | '3' | '4';
		/** Data-driven items array */
		items?: BentoGridItem[];
		/** Custom per-cell layout: overrides variant presets */
		layout?: LayoutSpec[];
		/** Tailwind gap value (e.g. '2', '4', '6') */
		gap?: string;
		/** Default item height class */
		itemHeight?: string;
		/** Show placeholder text when items have no children */
		showPlaceholders?: boolean;
		class?: string;
		children?: Snippet;
	} = $props();

	// ── Preset Layouts ──────────────────────────────────
	const PRESETS_4: Record<string, (i: number) => string> = {
		'1': (i) =>
			cn(
				itemHeight,
				i === 0 && 'md:col-span-3',
				i === 2 && 'md:col-start-1',
				i === 3 && 'md:col-start-2 md:col-span-3'
			),
		'2': (i) => cn(itemHeight, i === 0 && 'md:col-span-3', i > 1 && 'md:col-span-2'),
		'3': (i) =>
			cn(
				itemHeight,
				i === 0 && 'md:col-start-1',
				i === 1 && 'md:col-span-2',
				i === 2 && 'md:col-start-4',
				i === 3 && 'md:col-span-4'
			),
		'4': (i) =>
			cn(
				i === 0 ? 'md:col-span-4 md:row-span-4 md:h-full' : 'h-36',
				i === 1 && 'md:col-span-2',
				i === 2 && 'md:col-span-2 md:row-span-3',
				i === 3 && 'md:col-span-6'
			)
	};

	const PRESETS_6: Record<string, (i: number) => string> = {
		'1': (i) =>
			cn(
				itemHeight,
				i === 1 && 'md:col-span-2 md:h-full md:row-span-2',
				i === 4 && 'md:col-start-4',
				i === 5 && 'md:col-span-4'
			),
		'2': (i) => cn('min-h-40', i === 0 && 'row-span-2 h-full', i === 2 && 'row-span-2 h-full'),
		'3': (i) => cn(itemHeight, i === 2 && 'col-span-2', i === 3 && 'col-span-2'),
		'4': (i) =>
			cn(
				itemHeight,
				i < 2 && 'md:col-span-3',
				i === 2 && 'md:col-span-4',
				i === 3 && 'md:col-span-2',
				i === 4 && 'md:col-span-2',
				i === 5 && 'md:col-span-4'
			)
	};

	// ── Resolve item classes ────────────────────────────
	function getItemClass(index: number): string {
		// Custom layout takes priority
		if (layout && layout[index]) {
			const spec = layout[index];
			return cn(
				itemHeight,
				spec.colSpan && `md:col-span-${spec.colSpan}`,
				spec.rowSpan && `md:row-span-${spec.rowSpan}`,
				spec.colStart && `md:col-start-${spec.colStart}`
			);
		}

		// Preset lookup
		const presets = columns === 6 ? PRESETS_6 : PRESETS_4;
		const fn = presets[variant];
		return fn ? fn(index) : itemHeight;
	}

	// ── Build display items ─────────────────────────────
	let defaultCount = $derived(columns === 6 ? 6 : 4);

	type DisplayItem = { title?: string; content?: string; className: string; children?: Snippet };

	let displayItems: DisplayItem[] = $derived.by(() => {
		if (items.length > 0) {
			return items.map((it, i) => ({
				...it,
				className: it.className || getItemClass(i)
			}));
		}
		if (showPlaceholders) {
			return Array.from(
				{ length: defaultCount },
				(_, i): DisplayItem => ({
					title: `Item ${i + 1}`,
					content: '',
					className: getItemClass(i)
				})
			);
		}
		return [];
	});

	// Grid columns class
	let gridCols = $derived(
		columns <= 2 ? `sm:grid-cols-2` : columns <= 4 ? `md:grid-cols-4` : `md:grid-cols-${columns}`
	);

	// Special override for variant 4 in 4-col mode (uses 6 internal cols)
	let effectiveGridCols = $derived(columns === 4 && variant === '4' ? 'md:grid-cols-6' : gridCols);
</script>

{#if children}
	<!-- Slot-based: consumer controls the grid items -->
	<div class={cn(`grid grid-cols-1 gap-${gap}`, effectiveGridCols, className)}>
		{@render children()}
	</div>
{:else}
	<!-- Data-driven -->
	<div class={cn(`grid grid-cols-1 gap-${gap}`, effectiveGridCols, className)}>
		{#each displayItems as item, i (i)}
			<div class={cn('rounded-lg p-1', item.className)}>
				<BentoItem class="size-full">
					{#if item.children}
						{@render item.children()}
					{:else if showPlaceholders}
						<div
							class="pointer-events-none flex h-full flex-col items-center justify-center p-4 opacity-20"
						>
							<span class="text-xl font-bold">{item.title || ''}</span>
							{#if item.content}
								<p class="text-center text-xs">{item.content}</p>
							{/if}
						</div>
					{/if}
				</BentoItem>
			</div>
		{/each}
	</div>
{/if}
