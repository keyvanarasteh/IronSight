<script lang="ts">
	import { cn } from '../../utils';
	import type { Snippet } from 'svelte';

	let {
		children,
		for: forId,
		required = false,
		class: className,
		...rest
	}: {
		children?: Snippet;
		for?: string;
		required?: boolean;
		class?: string;
		[key: string]: unknown;
	} = $props();
</script>

<label
	for={forId}
	class={cn(
		'text-foreground block cursor-default py-[5px] text-[13px] leading-[1.3] font-semibold',
		required && 'after:content-["_*"]',
		className
	)}
	{...rest}
>
	{@render children?.()}
</label>
