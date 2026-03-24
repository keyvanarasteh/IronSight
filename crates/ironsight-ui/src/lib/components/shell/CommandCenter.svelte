<script lang="ts">
	import { Search, ChevronRight } from 'lucide-svelte';

	let {
		placeholder = 'Search or type a command',
		value = $bindable(''),
		recentCommands = [] as { label: string; shortcut?: string; onclick?: () => void }[],
		onsubmit,
		class: className = ''
	}: {
		placeholder?: string;
		value?: string;
		recentCommands?: { label: string; shortcut?: string; onclick?: () => void }[];
		onsubmit?: (value: string) => void;
		class?: string;
	} = $props();

	let focused = $state(false);
	let inputRef = $state<HTMLInputElement | null>(null);

	const showDropdown = $derived(focused && recentCommands.length > 0);
	const listboxId = 'command-center-listbox';

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			onsubmit?.(value);
		}
		if (e.key === 'Escape') {
			inputRef?.blur();
			value = '';
		}
	}
</script>

<div class="relative mx-4 max-w-xl flex-1 {className}">
	<div
		class="flex h-[26px] cursor-text items-center gap-2 rounded-md border px-3 transition-colors
			{focused
			? 'bg-quickinput-bg border-focusborder'
			: 'bg-commandcenter-bg border-commandcenter-border hover:bg-commandcenter-activebg'}"
		role="combobox"
		tabindex="-1"
		aria-expanded={showDropdown}
		aria-controls={listboxId}
		aria-haspopup="listbox"
		onclick={() => inputRef?.focus()}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') inputRef?.focus();
		}}
	>
		<Search class="h-3.5 w-3.5 shrink-0 opacity-50" />
		<input
			type="text"
			bind:value
			bind:this={inputRef}
			{placeholder}
			class="text-commandcenter-fg placeholder:text-foreground/30 m-0 min-w-0 flex-1 border-none bg-transparent p-0 text-xs outline-none"
			onfocus={() => (focused = true)}
			onblur={() => {
				setTimeout(() => (focused = false), 150);
			}}
			onkeydown={handleKeydown}
			aria-label="Command Center"
		/>
		<kbd class="hidden font-mono text-[10px] opacity-40 sm:inline">⌘K</kbd>
	</div>

	{#if showDropdown}
		<div
			class="bg-quickinput-bg border-quickinput-border absolute top-full right-0 left-0 z-50 mt-1 max-h-[300px] overflow-y-auto rounded-md border py-1 shadow-xl"
			role="listbox"
			id={listboxId}
		>
			<div class="text-quickinput-fg px-3 py-1 text-[10px] tracking-wider uppercase opacity-50">
				recently used
			</div>
			{#each recentCommands as cmd (cmd.label)}
				<button
					class="text-quickinput-fg hover:bg-list-hover-bg m-0 flex w-full cursor-pointer items-center gap-2 border-none bg-transparent px-3 py-1.5 text-left text-xs"
					role="option"
					aria-selected={false}
					onclick={() => {
						cmd.onclick?.();
						focused = false;
					}}
				>
					<ChevronRight class="h-3 w-3 shrink-0 opacity-40" />
					<span class="flex-1 truncate">{cmd.label}</span>
					{#if cmd.shortcut}
						<kbd class="font-mono text-[10px] opacity-40">{cmd.shortcut}</kbd>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>
