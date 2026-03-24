<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		compositeBar,
		children,
		class: className = ''
	}: {
		compositeBar?: Snippet;
		children?: Snippet;
		class?: string;
	} = $props();
</script>

<div class="bg-sidebar flex h-full flex-col overflow-hidden {className}">
	<!-- Composite tab bar at top -->
	{#if compositeBar}
		<div class="border-border shrink-0 border-b">
			{@render compositeBar()}
		</div>
	{/if}

	<!-- Collapsible pane content -->
	<div class="flex-1 overflow-y-auto">
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>
