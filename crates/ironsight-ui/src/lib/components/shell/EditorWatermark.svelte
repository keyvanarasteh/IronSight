<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		showKeybindings = true,
		children,
		class: className = ''
	}: {
		showKeybindings?: boolean;
		children?: Snippet;
		class?: string;
	} = $props();

	const shortcuts = [
		{ label: 'Show All Commands', keys: 'Ctrl+Shift+P' },
		{ label: 'Open File', keys: 'Ctrl+O' },
		{ label: 'Open Folder', keys: 'Ctrl+K Ctrl+O' },
		{ label: 'New File', keys: 'Ctrl+N' }
	];
</script>

<div
	class="text-foreground/30 flex h-full flex-col items-center justify-center gap-6 p-8 select-none {className}"
	role="presentation"
>
	{#if children}
		{@render children()}
	{:else}
		<svg
			class="h-20 w-20 opacity-20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1"
		>
			<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
			<polyline points="13 2 13 9 20 9" />
		</svg>
		{#if showKeybindings}
			<div class="flex flex-col gap-2 text-xs">
				{#each shortcuts as { label, keys } (keys)}
					<div class="flex items-center gap-3">
						<span class="min-w-[120px] text-right opacity-60">{label}</span>
						<kbd
							class="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px]"
							>{keys}</kbd
						>
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>
