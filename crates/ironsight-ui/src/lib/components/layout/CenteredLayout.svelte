<script lang="ts">
	import { cn } from '../../utils';
	import type { Snippet } from 'svelte';

	let {
		children,
		maxWidth = '900px',
		gutters = '20px',
		class: className,
		...rest
	}: {
		children?: Snippet;
		maxWidth?: string;
		gutters?: string;
		class?: string;
		[key: string]: unknown;
	} = $props();
</script>

<div
	class={cn('mx-auto box-border w-full', className)}
	style="max-width: {maxWidth}; padding-left: {gutters}; padding-right: {gutters};"
	{...rest}
>
	{@render children?.()}
</div>
