<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		highlightedLine,
		totalLines = 50
	}: {
		children?: Snippet;
		highlightedLine?: number;
		totalLines?: number;
	} = $props();
</script>

<div class="flex flex-1 overflow-auto font-mono text-[13px] leading-[1.6]">
	<div
		class="bg-background w-10 shrink-0 pt-2 pr-3 text-right text-[11px] opacity-20 select-none md:w-14 md:pr-4"
	>
		<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
		{#each Array(totalLines) as _unused, i (i)}
			<div class={i + 1 === highlightedLine ? 'text-primary font-bold opacity-100' : ''}>
				{i + 1}
			</div>
		{/each}
	</div>

	<div class="text-foreground flex-1 overflow-x-auto pt-2 pb-10 pl-4 whitespace-pre">
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>
