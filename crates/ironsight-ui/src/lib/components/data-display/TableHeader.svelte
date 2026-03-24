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

<div role="rowgroup" class={cn('bg-header-bg table w-full table-fixed', className)} {...rest}>
	{@render children?.()}
</div>
