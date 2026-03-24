<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		class: className = ''
	}: {
		children?: Snippet;
		class?: string;
	} = $props();
</script>

<div class="bg-sidebar group flex h-full flex-col overflow-hidden {className}" role="complementary">
	{#if children}
		{@render children()}
	{/if}
</div>
