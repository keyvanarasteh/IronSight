<script lang="ts">
	import { cn } from '../../utils';
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';

	let {
		start,
		end,
		split = 'vertical',
		resetOnDblClick = false,
		handleSize = 4,
		initialHandlePosition = '50%',
		fixedPane = 'none',
		minStart = '0px',
		minEnd = '0px',
		class: className,
		...rest
	}: {
		start?: Snippet;
		end?: Snippet;
		split?: 'vertical' | 'horizontal';
		resetOnDblClick?: boolean;
		handleSize?: number;
		initialHandlePosition?: string;
		fixedPane?: 'start' | 'end' | 'none';
		minStart?: string;
		minEnd?: string;
		class?: string;
		[key: string]: unknown;
	} = $props();

	let containerNode: HTMLDivElement | undefined = $state();
	let handlePositionPx = $state(0);
	let isDragging = $state(false);
	let hover = $state(false);
	let maxDimension = $state(0);

	function parseValue(val: string, max: number): number {
		if (val.endsWith('%')) return (parseFloat(val) / 100) * max;
		if (val.endsWith('px')) return parseFloat(val);
		return parseFloat(val) || 0;
	}

	function clamp(value: number, max: number) {
		const minSPx = parseValue(minStart, max);
		const minEPx = parseValue(minEnd, max);
		return Math.max(minSPx, Math.min(value, max - minEPx));
	}

	function updateMaxDimension() {
		if (!containerNode) return;
		const rect = containerNode.getBoundingClientRect();
		maxDimension = split === 'vertical' ? rect.width : rect.height;
	}

	function resetPosition() {
		updateMaxDimension();
		handlePositionPx = clamp(parseValue(initialHandlePosition, maxDimension), maxDimension);
	}

	onMount(() => {
		resetPosition();
		const resizeObserver = new ResizeObserver(() => {
			if (!isDragging) {
				const oldMax = maxDimension;
				updateMaxDimension();
				if (oldMax > 0 && maxDimension > 0) {
					if (fixedPane === 'start') {
						handlePositionPx = clamp(handlePositionPx, maxDimension);
					} else if (fixedPane === 'end') {
						handlePositionPx = clamp(maxDimension - (oldMax - handlePositionPx), maxDimension);
					} else {
						const ratio = handlePositionPx / oldMax;
						handlePositionPx = clamp(ratio * maxDimension, maxDimension);
					}
				}
			}
		});
		if (containerNode) resizeObserver.observe(containerNode);
		return () => resizeObserver.disconnect();
	});

	let handleOffset = 0;

	function handleMouseDown(e: MouseEvent) {
		e.preventDefault();
		if (!containerNode) return;

		const rect = containerNode.getBoundingClientRect();
		isDragging = true;

		if (split === 'vertical') {
			handleOffset = e.clientX - rect.left - handlePositionPx;
		} else {
			handleOffset = e.clientY - rect.top - handlePositionPx;
		}

		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isDragging || !containerNode) return;
		const rect = containerNode.getBoundingClientRect();
		let rawPos = split === 'vertical' ? e.clientX - rect.left : e.clientY - rect.top;
		rawPos -= handleOffset;
		handlePositionPx = clamp(rawPos, maxDimension);
	}

	function handleMouseUp() {
		isDragging = false;
		hover = false;
		window.removeEventListener('mousemove', handleMouseMove);
		window.removeEventListener('mouseup', handleMouseUp);
	}

	function handleDblClick() {
		if (resetOnDblClick) resetPosition();
	}
</script>

<div
	bind:this={containerNode}
	class={cn(
		'border-border-subtle relative flex h-full w-full overflow-hidden border border-solid',
		split === 'horizontal' ? 'flex-col' : 'flex-row',
		className
	)}
	{...rest}
>
	<!-- Start Pane -->
	<div
		class={cn(
			'box-border overflow-hidden',
			split === 'vertical' ? 'border-border-subtle border-r' : 'border-border-subtle border-b'
		)}
		style="flex: 0 0 {handlePositionPx}px;"
	>
		{@render start?.()}
	</div>

	<!-- End Pane -->
	<div class="min-h-0 min-w-0 flex-1 overflow-hidden">
		{@render end?.()}
	</div>

	<!-- Handle -->
	<div
		class={cn(
			'absolute z-[2] bg-transparent transition-colors duration-100 ease-out',
			split === 'vertical' ? 'h-full cursor-ew-resize' : 'w-full cursor-ns-resize',
			hover || isDragging ? 'bg-primary' : ''
		)}
		style={split === 'vertical'
			? `left: ${handlePositionPx}px; width: ${handleSize}px; margin-left: -${handleSize / 2}px; top: 0;`
			: `top: ${handlePositionPx}px; height: ${handleSize}px; margin-top: -${handleSize / 2}px; left: 0;`}
		onmouseenter={() => (hover = true)}
		onmouseleave={(e) => {
			if (e.buttons !== 1) hover = false;
		}}
		onmousedown={handleMouseDown}
		ondblclick={handleDblClick}
	></div>

	{#if isDragging}
		<div
			class={cn(
				'fixed inset-0 z-[1]',
				split === 'vertical' ? 'cursor-ew-resize' : 'cursor-ns-resize'
			)}
		></div>
	{/if}
</div>
