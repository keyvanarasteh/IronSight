<script lang="ts" module>
	export type SidebarTab = {
		id: string;
		label: string;
		icon?: import('$lib/types').IconComponent;
	};
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { X } from 'lucide-svelte';

	let {
		visible = true,
		position = 'left' as 'left' | 'right',
		width = $bindable(240),
		minWidth = 160,
		maxWidth = 480,
		title = '',
		tabs,
		activeTab = $bindable(''),
		resizable = true,
		headerActions,
		children,
		onclose,
		onTabChange,
		class: className = ''
	}: {
		visible?: boolean;
		position?: 'left' | 'right';
		width?: number;
		minWidth?: number;
		maxWidth?: number;
		title?: string;
		tabs?: SidebarTab[];
		activeTab?: string;
		resizable?: boolean;
		headerActions?: Snippet;
		children?: Snippet;
		onclose?: () => void;
		onTabChange?: (id: string) => void;
		class?: string;
	} = $props();

	// ── Resize sash logic (like VSCode's Sash) ──────────
	let resizing = $state(false);

	function startResize(e: MouseEvent) {
		if (!resizable) return;
		e.preventDefault();
		resizing = true;
		const startX = e.clientX;
		const startW = width;
		const isLeft = position === 'left';

		function onMove(ev: MouseEvent) {
			const delta = ev.clientX - startX;
			width = Math.max(minWidth, Math.min(maxWidth, startW + (isLeft ? delta : -delta)));
		}
		function onUp() {
			resizing = false;
			window.removeEventListener('mousemove', onMove);
			window.removeEventListener('mouseup', onUp);
		}
		window.addEventListener('mousemove', onMove);
		window.addEventListener('mouseup', onUp);
	}
</script>

{#if visible}
	<aside
		class="bg-sidebar flex shrink-0 overflow-hidden
			{position === 'left' ? 'flex-row' : 'flex-row-reverse'}
			{className}"
		style="width: {width}px"
		aria-label={title || 'Sidebar'}
	>
		<!-- Main sidebar content -->
		<div
			class="flex min-w-0 flex-1 flex-col overflow-hidden
				{position === 'left' ? 'border-border border-r' : 'border-border border-l'}"
		>
			<!-- Header: title or tabs -->
			<div class="border-border flex h-[35px] shrink-0 items-center border-b px-3">
				{#if tabs && tabs.length > 0}
					<!-- Tab-based header -->
					<div
						class="scrollbar-none flex h-full min-w-0 flex-1 items-center gap-0 overflow-x-auto"
						role="tablist"
					>
						{#each tabs as tab (tab.id)}
							{@const isActive = tab.id === activeTab}
							<button
								class="relative m-0 flex h-full cursor-pointer items-center gap-1.5 border-none bg-transparent px-2.5 text-[11px] font-semibold tracking-wider whitespace-nowrap uppercase select-none
									{isActive ? 'text-sidebar-foreground' : 'text-foreground/40 hover:text-foreground/70'}"
								role="tab"
								aria-selected={isActive}
								onclick={() => {
									activeTab = tab.id;
									onTabChange?.(tab.id);
								}}
							>
								{#if tab.icon}
									<tab.icon class="h-3.5 w-3.5" />
								{/if}
								<span>{tab.label}</span>
								{#if isActive}
									<div class="bg-sidebar-foreground absolute right-1 bottom-0 left-1 h-px"></div>
								{/if}
							</button>
						{/each}
					</div>
				{:else}
					<!-- Simple title header -->
					<span
						class="text-sidebar-foreground flex-1 truncate text-[11px] font-semibold tracking-wider uppercase"
					>
						{title}
					</span>
				{/if}

				<!-- Header actions -->
				<div class="flex shrink-0 items-center gap-0.5">
					{#if headerActions}
						{@render headerActions()}
					{/if}
					{#if onclose}
						<button
							class="hover:bg-foreground/10 text-sidebar-foreground/60 m-0 cursor-pointer rounded border-none bg-transparent p-1"
							onclick={onclose}
							aria-label="Close sidebar"
						>
							<X class="h-3.5 w-3.5" />
						</button>
					{/if}
				</div>
			</div>

			<!-- Content -->
			<div class="flex-1 overflow-x-hidden overflow-y-auto">
				{#if children}
					{@render children()}
				{/if}
			</div>
		</div>

		<!-- Resize sash (like VSCode's base/browser/ui/sash/sash.ts) -->
		{#if resizable}
			<div
				class="w-[4px] shrink-0 cursor-col-resize transition-colors
					{resizing ? 'bg-ring' : 'hover:bg-ring/50 bg-transparent'}"
				onmousedown={startResize}
				role="separator"
				aria-orientation="vertical"
				aria-label="Resize sidebar"
				tabindex="-1"
			></div>
		{/if}
	</aside>
{/if}
