<script lang="ts">
	import { cn } from '../../utils';
	import CardSimple from './CardSimple.svelte';
	import type { Snippet } from 'svelte';

	let {
		icon,
		title,
		value,
		subtitle,
		trend,
		color = 'primary',
		class: className = '',
		onclick
	}: {
		icon?: string;
		title: string;
		value: number | string;
		subtitle: string;
		trend?: number;
		color?: 'primary' | 'success' | 'warning' | 'danger';
		class?: string;
		onclick?: () => void;
	} = $props();

	// Map generic color intentions to tailwind classes
	const colorMap = {
		primary: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
		success: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
		warning: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
		danger: 'text-red-500 bg-red-500/10 border-red-500/20'
	};

	let colorClass = $derived(colorMap[color] || colorMap.primary);
</script>

<CardSimple
	class={cn(
		'group flex flex-col',
		onclick && 'cursor-pointer hover:border-primary/50',
		className
	)}
>
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div 
		class="flex h-full flex-col justify-between"
		{onclick}
	>
		<div class="flex items-center justify-between pb-2">
			<h3 class="text-sm font-medium tracking-tight text-zinc-500 dark:text-zinc-400">
				{#if icon}
					<span class="mr-1 text-base">{icon}</span>
				{/if}
				{title}
			</h3>
		</div>
		<div>
			<div class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
				{value}
			</div>
			<div class="mt-1 flex items-center text-xs text-zinc-500 dark:text-zinc-400">
				<span class="truncate">{subtitle}</span>
				{#if trend !== undefined}
					<span
						class={cn(
							'ml-2 flex items-center rounded px-1 py-0.5 font-medium',
							trend > 0
								? 'bg-emerald-500/10 text-emerald-500'
								: trend < 0
									? 'bg-red-500/10 text-red-500'
									: 'bg-zinc-500/10 text-zinc-500'
						)}
					>
						{trend > 0 ? '▲' : trend < 0 ? '▼' : '▬'} {Math.abs(trend)}%
					</span>
				{/if}
			</div>
		</div>
	</div>
</CardSimple>
