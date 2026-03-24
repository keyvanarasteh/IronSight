<script lang="ts">
	import { cn } from '../../utils';
	import type { Snippet } from 'svelte';

	let {
		class: className = '',
		header,
		footer,
		children
	}: {
		class?: string;
		header?: Snippet;
		footer?: Snippet;
		children?: Snippet;
	} = $props();
</script>

<div
	class={cn(
		'relative flex flex-col justify-between overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 hover:border-zinc-300 hover:shadow-md dark:bg-zinc-950 dark:hover:border-zinc-700',
		className
	)}
>
	{#if header}
		<div class="p-6 pb-2">
			{@render header()}
		</div>
	{/if}

	<div class="grow p-6 pt-0">
		{@render children?.()}
	</div>

	{#if footer}
		<div
			class="mt-auto border-t border-zinc-100 bg-zinc-50 p-6 pt-0 dark:border-zinc-800 dark:bg-zinc-900"
		>
			{@render footer()}
		</div>
	{/if}
</div>
