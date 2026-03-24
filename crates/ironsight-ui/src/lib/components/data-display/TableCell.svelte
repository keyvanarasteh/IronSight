<script lang="ts">
	import { cn } from '../../utils';
	import { getContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import type { TableContext } from './Table.svelte';

	let {
		children,
		columnLabel = '',
		class: className,
		...rest
	}: {
		children?: Snippet;
		columnLabel?: string;
		class?: string;
		[key: string]: unknown;
	} = $props();

	const tableCtx = getContext<TableContext>('vscode-table');
	const state = $derived(tableCtx?.state);
</script>

<div
	role="cell"
	class={cn(
		'box-border h-[24px] overflow-hidden px-[10px] py-[2px] text-ellipsis whitespace-nowrap',
		state?.compact ? 'border-border-row flex border-b' : 'table-cell',
		state?.borderedColumns ? 'border-border-row border-r first:border-l' : '',
		className
	)}
	{...rest}
>
	{#if state?.compact && columnLabel}
		<div
			class="column-label flex-[0_0_120px] overflow-hidden pr-[10px] font-bold text-ellipsis uppercase opacity-80"
			role="presentation"
		>
			{columnLabel}
		</div>
	{/if}
	<div
		class="wrapper text-foreground w-full overflow-hidden font-sans text-[13px] leading-[1.4] text-ellipsis whitespace-nowrap"
	>
		{@render children?.()}
	</div>
</div>
