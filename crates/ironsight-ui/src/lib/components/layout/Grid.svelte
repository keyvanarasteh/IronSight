<script lang="ts">
	import { cn } from '../../utils';
	import type { Snippet } from 'svelte';

	let {
		children,
		columns = 2,
		rows = 1,
		gap = 0,
		class: className,
		...rest
	}: {
		children?: Snippet;
		columns?: number;
		rows?: number;
		gap?: number;
		class?: string;
		[key: string]: unknown;
	} = $props();
</script>

<div
	class={cn('grid h-full w-full', className)}
	style="grid-template-columns: repeat({columns}, 1fr); grid-template-rows: repeat({rows}, 1fr); gap: {gap}px;"
	{...rest}
>
	{@render children?.()}
</div>
