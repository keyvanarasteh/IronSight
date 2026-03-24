<script lang="ts">
	import { Pin, PinOff, X } from 'lucide-svelte';
	import type { FileItem } from '../../types';

	let {
		files,
		activeTab,
		onTabClick,
		onTabClose
	}: {
		files: FileItem[];
		activeTab: string;
		onTabClick: (name: string) => void;
		onTabClose: (name: string) => void;
	} = $props();

	// ── Pinned tabs ──────────────────────────────────────
	let pinnedTabs = $state<Set<string>>(new Set());

	// ── Context menu state ───────────────────────────────
	let ctxVisible = $state(false);
	let ctxX = $state(0);
	let ctxY = $state(0);
	let ctxTabName = $state('');

	function openContextMenu(e: MouseEvent, name: string) {
		e.preventDefault();
		ctxTabName = name;
		ctxX = e.clientX;
		ctxY = e.clientY;
		ctxVisible = true;
	}

	function closeContextMenu() {
		ctxVisible = false;
	}

	function handleClose() {
		onTabClose(ctxTabName);
		closeContextMenu();
	}

	function handleCloseOthers() {
		for (const f of files) {
			if (f.name !== ctxTabName && !pinnedTabs.has(f.name)) {
				onTabClose(f.name);
			}
		}
		closeContextMenu();
	}

	function handleCloseToRight() {
		const idx = files.findIndex((f) => f.name === ctxTabName);
		if (idx === -1) return;
		for (let i = files.length - 1; i > idx; i--) {
			const f = files[i];
			if (f && !pinnedTabs.has(f.name)) {
				onTabClose(f.name);
			}
		}
		closeContextMenu();
	}

	function handleCloseAll() {
		for (let i = files.length - 1; i >= 0; i--) {
			const f = files[i];
			if (f && !pinnedTabs.has(f.name)) {
				onTabClose(f.name);
			}
		}
		closeContextMenu();
	}

	function handlePin() {
		if (pinnedTabs.has(ctxTabName)) {
			pinnedTabs.delete(ctxTabName);
			pinnedTabs = new Set(pinnedTabs);
		} else {
			pinnedTabs.add(ctxTabName);
			pinnedTabs = new Set(pinnedTabs);
		}
		closeContextMenu();
	}

	const isPinned = $derived(pinnedTabs.has(ctxTabName));

	// Sort: pinned tabs first, then unpinned in original order
	const sortedFiles = $derived.by(() => {
		const pinned = files.filter((f) => pinnedTabs.has(f.name));
		const unpinned = files.filter((f) => !pinnedTabs.has(f.name));
		return [...pinned, ...unpinned];
	});
</script>

