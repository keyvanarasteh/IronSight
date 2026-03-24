<script lang="ts">
	import type { Component } from 'svelte';
	import { X } from 'lucide-svelte';

	let {
		label = '',
		icon: FileIcon,
		dirty = false,
		onclose,
		class: className = ''
	}: {
		label?: string;
		icon?: Component;
		dirty?: boolean;
		onclose?: () => void;
		class?: string;
	} = $props();
</script>

<div
	class="bg-editor-bg text-editor-fg border-border flex h-9 items-center gap-2 border-b px-3 text-xs select-none {className}"
	role="tab"
	aria-selected="true"
>
	{#if FileIcon}
		<FileIcon class="h-4 w-4 shrink-0 opacity-80" />
	{/if}
	<span class="flex-1 truncate">{label}</span>
	{#if dirty}
		<span class="bg-foreground/50 h-2 w-2 shrink-0 rounded-full"></span>
	{/if}
	{#if onclose}
		<button
			class="m-0 shrink-0 cursor-pointer rounded border-none bg-transparent p-0.5 text-current opacity-60 hover:bg-white/10 hover:opacity-100"
			onclick={onclose}
			aria-label="Close editor"
		>
			<X class="h-3.5 w-3.5" />
		</button>
	{/if}
</div>
