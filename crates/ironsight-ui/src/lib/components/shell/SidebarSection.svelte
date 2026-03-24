<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ChevronDown, ChevronRight } from 'lucide-svelte';

	let {
		title,
		open = $bindable(false),
		children
	}: {
		title: string;
		open?: boolean;
		children?: Snippet;
	} = $props();
</script>

<div class="flex flex-col">
	<button
		onclick={() => (open = !open)}
		class="bg-foreground/5 border-sidebar-border hover:bg-sidebar-accent/50 m-0 flex h-6 w-full cursor-pointer items-center border-t border-none px-1 text-left dark:bg-black/10"
	>
		{#if open}
			<ChevronDown class="text-sidebar-foreground h-3.5 w-3.5 opacity-40" />
		{:else}
			<ChevronRight class="text-sidebar-foreground h-3.5 w-3.5 opacity-40" />
		{/if}
		<span class="text-sidebar-foreground ml-1 truncate text-[11px] font-bold opacity-70"
			>{title}</span
		>
	</button>
	{#if open && children}
		<div class="py-0.5">
			{@render children()}
		</div>
	{/if}
</div>
