<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		emptyMessage = 'No notifications',
		class: className = ''
	}: {
		children?: Snippet;
		emptyMessage?: string;
		class?: string;
	} = $props();
</script>

<div class="flex flex-col {className}" role="list" aria-label="Notification list">
	{#if children}
		{@render children()}
	{:else}
		<div class="flex items-center justify-center py-8 text-xs opacity-40">
			{emptyMessage}
		</div>
	{/if}
</div>
