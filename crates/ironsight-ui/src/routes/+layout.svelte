<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve */
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import MultiEditorTabs from '$components/shell/MultiEditorTabs.svelte';
	import Modal from '$components/overlay/Modal.svelte';
	import {
		ActivityBar,
		Breadcrumbs,
		SidebarPart,
		SidebarSection,
		StatusBar,
		ThemeProvider,
		TitleBar
	} from '$lib';
	import favicon from '$lib/assets/favicon.svg';
	import { locales, localizeHref as resolve } from '$lib/paraglide/runtime';
	import { ui } from '$lib/state/ui.svelte';

	import type { ActivityItem } from '$lib/types';
	import {
		Activity,
		AlertTriangle,
		Settings
	} from 'lucide-svelte';
	import { untrack } from 'svelte';
	import '../app.css';
	import './layout.css';

	let { children } = $props();

	// Active bottom panel tab
	let activePanelContent = $derived(ui.panelTabs.find((t) => t.id === ui.activePanelTabId));

	// ── Activity Bar Items ───────────────────────────────
	const topItems: ActivityItem[] = [
		{ id: 'dashboard', icon: Activity, tooltip: 'Dashboard' }
	];

	const bottomItems: ActivityItem[] = [
		{ id: 'settings', icon: Settings, tooltip: 'Settings' }
	];

	function handleSidebarChange(id: string) {
		ui.setSidebar(id);
	}

	// ── Breadcrumbs from URL ─────────────────────────────
	let breadcrumbSegments = $derived(
		['IronSight'].concat(
			page.url.pathname
				.split('/')
				.filter(Boolean)
				.map((s) => decodeURIComponent(s))
		)
	);

	function getTabDetails(path: string, label: string) {
		let icon = Activity;
		let lang = '';
		return { icon, lang };
	}

	// ── Editor tabs from route navigation ────────────────
	$effect(() => {
		const path = page.url.pathname;
		if (path === '/' || locales.some((l) => path === `/${l}` || path === `/${l}/`)) return; // don't open tab for home
		const segments = path.split('/').filter(Boolean);
		const label = decodeURIComponent(segments[segments.length - 1] ?? 'Home');

		untrack(() => {
			const { icon, lang } = getTabDetails(path, label);
			ui.openEditorTab({ id: path, label, icon: icon as any, lang });
		});
	});

	function handleEditorTabClose(tab: { id: string }) {
		const wasActive = ui.activeEditorTabId === tab.id;
		ui.closeEditorTab(tab.id);
		// If we closed the active tab and have remaining tabs, navigate to the new active
		if (wasActive && ui.activeEditorTabId) {
			goto(resolve(ui.activeEditorTabId));
		} else if (wasActive && !ui.activeEditorTabId) {
			goto(resolve('/'));
		}
	}

	function handleEditorTabPin(tab: { id: string }) {
		const found = ui.editorTabs.find((t) => t.id === tab.id);
		if (found) {
			found.pinned = !found.pinned;
			ui.editorTabs = [...ui.editorTabs];
		}
	}

	function handleEditorTabSelect(tab: { id: string }) {
		if (tab.id !== page.url.pathname) {
			goto(resolve(tab.id));
		}
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Paraglide translation crawler block -->
<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>

<ThemeProvider
	class="bg-background text-foreground selection:bg-primary/20 selection:text-foreground fixed inset-0 z-0 flex flex-col overflow-hidden antialiased"
>
	<!-- ═══ TITLE BAR ═══ -->
	<TitleBar
		workspaceName="IronSight EDR"
		onToggleSidebar={() => ui.toggleSidebar()}
		onToggleTerminal={() => ui.togglePanel()}
		onToggleMobileMenu={() => ui.toggleSidebar()}
		menuItems={[]}
	/>

	<!-- ═══ MIDDLE SECTION (horizontal flex) ═══ -->
	<div class="flex min-h-0 flex-1">
		<!-- ═══ PART: Activity Bar ═══ -->
		<ActivityBar
			activeSidebar={ui.activeSidebar}
			onSidebarChange={handleSidebarChange}
			{topItems}
			{bottomItems}
		/>


		<!-- ═══ PART: SidebarPart (flow-based, resizable) ═══ -->
		<SidebarPart
			visible={ui.sidebarVisible}
			position="left"
			bind:width={ui.sidebarWidth}
			title="Explorer"
			onclose={() => ui.toggleSidebar()}
		>
			<SidebarSection title="NAVIGATION" open={true}>
				<div class="space-y-[2px] px-2 py-1">
					<a
						href="/"
						class="group text-sidebar-foreground/60 hover:bg-background-hover hover:text-sidebar-foreground flex w-full items-center gap-2 rounded px-4 py-[3px] text-[13px] no-underline transition-colors {page
							.url.pathname === '/'
							? 'bg-background-selected text-sidebar-foreground font-medium'
							: ''}"
					>
						<Activity class="h-3.5 w-3.5 opacity-80" />
						<span class="truncate">Dashboard</span>
					</a>
				</div>
			</SidebarSection>
		</SidebarPart>

		<!-- ═══ CENTER: Editor Tabs + Breadcrumbs + Router Render (children) ═══ -->
		<div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
			<!-- Editor Tabs -->
			{#if ui.editorTabs.length > 0}
				<MultiEditorTabs
					tabs={ui.editorTabs}
					bind:activeId={ui.activeEditorTabId}
					onselect={handleEditorTabSelect}
					onclose={handleEditorTabClose}
					onpin={handleEditorTabPin}
				/>
			{/if}

			<!-- Breadcrumbs -->
			{#if breadcrumbSegments.length > 0}
				<Breadcrumbs segments={breadcrumbSegments} />
			{/if}

			<div class="min-h-0 flex-1 overflow-y-auto">
				{@render children()}
			</div>

			<!-- ═══ BOTTOM PANEL (closable tabs) ═══ -->
			{#if ui.panelVisible && ui.panelTabs.length > 0}
				<div class="border-border/50 flex h-[300px] max-h-[50vh] flex-col border-t">
					<!-- Panel tab bar -->
					<MultiEditorTabs
						tabs={ui.panelTabs.map((t) => ({
							id: t.id,
							label: t.label,
							...(t.icon ? { icon: t.icon } : {})
						}))}
						bind:activeId={ui.activePanelTabId}
						onclose={(tab) => ui.closePanelTab(tab.id)}
					/>

					<!-- Panel content -->
					<div class="bg-editor-bg min-h-0 flex-1 overflow-y-auto">
						<div class="text-muted-foreground p-6 text-center text-sm">
							Event Stream & Response Center
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- ═══ PART: Global Error Modal ═══ -->
	<Modal
		bind:open={ui.errorModalOpen}
		title="Execution Failed"
		description="The system encountered an unexpected error fulfilling the request."
		icon={AlertTriangle}
	>
		<div class="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
			<p class="font-mono text-sm whitespace-pre-wrap text-red-300">{ui.globalError}</p>
		</div>
	</Modal>

	<!-- ═══ PART: Status Bar ═══ -->
	<StatusBar
		branch="main"
		errors={0}
		warnings={0}
		language="EDR"
	/>
</ThemeProvider>

<style>
	/* Syntax highlighting tokens (VSCode TextMate scoping) */
	:global(.kw) {
		color: oklch(0.7 0.2 300);
	}
	:global(.str) {
		color: oklch(0.7 0.15 150);
	}
	:global(.num) {
		color: oklch(0.75 0.15 80);
	}
	:global(.tp) {
		color: oklch(0.7 0.15 200);
	}

	/* Scrollbar — scoped to scrollable containers only */
	:global(::-webkit-scrollbar) {
		width: 10px;
		height: 10px;
	}
	:global(::-webkit-scrollbar-track) {
		background: transparent;
	}
	:global(::-webkit-scrollbar-thumb) {
		background: rgba(121, 121, 121, 0.4);
		border-radius: 5px;
	}
	:global(::-webkit-scrollbar-thumb:hover) {
		background: rgba(100, 100, 100, 0.7);
	}
	:global(::-webkit-scrollbar-corner) {
		background: transparent;
	}

	/* Firefox scrollbar — only on containers that scroll */
	:global([style*="overflow"], .overflow-y-auto, .overflow-x-auto, .overflow-auto) {
		scrollbar-width: thin;
		scrollbar-color: rgba(121, 121, 121, 0.4) transparent;
	}
</style>
