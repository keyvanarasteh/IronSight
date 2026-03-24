<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		id = '',
		active = false,
		editor,
		titleControl,
		watermark,
		class: className = ''
	}: {
		id?: string;
		active?: boolean;
		editor?: Snippet;
		titleControl?: Snippet;
		watermark?: Snippet;
		class?: string;
	} = $props();
</script>

<div
	class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden
		{active ? 'z-10' : 'z-0'}
		{className}"
	role="tabpanel"
	aria-label="Editor group {id}"
	data-group-id={id}
>
	<!-- Title control (tabs + breadcrumbs + actions) -->
	{#if titleControl}
		{@render titleControl()}
	{/if}

	<!-- Editor content -->
	<div class="bg-editor-bg relative min-h-0 flex-1 overflow-auto">
		{#if editor}
			{@render editor()}
		{:else if watermark}
			{@render watermark()}
		{/if}
	</div>
</div>
