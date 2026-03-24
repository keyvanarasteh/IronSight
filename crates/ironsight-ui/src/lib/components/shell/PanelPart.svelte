<script lang="ts">
	import type { Snippet, Component } from 'svelte';
	import { Maximize2, Minimize2, X } from 'lucide-svelte';

	export type PanelTab = {
		id: string;
		label: string;
		icon?: Component;
		badge?: number;
	};

	let {
		tabs = [] as PanelTab[],
		activeTab = $bindable(''),
		visible = true,
		position = 'bottom' as 'bottom' | 'left' | 'right',
		maximized = false,
		height = 250,
		onToggleMaximize,
		onclose,
		onTabChange,
		headerActions,
		children,
		class: className = ''
	}: {
		tabs?: PanelTab[];
		activeTab?: string;
		visible?: boolean;
		position?: 'bottom' | 'left' | 'right';
		maximized?: boolean;
		height?: number;
		onToggleMaximize?: () => void | boolean;
		onclose?: () => void;
		onTabChange?: (id: string) => void;
		headerActions?: Snippet;
		children?: Snippet;
		class?: string;
	} = $props();

	const isHorizontal = $derived(position === 'bottom');
</script>

{#if visible}
	<div
		class="bg-panel-bg border-border flex shrink-0 flex-col overflow-hidden
			{isHorizontal ? 'border-t' : position === 'left' ? 'border-r' : 'border-l'}
			{maximized ? 'flex-1' : ''}
			{className}"
		style={maximized ? '' : isHorizontal ? `height: ${height}px` : `width: ${height}px`}
		role="region"
		aria-label="Panel"
	>
		<!-- Header -->
		<div class="border-border flex h-[35px] shrink-0 items-center border-b px-2">
			<!-- Tabs -->
			<div
				class="scrollbar-none flex h-full min-w-0 flex-1 items-center gap-0 overflow-x-auto"
				role="tablist"
			>
				{#each tabs as tab (tab.id)}
					{@const isActive = tab.id === activeTab}
					<button
						class="relative m-0 flex h-full cursor-pointer items-center gap-1.5 border-none bg-transparent px-3 text-xs select-none
							{isActive ? 'text-panel-fg' : 'text-foreground/50 hover:text-foreground/80'}"
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
						<span class="text-[11px] font-medium tracking-wider uppercase">{tab.label}</span>
						{#if tab.badge && tab.badge > 0}
							<span
								class="bg-badge-bg text-badge-fg rounded-full px-1 py-0 text-[9px] leading-4 font-bold"
								>{tab.badge}</span
							>
						{/if}
						{#if isActive}
							<div class="bg-panel-fg absolute right-2 bottom-0 left-2 h-px"></div>
						{/if}
					</button>
				{/each}
			</div>

			<!-- Actions -->
			<div class="flex shrink-0 items-center gap-0.5">
				{#if headerActions}
					{@render headerActions()}
				{/if}
				{#if onToggleMaximize}
					<button
						class="hover:bg-foreground/10 text-panel-inactive-fg/80 hover:text-panel-fg m-0 cursor-pointer rounded border-none bg-transparent p-1"
						onclick={onToggleMaximize}
						aria-label={maximized ? 'Restore panel size' : 'Maximize panel'}
					>
						{#if maximized}
							<Minimize2 class="h-3.5 w-3.5" />
						{:else}
							<Maximize2 class="h-3.5 w-3.5" />
						{/if}
					</button>
				{/if}
				{#if onclose}
					<button
						class="hover:bg-foreground/10 text-panel-inactive-fg/80 hover:text-panel-fg m-0 cursor-pointer rounded border-none bg-transparent p-1"
						onclick={onclose}
						aria-label="Close panel"
					>
						<X class="h-3.5 w-3.5" />
					</button>
				{/if}
			</div>
		</div>

		<!-- Body -->
		<div class="flex-1 overflow-auto">
			{#if children}
				{@render children()}
			{/if}
		</div>
	</div>
{/if}
