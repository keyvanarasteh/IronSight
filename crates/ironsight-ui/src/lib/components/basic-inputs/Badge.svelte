<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { BadgeVariant } from '../../types';
	import { cn } from '../../utils';

	let {
		children,
		count,
		maxCount = 99,
		variant = 'default',
		class: className
	}: {
		children?: Snippet;
		count?: number;
		maxCount?: number;
		variant?: BadgeVariant;
		class?: string;
	} = $props();

	let displayCount = $derived(
		count !== undefined ? (count > maxCount ? `${maxCount}+` : `${count}`) : ''
	);

	const variantClasses: Record<BadgeVariant, string> = {
		default:
			'bg-badge-bg text-badge-fg border border-transparent rounded-[2px] text-[11px] leading-[14px] min-w-[18px] px-[3px] py-[2px] text-center whitespace-nowrap',
		counter:
			'bg-badge-bg text-badge-fg border border-transparent text-[11px] text-center whitespace-nowrap rounded-[11px] leading-[11px] min-h-[18px] min-w-[18px] px-[6px] py-[3px]',
		'activity-bar-counter':
			'bg-activitybar-badge-bg text-activitybar-badge-fg border border-transparent text-center whitespace-nowrap rounded-[20px] text-[9px] font-semibold leading-[16px] px-[4px]',
		'tab-header-counter':
			'bg-primary text-foreground-bright border border-transparent text-[11px] text-center whitespace-nowrap rounded-[10px] leading-[10px] min-h-[16px] min-w-[16px] px-[5px] py-[3px]',
		success:
			'bg-success-500/10 text-success-500 border-success-500/20 rounded-[2px] text-[10px] uppercase font-bold px-1.5 py-0.5 border',
		warning:
			'bg-warning-500/10 text-warning-500 border-warning-500/20 rounded-[2px] text-[10px] uppercase font-bold px-1.5 py-0.5 border',
		danger:
			'bg-danger-500/10 text-danger-500 border-danger-500/20 rounded-[2px] text-[10px] uppercase font-bold px-1.5 py-0.5 border',
		info: 'bg-info-500/10 text-info-500 border-info-500/20 rounded-[2px] text-[10px] uppercase font-bold px-1.5 py-0.5 border'
	};
</script>

<div class={cn('root box-border inline-block', variantClasses[variant], className)}>
	{#if count !== undefined}
		{displayCount}
	{:else}
		{@render children?.()}
	{/if}
</div>
