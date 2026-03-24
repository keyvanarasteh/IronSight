<script lang="ts">
	import { cn } from '../../utils';
	import type { Snippet } from 'svelte';

	let {
		children,
		class: className,
		...rest
	}: {
		children?: Snippet;
		class?: string;
		[key: string]: unknown;
	} = $props();
</script>

<div class={cn('block max-w-[727px]', className)} {...rest}>
	{@render children?.()}
</div>
