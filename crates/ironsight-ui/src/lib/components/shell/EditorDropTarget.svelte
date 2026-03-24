<script lang="ts">
	type DropZone = 'left' | 'right' | 'top' | 'bottom' | 'center' | null;

	let {
		ondrop,
		class: className = ''
	}: {
		ondrop?: (zone: DropZone) => void;
		class?: string;
	} = $props();

	let activeZone = $state<DropZone>(null);
	let isDragging = $state(false);

	function getZone(e: DragEvent, el: HTMLElement): DropZone {
		const rect = el.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width;
		const y = (e.clientY - rect.top) / rect.height;

		const edgeThreshold = 0.25;
		if (x < edgeThreshold) return 'left';
		if (x > 1 - edgeThreshold) return 'right';
		if (y < edgeThreshold) return 'top';
		if (y > 1 - edgeThreshold) return 'bottom';
		return 'center';
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
		activeZone = getZone(e, e.currentTarget as HTMLElement);
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		if (activeZone) ondrop?.(activeZone);
		activeZone = null;
		isDragging = false;
	}

	function handleDragLeave() {
		activeZone = null;
		isDragging = false;
	}

	const zoneHighlights: Record<string, string> = {
		left: 'left-0 top-0 w-1/2 h-full',
		right: 'right-0 top-0 w-1/2 h-full',
		top: 'left-0 top-0 w-full h-1/2',
		bottom: 'left-0 bottom-0 w-full h-1/2',
		center: 'inset-0'
	};
</script>

<div
	class="relative {className}"
	role="region"
	aria-label="Editor drop target"
	ondragover={handleDragOver}
	ondrop={handleDrop}
	ondragleave={handleDragLeave}
>
	{#if isDragging && activeZone}
		<div
			class="absolute {zoneHighlights[
				activeZone
			]} bg-focusborder/15 border-focusborder/40 pointer-events-none z-50 rounded border-2 transition-all"
		></div>
	{/if}
</div>