<!-- Close context menu on outside click -->
{#if ctxVisible}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-[9998]"
		onclick={closeContextMenu}
		oncontextmenu={(e) => {
			e.preventDefault();
			closeContextMenu();
		}}
	></div>
{/if}

<div class="bg-muted scrollbar-hide border-border flex h-9 overflow-x-auto border-b">
	{#each sortedFiles as file (file.name)}
		{@const filePinned = pinnedTabs.has(file.name)}
		<button
			onclick={() => onTabClick(file.name)}
			oncontextmenu={(e) => openContextMenu(e, file.name)}
			class="border-border group relative m-0 flex min-w-[120px] shrink-0 cursor-pointer items-center border-r border-none px-3 text-left
			{activeTab === file.name
				? 'bg-background text-foreground'
				: 'bg-muted text-foreground/40 hover:bg-background/50'}"
		>
			{#if activeTab === file.name}
				<div class="bg-primary absolute top-0 left-0 h-[1px] w-full"></div>
			{/if}
			{#if filePinned}
				<Pin class="text-primary/70 h-3 w-3 shrink-0" />
			{/if}
			{#if true}
				{@const Icon = file.icon}
				<Icon
					class="h-4 w-4 shrink-0 {filePinned ? 'ml-1.5' : ''} {file.lang.includes('JavaScript')
						? 'text-yellow-400'
						: file.lang.includes('TypeScript')
							? 'text-blue-400'
							: 'text-gray-400'}"
				/>
			{/if}
			<span class="ml-2 flex-1 truncate text-[12px]">{file.name}</span>
			{#if filePinned}
				<!-- Pinned: show unpin button instead of close -->
				<div
					role="button"
					tabindex="0"
					onclick={(e) => {
						e.stopPropagation();
						pinnedTabs.delete(file.name);
						pinnedTabs = new Set(pinnedTabs);
					}}
					onkeydown={(e) => {
						if (e.key === 'Enter') {
							e.stopPropagation();
							pinnedTabs.delete(file.name);
							pinnedTabs = new Set(pinnedTabs);
						}
					}}
					class="ml-2 flex items-center rounded p-0.5 hover:bg-white/10 {activeTab === file.name
						? 'text-primary/60 hover:text-primary'
						: 'text-foreground/0 group-hover:text-primary/60 hover:!text-primary'}"
				>
					<PinOff class="h-3.5 w-3.5" />
				</div>
			{:else}
				<!-- Unpinned: show close button -->
				<div
					role="button"
					tabindex="0"
					onclick={(e) => {
						e.stopPropagation();
						onTabClose(file.name);
					}}
					onkeydown={(e) => {
						if (e.key === 'Enter') {
							e.stopPropagation();
							onTabClose(file.name);
						}
					}}
					class="ml-2 flex items-center rounded p-0.5 hover:bg-white/10 {activeTab === file.name
						? 'text-foreground/60 hover:text-foreground'
						: 'text-foreground/0 group-hover:text-foreground/60 hover:!text-foreground'}"
				>
					<X class="h-3.5 w-3.5" />
				</div>
			{/if}
		</button>
	{/each}
</div>

<!-- ═══ Context Menu (macOS style) ═══ -->
{#if ctxVisible}
	<div
		class="border-border/50 fixed z-[9999] min-w-[200px] rounded-lg border p-1 shadow-2xl backdrop-blur-2xl"
		style="left: {ctxX}px; top: {ctxY}px; background: oklch(from var(--color-muted) l c h / 0.85);"
	>
		<button
			onclick={handleClose}
			class="text-foreground/90 hover:bg-primary flex w-full items-center gap-2.5 rounded-md px-2.5 py-[5px] text-left text-[13px] hover:text-white"
		>
			<X class="h-3.5 w-3.5 opacity-50" />
			Close
		</button>
		<button
			onclick={handleCloseOthers}
			class="text-foreground/90 hover:bg-primary flex w-full items-center gap-2.5 rounded-md px-2.5 py-[5px] text-left text-[13px] hover:text-white"
		>
			<span class="h-3.5 w-3.5"></span>
			Close Others
		</button>
		<button
			onclick={handleCloseToRight}
			class="text-foreground/90 hover:bg-primary flex w-full items-center gap-2.5 rounded-md px-2.5 py-[5px] text-left text-[13px] hover:text-white"
		>
			<span class="h-3.5 w-3.5"></span>
			Close to the Right
		</button>
		<button
			onclick={handleCloseAll}
			class="text-foreground/90 hover:bg-primary flex w-full items-center gap-2.5 rounded-md px-2.5 py-[5px] text-left text-[13px] hover:text-white"
		>
			<span class="h-3.5 w-3.5"></span>
			Close All
		</button>
		<div class="border-foreground/10 mx-1 my-[3px] border-t"></div>
		<button
			onclick={handlePin}
			class="text-foreground/90 hover:bg-primary flex w-full items-center gap-2.5 rounded-md px-2.5 py-[5px] text-left text-[13px] hover:text-white"
		>
			{#if isPinned}
				<PinOff class="h-3.5 w-3.5 opacity-50" />
				Unpin Tab
			{:else}
				<Pin class="h-3.5 w-3.5 opacity-50" />
				Pin Tab
			{/if}
		</button>
	</div>
{/if}
