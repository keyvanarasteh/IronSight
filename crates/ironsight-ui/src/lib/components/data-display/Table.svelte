<script lang="ts" module>
	export type TableContext = {
		state: {
			bordered: boolean;
			borderedColumns: boolean;
			borderedRows: boolean;
			compact: boolean;
			zebra: boolean;
			zebraOdd: boolean;
		};
	};
</script>

<script lang="ts">
	import { cn } from '../../utils';
	import { setContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import Scrollable from '../layout/Scrollable.svelte';

	let {
		children,
		caption,
		header,
		body,
		bordered = false,
		borderedColumns = false,
		borderedRows = false,
		compact = false,
		zebra = false,
		zebraOdd = false,
		class: className,
		...rest
	}: {
		children?: Snippet;
		caption?: Snippet;
		header?: Snippet;
		body?: Snippet;
		bordered?: boolean;
		borderedColumns?: boolean;
		borderedRows?: boolean;
		compact?: boolean;
		zebra?: boolean;
		zebraOdd?: boolean;
		class?: string;
		[key: string]: unknown;
	} = $props();

	const tableState = {
		get bordered() {
			return bordered;
		},
		get borderedColumns() {
			return borderedColumns;
		},
		get borderedRows() {
			return borderedRows;
		},
		get compact() {
			return compact;
		},
		get zebra() {
			return zebra;
		},
		get zebraOdd() {
			return zebraOdd;
		}
	};

	setContext<TableContext>('vscode-table', {
		get state() {
			return tableState;
		}
	});
</script>

<div
	role="table"
	class={cn('relative flex h-full w-full max-w-full flex-col overflow-hidden', className)}
	{...rest}
>
	<div class="header shrink-0">
		{@render caption?.()}
		<div class={cn('header-slot-wrapper', compact && 'h-0 overflow-hidden')}>
			{@render header?.()}
		</div>
	</div>

	<!-- Scrollable content area -->
	<Scrollable
		class={cn(
			'relative min-h-0 flex-1 before:absolute before:top-0 before:left-0 before:z-10 before:block before:h-px before:w-full before:content-[""]',
			!compact && 'before:bg-border-row'
		)}
	>
		<div>
			{@render body?.()}
		</div>
	</Scrollable>

	{@render children?.()}
</div>
