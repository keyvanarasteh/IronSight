<script lang="ts">
	import { GitBranch, X, Bell, Check, Wifi, WifiOff, Braces, Radio, Layers } from 'lucide-svelte';
	import StatusItem from './StatusItem.svelte';

	type ConnStatus = 'connected' | 'disconnected' | 'checking';
	type RegistryStatus = 'idle' | 'loading' | 'success' | 'error';
	type WsConnState = 'disconnected' | 'connecting' | 'connected' | 'error';

	let {
		branch,
		errors,
		warnings,
		language,
		encoding = 'UTF-8',
		qicroStatus = 'checking' as ConnStatus,
		qicroVersion = '',
		graphqlStatus = 'idle' as RegistryStatus,
		graphqlCount = 0,
		wsConnState = 'disconnected' as WsConnState,
		wsReconnectAttempt = 0,
		featuresCount = 0,
		onFeaturesClick,
		onQicroClick,
		onGraphqlClick,
		onWsClick
	}: {
		branch: string;
		errors: number;
		warnings: number;
		language: string;
		encoding?: string;
		qicroStatus?: ConnStatus;
		qicroVersion?: string;
		graphqlStatus?: RegistryStatus;
		graphqlCount?: number;
		wsConnState?: WsConnState;
		wsReconnectAttempt?: number;
		featuresCount?: number;
		onFeaturesClick?: () => void;
		onQicroClick?: () => void;
		onGraphqlClick?: () => void;
		onWsClick?: () => void;
	} = $props();

	let statusColor = $derived(
		qicroStatus === 'connected'
			? 'text-green-400'
			: qicroStatus === 'disconnected'
				? 'text-red-400'
				: 'text-yellow-400'
	);

	let statusLabel = $derived(
		qicroStatus === 'connected'
			? `Qicro ${qicroVersion}`
			: qicroStatus === 'disconnected'
				? 'Qicro ✗'
				: 'Qicro …'
	);

	// ── GraphQL registry status ────────────────────────
	let gqlColor = $derived(
		graphqlStatus === 'success'
			? 'text-violet-400'
			: graphqlStatus === 'error'
				? 'text-red-400'
				: graphqlStatus === 'loading'
					? 'text-yellow-400'
					: 'text-zinc-500'
	);
	let gqlLabel = $derived(
		graphqlStatus === 'success'
			? `GQL ${graphqlCount}`
			: graphqlStatus === 'error'
				? 'GQL ✗'
				: graphqlStatus === 'loading'
					? 'GQL …'
					: 'GQL —'
	);

	// ── WebSocket live connection status ───────────────
	let wsColor = $derived(
		wsConnState === 'connected'
			? 'text-cyan-400'
			: wsConnState === 'error'
				? 'text-red-400'
				: wsConnState === 'connecting'
					? 'text-yellow-400'
					: 'text-zinc-500'
	);
	let wsLabel = $derived(
		wsConnState === 'connected'
			? 'WS ✓'
			: wsConnState === 'error'
				? `WS ✗${wsReconnectAttempt > 0 ? ` (${wsReconnectAttempt})` : ''}`
				: wsConnState === 'connecting'
					? 'WS …'
					: 'WS —'
	);
</script>

<footer
	class="bg-statusbar-bg text-statusbar-fg border-statusbar-border flex h-6 shrink-0 items-center justify-between overflow-hidden border-t px-3 text-[11px]"
>
	<div class="flex h-full items-center">
		<StatusItem icon={GitBranch} label={branch} />
		<StatusItem icon={X} label={String(errors)} />
		<StatusItem icon={Bell} label={String(warnings)} />
	</div>
	<div class="flex h-full items-center gap-0.5">
		<!-- Qicro REST connection status -->
		<button
			class="hover:bg-statusbar-item-hover m-0 flex h-full cursor-default items-center gap-1.5 border-none bg-transparent px-2 text-inherit transition-colors"
			title={qicroStatus === 'connected'
				? `Connected to Qicro v${qicroVersion}`
				: qicroStatus === 'disconnected'
					? 'Qicro backend unreachable'
					: 'Checking Qicro connection…'}
			onclick={onQicroClick}
		>
			{#if qicroStatus === 'connected'}
				<Wifi class="h-3 w-3 {statusColor}" />
			{:else}
				<WifiOff class="h-3 w-3 {statusColor}" />
			{/if}
			<span class={statusColor}>{statusLabel}</span>
		</button>

		<!-- GraphQL registry status -->
		<button
			class="hover:bg-statusbar-item-hover m-0 flex h-full cursor-default items-center gap-1 border-none bg-transparent px-1.5 text-inherit transition-colors"
			title={graphqlStatus === 'success'
				? `${graphqlCount} GraphQL operations registered`
				: graphqlStatus === 'error'
					? 'Failed to load GraphQL registry'
					: graphqlStatus === 'loading'
						? 'Loading GraphQL registry…'
						: 'GraphQL registry not loaded'}
			onclick={onGraphqlClick}
		>
			<Braces class="h-3 w-3 {gqlColor}" />
			<span class={gqlColor}>{gqlLabel}</span>
		</button>

		<!-- WebSocket live connection status -->
		<button
			class="hover:bg-statusbar-item-hover m-0 flex h-full cursor-default items-center gap-1 border-none bg-transparent px-1.5 text-inherit transition-colors"
			title={wsConnState === 'connected'
				? 'WebSocket connected to QRS'
				: wsConnState === 'error'
					? `WebSocket disconnected (retry #${wsReconnectAttempt})`
					: wsConnState === 'connecting'
						? 'Connecting to WebSocket…'
						: 'WebSocket not connected'}
			onclick={onWsClick}
		>
			<Radio class="h-3 w-3 {wsColor}" />
			<span class={wsColor}>{wsLabel}</span>
		</button>

		<div class="hidden h-full items-center sm:flex">
			<button
				class="hover:bg-statusbar-item-hover m-0 flex h-full cursor-pointer items-center gap-1 border-none bg-transparent px-2 text-inherit"
				title="{featuresCount} active features — click to view registries"
				onclick={onFeaturesClick}
			>
				<Layers class="h-3 w-3 text-amber-400" />
				<span class="text-amber-400">Features: {featuresCount}</span>
			</button>
			<StatusItem label={encoding} />
			<StatusItem label={language} />
		</div>
		<button
			class="hover:bg-statusbar-item-hover m-0 flex h-full cursor-pointer items-center border-none bg-transparent px-2 text-inherit"
		>
			<Check class="h-3.5 w-3.5" />
		</button>
	</div>
</footer>
