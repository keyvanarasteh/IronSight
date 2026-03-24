<script lang="ts">
	import { cn } from '../../utils';
	import type { Snippet } from 'svelte';

	let {
		children,
		variant = 'horizontal',
		class: className,
		...rest
	}: {
		children?: Snippet;
		variant?: 'horizontal' | 'vertical';
		class?: string;
		[key: string]: unknown;
	} = $props();
</script>

<div
	class={cn(
		'box-border flex w-full',
		variant === 'horizontal'
			? 'flex-row flex-wrap gap-x-[20px] gap-y-[10px]'
			: 'flex-col gap-y-[15px]',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
