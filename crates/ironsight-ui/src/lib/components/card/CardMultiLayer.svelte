<script lang="ts">
	import { cn } from '../../utils';
	import type { Snippet } from 'svelte';

	let {
		class: className = '',
		icon,
		title = 'Multi-Layer',
		description = 'Hover to reveal the depth of the stack. This pattern is excellent for representing collections or gamified elements.',
		actionLabel = 'Action'
	}: {
		class?: string;
		icon?: Snippet;
		title?: string;
		description?: string;
		actionLabel?: string;
	} = $props();
</script>

<div
	class={cn('group relative mx-auto h-[350px] w-full max-w-sm', className)}
	style="perspective: 1000px;"
>
	<div
		class={cn(
			'absolute inset-0 z-0 rounded-2xl border border-zinc-200 bg-zinc-50 transition-all duration-500 ease-out dark:border-zinc-700 dark:bg-zinc-800',
			'shadow-md group-hover:-translate-x-6 group-hover:-translate-y-2 group-hover:-rotate-6'
		)}
	></div>

	<div
		class={cn(
			'absolute inset-0 z-10 rounded-2xl border border-zinc-200 bg-zinc-100 transition-all duration-500 ease-out dark:border-zinc-700 dark:bg-zinc-900',
			'shadow-md group-hover:translate-x-6 group-hover:-translate-y-1 group-hover:rotate-3'
		)}
	></div>

	<div
		class="relative z-20 flex h-full flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl transition-transform duration-500 group-hover:-translate-y-1 dark:border-zinc-700 dark:bg-zinc-950"
	>
		<div>
			<div class="mb-4 flex items-center gap-2">
				<div
					class="flex size-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30"
				>
					{#if icon}
						{@render icon()}
					{/if}
				</div>
				<h3 class="text-lg font-bold text-zinc-900 dark:text-zinc-100">{title}</h3>
			</div>
			<p class="text-zinc-600 dark:text-zinc-400">
				{description}
			</p>
		</div>

		<button
			class="w-full rounded-lg bg-zinc-900 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
		>
			{actionLabel}
		</button>
	</div>
</div>
