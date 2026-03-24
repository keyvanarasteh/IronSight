<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import { X, ChevronLeft, ChevronRight, Pin, PinOff } from 'lucide-svelte';

	export type EditorTab = {
		id: string;
		label: string;
		icon?: Component<any>;
		lang?: string;
		iconColor?: string;
		dirty?: boolean;
		pinned?: boolean;
		preview?: boolean;
	};

	let {
		tabs = [] as EditorTab[],
		activeId = $bindable(''),
		onselect,
		onclose,
		onpin,
		onreorder,
		showScrollButtons = true,
		tabActions,
		class: className = ''
	}: {
		tabs?: EditorTab[];
		activeId?: string;
		onselect?: (tab: EditorTab) => void;
		onclose?: (tab: EditorTab) => void;
		onpin?: (tab: EditorTab) => void;
		onreorder?: (fromIndex: number, toIndex: number) => void;
		showScrollButtons?: boolean;
		tabActions?: Snippet;
		class?: string;
	} = $props();

	let scrollRef: HTMLDivElement;
	let dragIndex = $state(-1);
	let dragOverIndex = $state(-1);

	// ── Context menu state ───────────────────────────────
	let ctxVisible = $state(false);
	let ctxX = $state(0);
	let ctxY = $state(0);
	let ctxTab = $state<EditorTab | null>(null);

	function openContextMenu(e: MouseEvent, tab: EditorTab) {
		e.preventDefault();
		ctxTab = tab;
		ctxX = e.clientX;
		ctxY = e.clientY;
		ctxVisible = true;
	}

	function closeContextMenu() {
		ctxVisible = false;
	}

	function ctxClose() {
		if (ctxTab) onclose?.(ctxTab);
		closeContextMenu();
	}

	function ctxCloseOthers() {
		if (!ctxTab) return;
		for (let i = tabs.length - 1; i >= 0; i--) {
			const t = tabs[i];
			if (t && t.id !== ctxTab.id && !t.pinned) {
				onclose?.(t);
			}
		}
		closeContextMenu();
	}

	function ctxCloseToRight() {
		if (!ctxTab) return;
		const idx = tabs.findIndex((t) => t.id === ctxTab!.id);
		if (idx === -1) return;
		for (let i = tabs.length - 1; i > idx; i--) {
			const t = tabs[i];
			if (t && !t.pinned) {
				onclose?.(t);
			}
		}
		closeContextMenu();
	}

	function ctxCloseAll() {
		for (let i = tabs.length - 1; i >= 0; i--) {
			const t = tabs[i];
			if (t && !t.pinned) {
				onclose?.(t);
			}
		}
		closeContextMenu();
	}

	function ctxPin() {
		if (ctxTab) onpin?.(ctxTab);
		closeContextMenu();
	}

	// ── Drag and Drop ────────────────────────────────────
	function handleDragStart(e: DragEvent, index: number) {
		dragIndex = index;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/plain', String(index));
		}
	}

	function handleDragOver(e: DragEvent, index: number) {
		e.preventDefault();
		dragOverIndex = index;
	}

	function handleDrop(e: DragEvent, toIndex: number) {
		e.preventDefault();
		if (dragIndex >= 0 && dragIndex !== toIndex) {
			onreorder?.(dragIndex, toIndex);
		}
		dragIndex = -1;
		dragOverIndex = -1;
	}

	function handleDragEnd() {
		dragIndex = -1;
		dragOverIndex = -1;
	}

	function scrollLeft() {
		scrollRef?.scrollBy({ left: -200, behavior: 'smooth' });
	}

	function scrollRight() {
		scrollRef?.scrollBy({ left: 200, behavior: 'smooth' });
	}
</script>

