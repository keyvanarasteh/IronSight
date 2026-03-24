<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		tabs,
		breadcrumbs,
		actions,
		class: className = ''
	}: {
		tabs?: Snippet;
		breadcrumbs?: Snippet;
		actions?: Snippet;
		class?: string;
	} = $props();
</script>

<div class="bg-editor-bg flex shrink-0 flex-col {className}">
	<!-- Tab bar row -->
	<div class="flex items-center">
		<div class="min-w-0 flex-1 overflow-hidden">
			{#if tabs}
				{@render tabs()}
			{/if}
		</div>
		{#if actions}
			<div class="flex shrink-0 items-center gap-0.5 px-2">
				{@render actions()}
			</div>
		{/if}
	</div>

	<!-- Breadcrumbs row -->
	{#if breadcrumbs}
		<div class="border-border border-b">
			{@render breadcrumbs()}
		</div>
	{/if}
</div>
