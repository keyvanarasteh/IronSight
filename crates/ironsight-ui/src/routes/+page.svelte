<script lang="ts">
	import { PanelPart } from '$lib';
	import type { TerminalLine } from '$lib/types';
	import {
		AlertTriangle,
		Compass,
		Link as LinkIcon,
		Search,
		Sparkles,
		Pin,
		PinOff
	} from 'lucide-svelte';

	import { resolve } from '$app/paths';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { ui } from '$lib/state/ui.svelte';
	import { qrsAppState } from '$lib/stores/qrs-app.svelte';
	import ContextMenu from '$lib/components/navigation/ContextMenu.svelte';
	import type { MenuItemData } from '$lib/components/navigation/ContextMenuItem.svelte';
	import type { Component } from 'svelte';

	// Auto load all routes
	const rawRoutes = import.meta.glob('/src/routes/**/+page.svelte');

	// Create formatted route list
	const availableRoutes = Object.keys(rawRoutes)
		.map((path) => {
			let route = path.replace('/src/routes', '').replace('/+page.svelte', '');

			// Strip SvelteKit layout groups like /(app) or /(marketing)
			route = route.replace(/\/\([^)]+\)/g, '');

			if (route === '') route = '/';
			const segments = route.split('/').filter(Boolean);
			const name = segments.length > 0 ? segments[segments.length - 1] : 'Home';

			return {
				path: route,
				name: name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Home',
				segments
			};
		})
		.filter((r) => r.path !== '/' && !r.path.includes('[') && !r.path.includes(']'));

	let searchQuery = $state('');

	let filteredRoutes = $derived(
		availableRoutes.filter(
			(r) =>
				r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				r.path.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	let pinnedRoutes = $derived(filteredRoutes.filter((r) => qrsAppState.isRoutePinned(r.path)));
	let unpinnedRoutes = $derived(filteredRoutes.filter((r) => !qrsAppState.isRoutePinned(r.path)));

	// ── Context Menu ────────────────────────────────────
	let contextMenuOpen = $state(false);
	let contextMenuX = $state(0);
	let contextMenuY = $state(0);
	let contextMenuData: MenuItemData[] = $state([]);

	function handleContextMenu(e: MouseEvent, routePath: string) {
		e.preventDefault();
		const isPinned = qrsAppState.isRoutePinned(routePath);

		contextMenuData = [
			{
				label: isPinned ? 'Unpin from Dashboard' : 'Pin to Dashboard',
				icon: isPinned ? (PinOff as unknown as Component) : (Pin as unknown as Component),
				action: () => qrsAppState.togglePinnedRoute(routePath)
			}
		];

		contextMenuX = e.clientX;
		contextMenuY = e.clientY;
		contextMenuOpen = true;
	}

	function handleContextSelect(item: MenuItemData) {
		if (typeof item['action'] === 'function') {
			item['action']();
		}
	}

	// ── Panel Tabs ──────────────────────────────────────

	const panelTabs = [
		{ id: 'terminal', label: 'Terminal' },
		{ id: 'problems', label: 'Problems', badge: 3 },
		{ id: 'output', label: 'Output' }
	];

	// ── Terminal Output ─────────────────────────────────
	const terminalOutput: TerminalLine[] = [
		{ type: 'prompt', text: 'ironsight-svc monitor --ebpf' },
		{ type: 'info', text: '  [INFO] BPF program loaded successfully' },
		{ type: 'success', text: '  [OK] System tap initialized on cgroup2' },
		{ type: 'info', text: '  [INFO] Awaiting syscall events...' },
		{ type: 'prompt', text: '' }
	];
    
	// ── EDR Dashboard Data ──────────────────────────────
	import StatCard from '$lib/components/card/StatCard.svelte';
	import ThreatGauge from '$lib/components/data-display/ThreatGauge.svelte';
	import ThreatBadge from '$lib/components/ui/ThreatBadge.svelte';
	import SignalChip from '$lib/components/ui/SignalChip.svelte';
	import Table from '$lib/components/data-display/Table.svelte';
	import TableHeader from '$lib/components/data-display/TableHeader.svelte';
	import TableRow from '$lib/components/data-display/TableRow.svelte';
	import TableHeaderCell from '$lib/components/data-display/TableHeaderCell.svelte';
	import TableBody from '$lib/components/data-display/TableBody.svelte';
	import TableCell from '$lib/components/data-display/TableCell.svelte';

	const topRiskyProcesses = [
		{ pid: 14521, name: 'unknown_miner.elf', score: 85, level: 'Critical', signal: 'HIGH_ENTROPY' },
		{ pid: 4891, name: 'bash', score: 45, level: 'Medium', signal: 'SUSPICIOUS_EXEC' },
		{ pid: 902, name: 'sshd', score: 10, level: 'Low', signal: 'NEW_CONNECTION' }
	];
</script>

<div
	class="flex flex-col {ui.panelMaximized && ui.panelVisible
		? 'h-0 overflow-hidden'
		: 'flex-1'} bg-background relative h-full min-h-0 w-full"
>
	<!-- Code editor surface (Now EDR Dashboard) -->
	<div class="code-editor flex-1 overflow-auto p-6 select-text md:p-10">
		<div class="mx-auto flex w-full max-w-6xl flex-col space-y-8">
			<!-- Header -->
			<div
				class="border-border/50 flex flex-col justify-between gap-6 border-b pb-6 md:flex-row md:items-end"
			>
				<div class="flex items-center gap-4">
					<div class="bg-primary/10 ring-primary/20 rounded-xl p-3 shadow-sm ring-1">
						<Sparkles class="text-primary h-8 w-8" />
					</div>
					<div>
						<h1 class="text-3xl font-bold tracking-tight">System Status Overview</h1>
						<p class="text-muted-foreground mt-1 text-sm">
							IronSight EDR Real-Time Dashboard
						</p>
					</div>
				</div>
			</div>

			<!-- Main Metrics Grid -->
			<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div class="col-span-1 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
					<StatCard
						title="Monitored Processes"
						value="2,451"
						subtitle="Running instances"
						trend={4}
						color="primary"
					/>
					<StatCard
						title="Active Net Sockets"
						value="384"
						subtitle="ESTABLISHED / LISTEN"
						trend={-2}
						color="success"
					/>
					<StatCard
						title="Memory Anomalies"
						value="3"
						subtitle="W^X violations detected"
						trend={12}
						color="warning"
					/>
					<StatCard
						title="Security Events"
						value="142"
						subtitle="Past 24 hours"
						trend={24}
						color="danger"
					/>
				</div>
				<div class="col-span-1 border border-border bg-card rounded-xl p-6 flex flex-col items-center justify-center">
					<h3 class="text-sm font-medium tracking-tight text-zinc-500 w-full text-center pb-4">Overall Threat Level</h3>
					<ThreatGauge score={24} level="Medium" size="md" />
				</div>
			</div>

			<!-- Secondary Section: Top active threats -->
			<div class="border border-border bg-card rounded-xl overflow-hidden shadow-sm">
				<div class="px-6 py-4 border-b border-border bg-muted/20">
					<h3 class="font-semibold">Top Suspicious Processes</h3>
				</div>
				<Table compact zebra>
					{#snippet header()}
						<TableHeader>
							<TableRow>
								<TableHeaderCell>PID</TableHeaderCell>
								<TableHeaderCell>Process Name</TableHeaderCell>
								<TableHeaderCell>Severity</TableHeaderCell>
								<TableHeaderCell>Primary Signal</TableHeaderCell>
								<TableHeaderCell class="text-right">Score</TableHeaderCell>
							</TableRow>
						</TableHeader>
					{/snippet}
					{#snippet body()}
						<TableBody>
							{#each topRiskyProcesses as row (row.pid)}
								<TableRow class="hover:bg-accent/40 cursor-pointer">
									<TableCell class="font-mono text-muted-foreground">{row.pid}</TableCell>
									<TableCell class="font-medium text-foreground">{row.name}</TableCell>
									<TableCell>
										<ThreatBadge level={row.level as 'Critical' | 'Medium' | 'Low'} />
									</TableCell>
									<TableCell>
										<SignalChip name={row.signal} weight={row.score} />
									</TableCell>
									<TableCell class="text-right font-mono font-bold text-red-500/90">{row.score}</TableCell>
								</TableRow>
							{/each}
						</TableBody>
					{/snippet}
				</Table>
			</div>
		</div>
	</div>
</div>

{#if contextMenuOpen}
	<div style="position: fixed; left: {contextMenuX}px; top: {contextMenuY}px; z-index: 10000;">
		<ContextMenu
			data={contextMenuData}
			bind:show={contextMenuOpen}
			onselect={handleContextSelect}
		/>
	</div>
{/if}

<!-- ═══ PART: PanelPart ═══ -->
{#if ui.panelVisible}
	<PanelPart
		tabs={panelTabs}
		bind:activeTab={ui.activePanelTab}
		visible={ui.panelVisible}
		position="bottom"
		maximized={ui.panelMaximized}
		height={200}
		onToggleMaximize={() => (ui.panelMaximized = !ui.panelMaximized)}
		onclose={() => (ui.panelVisible = false)}
	>
		{#if ui.activePanelTab === 'terminal'}
			<div
				class="panel-content text-foreground/80 bg-foreground/5 h-full overflow-auto p-3 font-mono text-[12px] dark:bg-black/20"
			>
				{#each terminalOutput as line, i (i)}
					{#if line.type === 'prompt'}
						<div class="flex gap-2">
							<span style="color: oklch(0.65 0.2 145);">➜</span>
							<span style="color: oklch(0.6 0.15 250);">qix-workspace</span>
							<span style="color: oklch(0.65 0.15 80);">git:(main)</span>
							<span>{line.text}</span>
							{#if !line.text}
								<span class="inline-block h-4 w-2 animate-pulse" style="background: oklch(0.7 0 0);"
								></span>
							{/if}
						</div>
					{:else if line.type === 'success'}
						<div class="mt-0.5" style="color: oklch(0.65 0.2 145);">
							{line.text}
						</div>
					{:else}
						<div class="mt-0.5" style="color: oklch(0.5 0 0);">{line.text}</div>
					{/if}
				{/each}
			</div>
		{:else if ui.activePanelTab === 'problems'}
			<div class="panel-content bg-background text-foreground/80 h-full space-y-1.5 p-3 text-xs">
				<div class="flex items-center gap-2" style="color: oklch(0.7 0.15 80);">
					<AlertTriangle class="h-3.5 w-3.5" />
					<span class="font-mono">main.ts(15,5):</span>
					<span>Parameter 'err' implicitly has an 'any' type.</span>
				</div>
			</div>
		{:else if ui.activePanelTab === 'output'}
			<div class="panel-content bg-background text-primary h-full p-3 font-mono text-xs">
				<div>[2026-03-16 06:18:22] Svelte Language Server started</div>
				<div>[2026-03-16 06:18:24] Loaded source files</div>
			</div>
		{/if}
	</PanelPart>
{/if}
