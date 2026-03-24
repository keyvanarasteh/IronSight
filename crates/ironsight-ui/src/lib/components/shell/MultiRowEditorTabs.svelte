<script lang="ts">
	import type { Component } from 'svelte';
	import { X } from 'lucide-svelte';

	export type EditorTab = {
		id: string;
		label: string;
		icon?: Component;
		dirty?: boolean;
		pinned?: boolean;
		preview?: boolean;
	};

	let {
		tabs = [] as EditorTab[],
		activeId = $bindable(''),
		onselect,
		onclose,
		class: className = ''
	}: {
		tabs?: EditorTab[];
		activeId?: string;
		onselect?: (tab: EditorTab) => void;
		onclose?: (tab: EditorTab) => void;
		class?: string;
	} = $props();
</script>

<div
	class="bg-editorgroupheader-tabs-bg border-border flex min-h-[35px] shrink-0 flex-wrap border-b {className}"
	role="tablist"
>
	{#each tabs as tab (tab.id)}
		{@const isActive = tab.id === activeId}
		<div
			class="border-border/50 flex h-[35px] shrink-0 cursor-pointer items-center gap-1.5 border-r border-b px-3 text-xs select-none
				{isActive
				? 'bg-editor-bg text-editor-fg border-b-transparent'
				: 'text-foreground/60 hover:text-foreground/80'}
				{tab.preview ? 'italic' : ''}"
			role="tab"
			aria-selected={isActive}
			onclick={() => {
				activeId = tab.id;
				onselect?.(tab);
			}}
			onkeydown={(e) => {
				if (e.key === 'Enter') {
					activeId = tab.id;
					onselect?.(tab);
				}
			}}
			tabindex={isActive ? 0 : -1}
		>
			{#if tab.icon}
				<tab.icon class="h-4 w-4 shrink-0 opacity-70" />
			{/if}
			<span class="max-w-[120px] truncate">{tab.label}</span>
			{#if tab.dirty}
				<span class="bg-foreground/50 h-2 w-2 shrink-0 rounded-full"></span>
			{/if}
			<button
				class="m-0 shrink-0 cursor-pointer rounded border-none bg-transparent p-0.5 text-current opacity-0 hover:bg-white/10 hover:opacity-100
					{isActive ? 'opacity-60' : ''}"
				onclick={(e) => {
					e.stopPropagation();
					(() => onclose?.(tab))();
				}}
				aria-label="Close {tab.label}"
			>
				<X class="h-3 w-3" />
			</button>
		</div>
	{/each}
</div>
