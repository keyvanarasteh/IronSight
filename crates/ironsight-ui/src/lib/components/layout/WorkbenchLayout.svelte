<script lang="ts">
	import type { Snippet } from 'svelte';

	type PanelPosition = 'bottom' | 'left' | 'right';
	type SidebarPosition = 'left' | 'right';

	let {
		banner,
		titlebar,
		activitybar,
		sidebar,
		editor,
		panel,
		auxiliarybar,
		statusbar,
		sidebarVisible = true,
		sidebarPosition = 'left' as SidebarPosition,
		panelVisible = true,
		panelPosition = 'bottom' as PanelPosition,
		panelMaximized = false,
		auxiliarybarVisible = false,
		statusbarVisible = true,
		zenMode = false,
		centeredLayout = false,
		class: className = ''
	}: {
		banner?: Snippet;
		titlebar?: Snippet;
		activitybar?: Snippet;
		sidebar?: Snippet;
		editor?: Snippet;
		panel?: Snippet;
		auxiliarybar?: Snippet;
		statusbar?: Snippet;
		sidebarVisible?: boolean;
		sidebarPosition?: SidebarPosition;
		panelVisible?: boolean;
		panelPosition?: PanelPosition;
		panelMaximized?: boolean;
		auxiliarybarVisible?: boolean;
		statusbarVisible?: boolean;
		zenMode?: boolean;
		centeredLayout?: boolean;
		class?: string;
	} = $props();

	const showSidebar = $derived(!zenMode && sidebarVisible);
	const showPanel = $derived(!zenMode && panelVisible);
	const showAuxBar = $derived(!zenMode && auxiliarybarVisible);
	const showStatusbar = $derived(!zenMode && statusbarVisible);
	const isLeftSidebar = $derived(sidebarPosition === 'left');
	const isPanelBottom = $derived(panelPosition === 'bottom');
</script>

<div
	class="bg-background flex h-full w-full flex-col overflow-hidden {zenMode
		? 'zen-mode'
		: ''} {className}"
	data-layout="workbench"
>
	<!-- Banner -->
	{#if banner}
		{@render banner()}
	{/if}

	<!-- Title Bar -->
	{#if !zenMode && titlebar}
		{@render titlebar()}
	{/if}

	<!-- Main content area -->
	<div class="flex min-h-0 flex-1 overflow-hidden">
		<!-- Activity bar (left when sidebar is left) -->
		{#if showSidebar && isLeftSidebar && activitybar}
			{@render activitybar()}
		{/if}

		<!-- Sidebar (left position) -->
		{#if showSidebar && isLeftSidebar && sidebar}
			{@render sidebar()}
		{/if}

		<!-- Center: Editor + Panel -->
		<div class="flex min-w-0 flex-1 {isPanelBottom ? 'flex-col' : 'flex-row'} overflow-hidden">
			<!-- Editor area -->
			<div
				class="min-h-0 min-w-0 flex-1 overflow-hidden {panelMaximized && showPanel
					? 'hidden'
					: ''} {centeredLayout ? 'mx-auto w-full max-w-4xl' : ''}"
			>
				{#if editor}
					{@render editor()}
				{/if}
			</div>

			<!-- Panel (left position) -->
			{#if showPanel && panelPosition === 'left' && panel}
				{@render panel()}
			{/if}

			<!-- Panel (bottom position) -->
			{#if showPanel && isPanelBottom && panel}
				{@render panel()}
			{/if}

			<!-- Panel (right position) -->
			{#if showPanel && panelPosition === 'right' && panel}
				{@render panel()}
			{/if}
		</div>

		<!-- Sidebar (right position) -->
		{#if showSidebar && !isLeftSidebar && sidebar}
			{@render sidebar()}
		{/if}

		<!-- Activity bar (right when sidebar is right) -->
		{#if showSidebar && !isLeftSidebar && activitybar}
			{@render activitybar()}
		{/if}

		<!-- Auxiliary bar -->
		{#if showAuxBar && auxiliarybar}
			{@render auxiliarybar()}
		{/if}
	</div>

	<!-- Status bar -->
	{#if showStatusbar && statusbar}
		{@render statusbar()}
	{/if}
</div>
