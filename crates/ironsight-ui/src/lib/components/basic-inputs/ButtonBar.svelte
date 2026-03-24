<script lang="ts">
	import { cn } from '../../utils';
	import type { Snippet } from 'svelte';

	let {
		children,
		alignment = 'right',
		class: className,
		...rest
	}: {
		children?: Snippet;
		alignment?: 'left' | 'center' | 'right';
		class?: string;
		[key: string]: unknown;
	} = $props();

	const alignClasses = {
		left: 'justify-start',
		center: 'justify-center',
		right: 'justify-end'
	};
</script>

<div class={cn('flex flex-wrap items-center gap-2', alignClasses[alignment], className)} {...rest}>
	{@render children?.()}
</div>
