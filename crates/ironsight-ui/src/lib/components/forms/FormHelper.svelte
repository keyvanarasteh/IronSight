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

<div
	class={cn(
		'vsc-form-helper text-foreground my-[4px] block max-w-[720px] text-[13px] leading-[1.4] opacity-90',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
