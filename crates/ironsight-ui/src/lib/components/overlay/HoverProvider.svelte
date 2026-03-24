<script lang="ts" module>
	export type HoverGroup = {
		id: string;
		lastShown: number;
	};
</script>

<script lang="ts">
	import { cn } from '../../utils';
	import type { Snippet } from 'svelte';

	let {
		children,
		content,
		position = 'top',
		delay = 500,
		instantDelay = 0,
		groupId = '',
		class: className,
		...rest
	}: {
		children?: Snippet;
		content?: Snippet;
		position?: 'top' | 'bottom' | 'left' | 'right';
		delay?: number;
		instantDelay?: number;
		groupId?: string;
		class?: string;
		[key: string]: unknown;
	} = $props();

	// Shared group state — if same group was just shown, skip delay
	const groupStore =
		typeof globalThis !== 'undefined'
			? ((globalThis as any).__qixHoverGroups ??= new Map<string, number>())
			: new Map<string, number>();

	let show = $state(false);
	let timer: ReturnType<typeof setTimeout> | null = null;
	let triggerRef: HTMLSpanElement | undefined = $state();
	let hoverRef: HTMLDivElement | undefined = $state();
	let hoverStyle = $state('');

	function updatePosition() {
		if (!triggerRef || !hoverRef) return;
		const rect = triggerRef.getBoundingClientRect();
		const tip = hoverRef.getBoundingClientRect();
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

		const vw = window.innerWidth;
		const vh = window.innerHeight;
		if (left < 4) left = 4;
		if (left + tip.width > vw - 4) left = vw - tip.width - 4;
		if (top < 4) top = rect.bottom + gap;
		if (top + tip.height > vh - 4) top = rect.top - tip.height - gap;

		hoverStyle = `top:${top}px;left:${left}px;`;
	}

	function handleEnter() {
		let actualDelay = delay;

		// Group-based instant show
		if (groupId) {
			const lastShown = groupStore.get(groupId) ?? 0;
			if (Date.now() - lastShown < 300) {
				actualDelay = instantDelay;
			}
		}

		timer = setTimeout(() => {
			show = true;
			if (groupId) groupStore.set(groupId, Date.now());
			requestAnimationFrame(updatePosition);
		}, actualDelay);
	}

	function handleLeave() {
		if (timer) clearTimeout(timer);
		timer = null;
		show = false;
		if (groupId) groupStore.set(groupId, Date.now());
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

{#if show && content}
	<div
		bind:this={hoverRef}
		role="complementary"
		class={cn(
			'fixed z-[10000] max-w-[500px] rounded-[4px] text-[13px] leading-[1.4]',
			'bg-widget-bg text-foreground border-widget-border border shadow-[0_2px_8px_var(--shadow)]',
			'animate-in fade-in-0 duration-150',
			className
		)}
		style={hoverStyle}
		onmouseenter={() => {
			if (timer) clearTimeout(timer);
		}}
		onmouseleave={handleLeave}
		{...rest}
	>
		<div class="p-2">
			{@render content()}
		</div>
	</div>
{/if}
