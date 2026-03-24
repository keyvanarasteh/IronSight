<script lang="ts">
	import { cn } from '../../utils';
	import type { Snippet } from 'svelte';

	let {
		gradient = false,
		class: className = '',
		label,
		children
	}: {
		gradient?: boolean;
		class?: string;
		label?: Snippet;
		children?: Snippet;
	} = $props();
</script>

{#if label}
	<div class="flex w-full items-center gap-4">
		<div
			class={cn(
				'h-[1px] w-full rounded-full',
				gradient ? 'via-border to-border bg-gradient-to-r from-transparent' : 'bg-border',
				className
			)}
		></div>

		<div class="flex-shrink-0">
			{@render label()}
		</div>

		<div
			class={cn(
				'h-[1px] w-full rounded-full',
				gradient ? 'from-border via-border bg-gradient-to-r to-transparent' : 'bg-border',
				className
			)}
		></div>
	</div>
{:else if children}
	{@render children()}
{:else}
	<div
		role="separator"
		aria-orientation="horizontal"
		class={cn(
			'h-[1px] w-full rounded-full',
			gradient ? 'via-border bg-gradient-to-r from-transparent to-transparent' : 'bg-border',
			className
		)}
	></div>
{/if}
