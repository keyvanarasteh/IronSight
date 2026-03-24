<script lang="ts">
	import { cn } from '../../utils';
	import type { Snippet } from 'svelte';

	let {
		children,
		text = '',
		position = 'top',
		delay = 500,
		class: className,
		...rest
	}: {
		children?: Snippet;
		text?: string;
		position?: 'top' | 'bottom' | 'left' | 'right';
		delay?: number;
		class?: string;
		[key: string]: unknown;
	} = $props();

	let show = $state(false);
	let timer: ReturnType<typeof setTimeout> | null = null;
	let triggerRef: HTMLSpanElement | undefined = $state();
	let tooltipRef: HTMLDivElement | undefined = $state();
	let tooltipStyle = $state('');

	function updatePosition() {
		if (!triggerRef || !tooltipRef) return;
		const rect = triggerRef.getBoundingClientRect();
		const tip = tooltipRef.getBoundingClientRect();
		const gap = 6;
		let top = 0,
			left = 0;

		switch (position) {
			case 'top':
				top = rect.top - tip.height - gap;
				left = rect.left + (rect.width - tip.width) / 2;
				break;
			case 'bottom':
				top = rect.bottom + gap;
				left = rect.left + (rect.width - tip.width) / 2;
				break;
			case 'left':
				top = rect.top + (rect.height - tip.height) / 2;
				left = rect.left - tip.width - gap;
				break;
			case 'right':
				top = rect.top + (rect.height - tip.height) / 2;
				left = rect.right + gap;
				break;
		}

		// Viewport clamping
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		if (left < 4) left = 4;
		if (left + tip.width > vw - 4) left = vw - tip.width - 4;
		if (top < 4) top = rect.bottom + gap; // flip to bottom
		if (top + tip.height > vh - 4) top = rect.top - tip.height - gap; // flip to top

		tooltipStyle = `top:${top}px;left:${left}px;`;
	}

	function handleEnter() {
		timer = setTimeout(() => {
			show = true;
			requestAnimationFrame(updatePosition);
		}, delay);
	}

	function handleLeave() {
		if (timer) clearTimeout(timer);
		timer = null;
		show = false;
	}
</script>

<span
	bind:this={triggerRef}
	class="inline-flex"
	role="group"
	onmouseenter={handleEnter}
	onmouseleave={handleLeave}
	onfocusin={handleEnter}
	onfocusout={handleLeave}
>
	{@render children?.()}
</span>

{#if show && text}
	<div
		bind:this={tooltipRef}
		role="tooltip"
		class={cn(
			'pointer-events-none fixed z-[10000] rounded-[3px] px-[6px] py-[2px] text-[12px] leading-[18px] whitespace-nowrap',
			'bg-widget-bg text-foreground border-widget-border border shadow-[0_2px_8px_var(--shadow)]',
			'animate-in fade-in-0 duration-100',
			className
		)}
		style={tooltipStyle}
		{...rest}
	>
		{text}
	</div>
{/if}
