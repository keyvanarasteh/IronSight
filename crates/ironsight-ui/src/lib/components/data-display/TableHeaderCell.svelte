<script lang="ts">
	import { cn } from '../../utils';
	import { getContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import type { TableContext } from './Table.svelte';

	let {
		children,
		minWidth = '0',
		class: className,
		...rest
	}: {
		children?: Snippet;
		minWidth?: string | number;
		class?: string;
		[key: string]: unknown;
	} = $props();

	const tableCtx = getContext<TableContext>('vscode-table');
	const state = $derived(tableCtx?.state);
</script>

<div
	role="columnheader"
	class={cn(
		'text-foreground box-border table-cell h-[30px] overflow-hidden px-[10px] py-0 text-left align-middle font-sans text-[13px] font-bold text-ellipsis whitespace-nowrap',
		state?.borderedColumns ? 'border-border-row border-r first:border-l' : '',
		className
	)}
	style="min-width: {minWidth};"
	{...rest}
>
	<div class="wrapper flex min-h-[30px] items-center">
		{@render children?.()}
	</div>
</div>
