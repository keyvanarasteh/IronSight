<script lang="ts">
	import { cn } from '../../utils';

	let {
		orientation = 'vertical',
		size = 4,
		hoverDelay = 300,
		class: className,
		onchange,
		...rest
	}: {
		orientation?: 'vertical' | 'horizontal';
		size?: number;
		hoverDelay?: number;
		class?: string;
		onchange?: (delta: number) => void;
		[key: string]: unknown;
	} = $props();

	let isDragging = $state(false);
	let isHovering = $state(false);
	let hoverTimer: ReturnType<typeof setTimeout> | null = null;
	let startPos = 0;

	function handleMouseDown(e: MouseEvent) {
		e.preventDefault();
		isDragging = true;
		startPos = orientation === 'vertical' ? e.clientX : e.clientY;
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isDragging) return;
		const currentPos = orientation === 'vertical' ? e.clientX : e.clientY;
		const delta = currentPos - startPos;
		startPos = currentPos;
		onchange?.(delta);
	}

	function handleMouseUp() {
		isDragging = false;
		window.removeEventListener('mousemove', handleMouseMove);
		window.removeEventListener('mouseup', handleMouseUp);
	}

	function handleMouseEnter() {
		hoverTimer = setTimeout(() => {
			isHovering = true;
		}, hoverDelay);
	}

	function handleMouseLeave() {
		if (hoverTimer) clearTimeout(hoverTimer);
		hoverTimer = null;
		if (!isDragging) isHovering = false;
	}
</script>

<div
	class={cn(
		'z-[2] shrink-0 transition-colors duration-100',
		orientation === 'vertical' ? `h-full cursor-ew-resize` : `w-full cursor-ns-resize`,
		isHovering || isDragging ? 'bg-primary' : 'bg-transparent',
		className
	)}
	style={orientation === 'vertical' ? `width: ${size}px;` : `height: ${size}px;`}
	onmousedown={handleMouseDown}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	role="separator"
	aria-orientation={orientation}
	{...rest}
></div>

{#if isDragging}
	<div
		class={cn(
			'fixed inset-0 z-[1]',
			orientation === 'vertical' ? 'cursor-ew-resize' : 'cursor-ns-resize'
		)}
	></div>
{/if}
