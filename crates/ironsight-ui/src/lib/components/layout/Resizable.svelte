<script lang="ts">
	import { cn } from '../../utils';
	import type { Snippet } from 'svelte';

	let {
		children,
		edges = ['right', 'bottom'],
		corners = false,
		minWidth = 100,
		minHeight = 100,
		maxWidth = Infinity,
		maxHeight = Infinity,
		class: className,
		onresize,
		...rest
	}: {
		children?: Snippet;
		edges?: ('top' | 'right' | 'bottom' | 'left')[];
		corners?: boolean;
		minWidth?: number;
		minHeight?: number;
		maxWidth?: number;
		maxHeight?: number;
		class?: string;
		onresize?: (size: { width: number; height: number }) => void;
		[key: string]: unknown;
	} = $props();

	let containerRef: HTMLDivElement | undefined = $state();
	let isDragging = $state(false);
	let dragEdge = $state('');

	function handleMouseDown(edge: string, e: MouseEvent) {
		e.preventDefault();
		if (!containerRef) return;
		isDragging = true;
		dragEdge = edge;

		const rect = containerRef.getBoundingClientRect();
		const startX = e.clientX;
		const startY = e.clientY;
		const startW = rect.width;
		const startH = rect.height;

		function onMove(ev: MouseEvent) {
			let w = startW;
			let h = startH;
			const dx = ev.clientX - startX;
			const dy = ev.clientY - startY;

			if (edge.includes('right')) w = startW + dx;
			if (edge.includes('left')) w = startW - dx;
			if (edge.includes('bottom')) h = startH + dy;
			if (edge.includes('top')) h = startH - dy;

			w = Math.max(minWidth, Math.min(w, maxWidth));
			h = Math.max(minHeight, Math.min(h, maxHeight));

			if (containerRef) {
				containerRef.style.width = `${w}px`;
				containerRef.style.height = `${h}px`;
			}
			onresize?.({ width: w, height: h });
		}

		function onUp() {
			isDragging = false;
			dragEdge = '';
			window.removeEventListener('mousemove', onMove);
			window.removeEventListener('mouseup', onUp);
		}

		window.addEventListener('mousemove', onMove);
		window.addEventListener('mouseup', onUp);
	}

	const edgeCursors: Record<string, string> = {
		top: 'cursor-ns-resize',
		bottom: 'cursor-ns-resize',
		left: 'cursor-ew-resize',
		right: 'cursor-ew-resize',
		'top-left': 'cursor-nwse-resize',
		'top-right': 'cursor-nesw-resize',
		'bottom-left': 'cursor-nesw-resize',
		'bottom-right': 'cursor-nwse-resize'
	};
</script>

<div bind:this={containerRef} class={cn('relative inline-block', className)} {...rest}>
	{@render children?.()}

	<!-- Edge handles -->
	{#each edges as edge (edge)}
		<div
			class={cn(
				'absolute z-[3]',
				edgeCursors[edge],
				edge === 'top' && 'top-0 right-0 left-0 h-[4px]',
				edge === 'bottom' && 'right-0 bottom-0 left-0 h-[4px]',
				edge === 'left' && 'top-0 bottom-0 left-0 w-[4px]',
				edge === 'right' && 'top-0 right-0 bottom-0 w-[4px]'
			)}
			onmousedown={(e) => handleMouseDown(edge, e)}
		></div>
	{/each}

	<!-- Corner handles -->
	{#if corners}
		{#each ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as corner (corner)}
			<div
				class={cn(
					'absolute z-[4] h-[8px] w-[8px]',
					edgeCursors[corner],
					corner === 'top-left' && 'top-0 left-0',
					corner === 'top-right' && 'top-0 right-0',
					corner === 'bottom-left' && 'bottom-0 left-0',
					corner === 'bottom-right' && 'right-0 bottom-0'
				)}
				onmousedown={(e) => handleMouseDown(corner, e)}
			></div>
		{/each}
	{/if}

	{#if isDragging}
		<div class={cn('fixed inset-0 z-[2]', edgeCursors[dragEdge])}></div>
	{/if}
</div>
