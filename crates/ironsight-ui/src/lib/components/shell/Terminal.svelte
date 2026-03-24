<script lang="ts">
	import type { TerminalTab, TerminalLine } from '../../types';
	import { SplitSquareVertical, X } from 'lucide-svelte';
	import PanelTab from './PanelTab.svelte';

	let {
		isOpen,
		onClose,
		tabs,
		activeTerminalTab,
		onTabChange,
		output
	}: {
		isOpen: boolean;
		onClose: () => void;
		tabs: TerminalTab[];
		activeTerminalTab: string;
		onTabChange: (label: string) => void;
		output: TerminalLine[];
	} = $props();
</script>

<section
	class="border-border bg-background flex flex-col overflow-hidden border-t transition-all duration-300
	{isOpen ? 'h-1/4 min-h-[160px]' : 'h-0'}"
>
	<div class="flex h-9 shrink-0 items-center justify-between px-4">
		<div class="flex h-full items-center gap-4 text-[11px] font-bold tracking-wider uppercase">
			{#each tabs as tab (tab.label)}
				<PanelTab
					label={tab.label}
					count={tab.count}
					active={activeTerminalTab === tab.label}
					onclick={() => onTabChange(tab.label)}
				/>
			{/each}
		</div>
		<div class="text-foreground flex items-center gap-3 opacity-50">
			<button
				aria-label="Split Terminal"
				class="text-foreground m-0 cursor-pointer border-none bg-transparent p-0 hover:opacity-100"
			>
				<SplitSquareVertical class="h-3.5 w-3.5" />
			</button>
			<button
				aria-label="Close Terminal"
				class="text-foreground m-0 cursor-pointer border-none bg-transparent p-0 hover:opacity-100"
				onclick={onClose}
			>
				<X class="h-4 w-4" />
			</button>
		</div>
	</div>
	<div
		class="text-foreground/80 bg-foreground/5 flex-1 overflow-auto p-3 font-mono text-[12px] dark:bg-black/20"
	>
		{#each output as line, i (i)}
			{#if line.type === 'prompt'}
				<div class="flex gap-2">
					<span class="text-green-400">➜</span>
					<span class="text-blue-400">vscode-ui</span>
					<span class="text-yellow-400">git:(main)</span>
					<span>{line.text}</span>
				</div>
			{:else}
				<div class="text-muted-foreground mt-1">
					{#if line.type === 'info'}
						{line.text}
					{:else if line.type === 'success'}
						<span class="text-green-500">{line.text}</span>
					{:else if line.type === 'error'}
						<span class="text-destructive">{line.text}</span>
					{/if}
				</div>
			{/if}
		{/each}
	</div>
</section>