<!-- Close context menu on outside click -->
{#if ctxVisible}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-[9998]"
		onclick={closeContextMenu}
		oncontextmenu={(e) => {
			e.preventDefault();
			closeContextMenu();
		}}
	></div>
{/if}

<div
	class="bg-muted border-border flex h-9 shrink-0 items-center border-b {className}"
	role="tablist"
>
	{#if showScrollButtons}
		<button
			class="text-foreground/50 m-0 h-full shrink-0 cursor-pointer border-none bg-transparent px-0.5 hover:bg-white/5"
			onclick={scrollLeft}
			aria-label="Scroll tabs left"
		>
			<ChevronLeft class="h-3.5 w-3.5" />
		</button>
	{/if}

	<div class="scrollbar-none flex h-full flex-1 items-center overflow-x-auto" bind:this={scrollRef}>
		{#each tabs as tab, i (tab.id)}
			{@const isActive = tab.id === activeId}
			<div
				class="border-border group relative flex h-full max-w-[200px] min-w-[120px] shrink-0 cursor-pointer items-center gap-1.5 border-r px-3 text-[12px] select-none
					{isActive ? 'bg-background text-foreground' : 'bg-muted text-foreground/40 hover:bg-background/50'}
					{tab.preview ? 'italic' : ''}
					{dragOverIndex === i ? 'border-l-focusborder border-l-2' : ''}"
				role="tab"
				aria-selected={isActive}
				draggable="true"
				tabindex={isActive ? 0 : -1}
				ondragstart={(e) => handleDragStart(e, i)}
				ondragover={(e) => handleDragOver(e, i)}
				ondrop={(e) => handleDrop(e, i)}
				ondragend={handleDragEnd}
				onclick={() => {
					activeId = tab.id;
					onselect?.(tab);
				}}
				oncontextmenu={(e) => openContextMenu(e, tab)}
				onkeydown={(e) => {
					if (e.key === 'Enter') {
						activeId = tab.id;
						onselect?.(tab);
					}
				}}
			>
				{#if isActive}
					<div class="bg-primary absolute top-0 left-0 h-px w-full"></div>
				{/if}
				{#if tab.pinned}
					<Pin class="text-primary/70 h-3 w-3 shrink-0" />
				{/if}
				{#if tab.icon}
					<tab.icon
						class="h-4 w-4 shrink-0 {tab.pinned ? 'ml-1' : ''} {tab.lang?.includes('JavaScript')
							? 'text-yellow-400'
							: tab.lang?.includes('TypeScript')
								? 'text-blue-400'
								: tab.lang?.includes('Svelte')
									? 'text-orange-400'
									: tab.iconColor
										? tab.iconColor
										: isActive
											? ''
											: 'opacity-70'}"
					/>
				{/if}
				<span class="flex-1 truncate">{tab.label}</span>
				{#if tab.dirty}
					<span class="bg-foreground/50 h-2 w-2 shrink-0 rounded-full"></span>
				{/if}
				{#if tab.pinned}
					<!-- Pinned: show unpin button instead of close -->
					<button
						class="m-0 shrink-0 cursor-pointer rounded border-none bg-transparent p-0.5 hover:bg-white/10 {isActive
							? 'text-primary/60 hover:text-primary'
							: 'text-foreground/0 group-hover:text-primary/60 hover:!text-primary'}"
						onclick={(e) => {
							e.stopPropagation();
							onpin?.(tab);
						}}
						aria-label="Unpin {tab.label}"
					>
						<PinOff class="h-3 w-3" />
					</button>
				{:else}
					<!-- Unpinned: show close button -->
					<button
						class="m-0 shrink-0 cursor-pointer rounded border-none bg-transparent p-0.5 hover:bg-white/10 {isActive
							? 'text-foreground/60 hover:text-foreground'
							: 'text-foreground/0 group-hover:text-foreground/60 hover:!text-foreground'}"
						onclick={(e) => {
							e.stopPropagation();
							(() => onclose?.(tab))();
						}}
						aria-label="Close {tab.label}"
					>
						<X class="h-3 w-3" />
					</button>
				{/if}
			</div>
		{/each}
	</div>

	{#if showScrollButtons}
		<button
			class="text-foreground/50 m-0 h-full shrink-0 cursor-pointer border-none bg-transparent px-0.5 hover:bg-white/5"
			onclick={scrollRight}
			aria-label="Scroll tabs right"
		>
			<ChevronRight class="h-3.5 w-3.5" />
		</button>
	{/if}

	{#if tabActions}
		<div class="border-border/30 flex h-full shrink-0 items-center border-l px-1">
			{@render tabActions()}
		</div>
	{/if}
</div>

<!-- ═══ Context Menu (macOS style) ═══ -->
{#if ctxVisible}
	<div
		class="border-border/50 fixed z-[9999] min-w-[200px] rounded-lg border p-1 shadow-2xl backdrop-blur-2xl"
		style="left: {ctxX}px; top: {ctxY}px; background: oklch(from var(--color-muted) l c h / 0.85);"
	>
		<button
			onclick={ctxClose}
			class="text-foreground/90 hover:bg-primary flex w-full items-center gap-2.5 rounded-md px-2.5 py-[5px] text-left text-[13px] hover:text-white"
		>
			<X class="h-3.5 w-3.5 opacity-50" />
			Close
		</button>
		<button
			onclick={ctxCloseOthers}
			class="text-foreground/90 hover:bg-primary flex w-full items-center gap-2.5 rounded-md px-2.5 py-[5px] text-left text-[13px] hover:text-white"
		>
			<span class="h-3.5 w-3.5"></span>
			Close Others
		</button>
		<button
			onclick={ctxCloseToRight}
			class="text-foreground/90 hover:bg-primary flex w-full items-center gap-2.5 rounded-md px-2.5 py-[5px] text-left text-[13px] hover:text-white"
		>
			<span class="h-3.5 w-3.5"></span>
			Close to the Right
		</button>
		<button
			onclick={ctxCloseAll}
			class="text-foreground/90 hover:bg-primary flex w-full items-center gap-2.5 rounded-md px-2.5 py-[5px] text-left text-[13px] hover:text-white"
		>
			<span class="h-3.5 w-3.5"></span>
			Close All
		</button>
		<div class="border-foreground/10 mx-1 my-[3px] border-t"></div>
		<button
			onclick={ctxPin}
			class="text-foreground/90 hover:bg-primary flex w-full items-center gap-2.5 rounded-md px-2.5 py-[5px] text-left text-[13px] hover:text-white"
		>
			{#if ctxTab?.pinned}
				<PinOff class="h-3.5 w-3.5 opacity-50" />
				Unpin Tab
			{:else}
				<Pin class="h-3.5 w-3.5 opacity-50" />
				Pin Tab
			{/if}
		</button>
	</div>
{/if}
