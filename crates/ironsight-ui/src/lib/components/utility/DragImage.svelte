<script lang="ts">
	import { cn } from '../../utils';
	import type { Snippet } from 'svelte';

	let {
		children,
		label = '',
		class: className,
		...rest
	}: {
		children?: Snippet;
		label?: string;
		class?: string;
		[key: string]: unknown;
	} = $props();
</script>

<div
	class={cn(
		'inline-flex items-center gap-[6px] rounded-[3px] px-[8px] py-[4px]',
		'bg-background text-foreground font-sans text-[12px] leading-none',
		'shadow-[0_2px_8px_var(--shadow)]',
		className
	)}
	{...rest}
>
	{#if label}
		<span class="text-foreground-muted">{label}</span>
	{/if}
	{@render children?.()}
</div>
