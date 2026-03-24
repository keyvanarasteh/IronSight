<script lang="ts">
	import { cn } from '../../utils';
	import type { Snippet } from 'svelte';

	let {
		variant = '1',
		title = 'Coding is Fun',
		description = '"The only way to learn a new programming language is by writing programs in it." - Dennis Ritchie',
		class: className = '',
		children
	}: {
		variant?: '1' | '2' | '3' | '4';
		title?: string;
		description?: string;
		class?: string;
		children?: Snippet;
	} = $props();
</script>

{#snippet cardBody(extraClass = '')}
	<div class={cn('text-left', extraClass)}>
		<h3 class="mb-1 text-xl font-bold text-gray-900 dark:text-gray-100">
			{title}
		</h3>
		<p class="leading-relaxed text-gray-700 dark:text-gray-400">
			{description}
		</p>
	</div>
{/snippet}

{#if variant === '1'}
	<div class={cn('mx-auto w-full max-w-xl py-8', className)}>
		<div class="relative">
			<div
				class="absolute inset-0 scale-x-95 -rotate-[5deg] rounded-lg bg-gray-200 py-10 dark:bg-zinc-800"
			></div>
			<div
				class="border-border/50 relative mx-auto rounded-lg border bg-white px-6 py-10 shadow backdrop-blur-xl dark:bg-zinc-900/90"
			>
				{#if children}
					{@render children()}
				{:else}
					{@render cardBody()}
				{/if}
			</div>
		</div>
	</div>
{:else if variant === '2'}
	<div class={cn('mx-auto w-full max-w-xl py-6', className)}>
		<div class="relative h-72 sm:h-52">
			<div
				class="absolute -top-4 size-full scale-x-90 scale-y-[1.15] rounded-3xl border border-neutral-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
				style="transform-origin: top center"
			></div>
			<div
				class="absolute flex size-full items-center justify-center rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0px_0px_16px_#D4D4D8] dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-[0px_0px_64px_rgba(39,39,42,0.6)]"
				style="transform-origin: top center"
			>
				{#if children}
					{@render children()}
				{:else}
					{@render cardBody('text-center px-4')}
				{/if}
			</div>
		</div>
	</div>
{:else if variant === '3'}
	<div class={cn('mx-auto w-full max-w-xl py-8', className)}>
		<div class="relative h-72 sm:h-64">
			<div
				class="absolute top-6 size-full scale-x-[1.01] scale-y-[.75] rounded-3xl border border-neutral-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
				style="transform-origin: top center"
			></div>
			<div
				class="absolute flex size-full scale-95 items-center justify-center rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0px_0px_16px_#D4D4D8] dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-[0px_0px_64px_rgba(39,39,42,0.6)]"
				style="transform-origin: top center"
			>
				{#if children}
					{@render children()}
				{:else}
					{@render cardBody('text-center px-4')}
				{/if}
			</div>
		</div>
	</div>
{:else if variant === '4'}
	<div class={cn('mx-auto w-full max-w-xl py-8', className)}>
		<div class="relative h-72 sm:h-48">
			<div
				class="absolute -top-6 size-full scale-[0.95] rounded-3xl border border-neutral-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/30"
				style="transform-origin: top center"
			></div>
			<div
				class="absolute -top-3 size-full scale-[0.97] rounded-3xl border border-neutral-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40"
				style="transform-origin: top center"
			></div>
			<div
				class="absolute flex size-full items-center justify-center rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl shadow-black/[0.1] dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-white/[0.02]"
				style="transform-origin: top center"
			>
				{#if children}
					{@render children()}
				{:else}
					{@render cardBody('text-center px-4')}
				{/if}
			</div>
		</div>
	</div>
{/if}
