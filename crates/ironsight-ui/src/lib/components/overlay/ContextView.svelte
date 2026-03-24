<script lang="ts">
	import { cn } from '../../utils';
	import type { Snippet } from 'svelte';

	let {
		children,
		anchorElement = $bindable<HTMLElement | null>(null),
		show = $bindable(false),
		position = 'below',
		align = 'start',
		offsetX = 0,
		offsetY = 4,
		closeOnClickOutside = true,
		closeOnEscape = true,
		class: className,
		onclose,
		...rest
	}: {
		children?: Snippet;
		anchorElement?: HTMLElement | null;
		show?: boolean;
		position?: 'below' | 'above' | 'left' | 'right';
		align?: 'start' | 'center' | 'end';
		offsetX?: number;
		offsetY?: number;
		closeOnClickOutside?: boolean;
		closeOnEscape?: boolean;
		class?: string;
		onclose?: () => void;
		[key: string]: unknown;
	} = $props();

	let containerRef: HTMLDivElement | undefined = $state();
	let viewStyle = $state('');

	function updatePosition() {
		if (!anchorElement || !containerRef) return;

		const anchor = anchorElement.getBoundingClientRect();
		const container = containerRef.getBoundingClientRect();
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		let top = 0,
			left = 0;

		// Position
		switch (position) {
			case 'below':
				top = anchor.bottom + offsetY;
				break;
			case 'above':
				top = anchor.top - container.height - offsetY;
				break;
			case 'left':
				left = anchor.left - container.width - offsetX;
				top = anchor.top;
				break;
			case 'right':
				left = anchor.right + offsetX;
				top = anchor.top;
				break;
		}

		// Align
		if (position === 'below' || position === 'above') {
			switch (align) {
				case 'start':
					left = anchor.left + offsetX;
					break;
				case 'center':
					left = anchor.left + (anchor.width - container.width) / 2 + offsetX;
					break;
				case 'end':
					left = anchor.right - container.width + offsetX;
					break;
			}
		} else {
			switch (align) {
				case 'start':
					top = anchor.top + offsetY;
					break;
				case 'center':
					top = anchor.top + (anchor.height - container.height) / 2 + offsetY;
					break;
				case 'end':
					top = anchor.bottom - container.height + offsetY;
					break;
			}
		}

		// Viewport clamping
		if (left < 4) left = 4;
		if (left + container.width > vw - 4) left = vw - container.width - 4;
		if (top + container.height > vh - 4) {
			// Flip to above
			if (position === 'below') top = anchor.top - container.height - offsetY;
		}
		if (top < 4) {
			// Flip to below
			if (position === 'above') top = anchor.bottom + offsetY;
			else top = 4;
		}

		viewStyle = `top:${top}px;left:${left}px;`;
	}

	$effect(() => {
		if (show && anchorElement) {
			requestAnimationFrame(updatePosition);
		}
	});

	function handleClickOutside(e: MouseEvent) {
		if (!closeOnClickOutside) return;
		if (
			containerRef &&
			!containerRef.contains(e.target as Node) &&
			anchorElement &&
			!anchorElement.contains(e.target as Node)
		) {
			show = false;
			onclose?.();
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (closeOnEscape && e.key === 'Escape' && show) {
			e.preventDefault();
			show = false;
			onclose?.();
		}
	}

	$effect(() => {
		if (show) {
			requestAnimationFrame(() => {
				document.addEventListener('click', handleClickOutside);
			});
		} else {
			document.removeEventListener('click', handleClickOutside);
		}
		return () => document.removeEventListener('click', handleClickOutside);
	});
</script>

<svelte:window onkeydown={handleKeyDown} onresize={updatePosition} />

{#if show}
	<div
		bind:this={containerRef}
		class={cn(
			'fixed z-[9998] rounded-[4px]',
			'bg-widget-bg border-widget-border border shadow-[0_4px_12px_var(--shadow)]',
			'animate-in fade-in-0 slide-in-from-top-1 duration-100',
			className
		)}
		style={viewStyle}
		{...rest}
	>
		{@render children?.()}
	</div>
{/if}
