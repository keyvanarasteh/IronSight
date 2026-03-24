<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';

	let {
		segments
	}: {
		segments: string[];
	} = $props();
</script>

<div
	class="text-foreground hidden h-7 shrink-0 items-center gap-2 px-4 text-[11px] opacity-50 sm:flex"
>
	{#each segments as segment, i (i)}
		<span class={i === segments.length - 1 ? 'text-foreground/80' : ''}>{segment}</span>
		{#if i < segments.length - 1}
			<ChevronRight class="h-3 w-3" />
		{/if}
	{/each}
</div>
