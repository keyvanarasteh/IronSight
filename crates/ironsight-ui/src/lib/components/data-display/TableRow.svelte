<script lang="ts">
	import { cn } from '../../utils';
	import { getContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import type { TableContext } from './Table.svelte';

	let {
		children,
		class: className,
		...rest
	}: {
		children?: Snippet;
		class?: string;
		[key: string]: unknown;
	} = $props();

	const tableCtx = getContext<TableContext>('vscode-table');
	const state = $derived(tableCtx?.state);
</script>

<div
	role="row"
	class={cn(
		'border-border-row w-full border-t border-solid',
		state?.compact ? 'block' : 'table-row',
		state?.bordered || state?.borderedRows ? 'border-border-row border-b' : '',
		(state?.bordered || state?.borderedRows) && state?.compact
			? 'border-border-row border-t border-b-0'
			: '',
		state?.zebra ? 'even:bg-zebra' : '',
		state?.zebraOdd ? 'odd:bg-zebra' : '',
		!state?.bordered && !state?.borderedRows && !state?.compact ? 'border-t-0' : '',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
