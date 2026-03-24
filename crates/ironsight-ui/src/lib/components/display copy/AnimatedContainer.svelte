<script lang="ts">
	import { cn } from '../../utils';
	import type { Snippet } from 'svelte';

	let {
		children,
		expanded = true,
		duration = 200,
		class: className,
		...rest
	}: {
		children?: Snippet;
		expanded?: boolean;
		duration?: number;
		class?: string;
		[key: string]: unknown;
	} = $props();

	let contentRef: HTMLDivElement | undefined = $state();
	let height = $state<string>('auto');

	$effect(() => {
		if (!contentRef) return;
		if (expanded) {
			const h = contentRef.scrollHeight;
			height = `${h}px`;
			const timeout = setTimeout(() => {
				height = 'auto';
			}, duration);
			return () => clearTimeout(timeout);
		} else {
			height = `${contentRef.scrollHeight}px`;
			requestAnimationFrame(() => {
				height = '0px';
			});
		}
	});
</script>

<div
	bind:this={contentRef}
	class={cn('overflow-hidden', className)}
	style="height: {height}; transition: height {duration}ms ease;"
	{...rest}
>
	{@render children?.()}
</div>
