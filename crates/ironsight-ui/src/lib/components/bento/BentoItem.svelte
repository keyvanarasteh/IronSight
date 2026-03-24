<script lang="ts">
	import { cn } from '../../utils';
	import type { Snippet } from 'svelte';

	let {
		class: className = '',
		children
	}: {
		class?: string;
		children?: Snippet;
	} = $props();
</script>

<div
	class={cn(
		'group border-border bg-card text-card-foreground relative overflow-hidden rounded-xl border p-6 shadow-md transition-all hover:shadow-lg',
		className
	)}
>
	{@render children?.()}
</div>
