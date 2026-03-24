<script lang="ts">
	import { cn } from '../../utils';
	import {
		Terminal,
		X,
		Trash2,
		Minimize2,
		Maximize2,
		Copy,
		Check,
		Server,
		Flame,
		Layers,
		AlertCircle,
		AlertTriangle,
		Search,
		Circle,
		FileCode,
		ClipboardCopy,
		Trash
	} from 'lucide-svelte';
	import type { LogEntry, LogLevel, LogSource } from '../../types/debug';
	import { onMount } from 'svelte';

	interface Props {
		logs?: LogEntry[];
		visible?: boolean;
		expanded?: boolean;
		qrsConnected?: boolean;
		svelteConnected?: boolean;
		isDark?: boolean;
		onRemoveLog?: (id: string) => void;
		onClearLogs?: () => void;
	}

	let {
		logs = [],
		visible = $bindable(false),
		expanded = $bindable(false),
		qrsConnected = false,
		svelteConnected = true,
		isDark = false,
		onRemoveLog,
		onClearLogs
	}: Props = $props();

	const MIN_HEIGHT = 150;
	const DEFAULT_HEIGHT = 350;
	const STORAGE_KEY = 'log-console-height';

	// Computed max height (SSR-safe)
	const getMaxHeight = () => (typeof window !== 'undefined' ? window.innerHeight * 0.8 : 600);

	let mounted = $state(false);
	let scrollRef: HTMLDivElement | undefined = $state();
	let filterExpanded = $state(false);
	let filterInputRef: HTMLInputElement | undefined = $state();
	let consoleHeight = $state(DEFAULT_HEIGHT);
	let isResizing = $state(false);

	let filter = $state<'all' | 'error' | 'warning'>('all');
	let sourceFilter = $state<LogSource>('all');
	let keyFilter = $state('');
	let isCopied = $state(false);

	// Context menu state
	let contextMenu = $state<{ x: number; y: number; log: LogEntry } | null>(null);

	// Info modal state
	let infoModal = $state<LogEntry | null>(null);

	onMount(() => {
		mounted = true;

		// Load saved height
		const savedHeight = localStorage.getItem(STORAGE_KEY);
		if (savedHeight) {
			const parsed = parseInt(savedHeight, 10);
			if (!isNaN(parsed) && parsed >= MIN_HEIGHT) {
				consoleHeight = Math.min(parsed, getMaxHeight());
			}
		}

		// Close context menu on click elsewhere
		const handleClick = () => (contextMenu = null);
		document.addEventListener('click', handleClick);
		return () => document.removeEventListener('click', handleClick);
	});

	// Helper for log entry styles
	const getStageStyle = (stage?: string) => {
		switch (stage) {
			case 'QRS':
				return 'text-emerald-500 bg-emerald-500/10';
			case 'SVELTE':
				return 'text-orange-500 bg-orange-500/10';
			case 'CLIENT':
				return 'text-purple-500 bg-purple-500/10';
			default:
				return 'text-zinc-500 bg-zinc-500/10';
		}
	};

	const getLevelStyle = (level: LogLevel) => {
		switch (level) {
			case 'error':
				return 'text-red-400 bg-red-950/5 border-l border-l-red-500';
			case 'warning':
				return 'text-amber-400 bg-amber-950/5 border-l border-l-amber-500';
			case 'success':
				return 'text-emerald-400 bg-emerald-950/5 border-l border-l-emerald-500';
			default:
				return 'text-zinc-400 hover:bg-white/[0.02] border-l border-l-transparent';
		}
	};

	function formatTime(date: Date) {
		return date.toLocaleTimeString([], {
			hour12: false,
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			fractionalSecondDigits: 3
		});
	}

	// Truncate target path for display
	function formatTarget(target?: string): string {
		if (!target) return '';
		const parts = target.split('::');
		if (parts.length <= 2) return target;
		return `${parts[0]}::…::${parts[parts.length - 1]}`;
	}

	let hasFilter = $derived(keyFilter.length > 0);

	let filteredLogs = $derived(
		logs.filter((log) => {
			if (filter === 'error' && log.level !== 'error') return false;
			if (filter === 'warning' && log.level !== 'warning') return false;

			if (sourceFilter !== 'all' && log.stage !== sourceFilter) return false;

			if (keyFilter) {
				const search = keyFilter.toLowerCase();
				const matchMessage = log.message.toLowerCase().includes(search);
				const matchDetails = log.details
					? JSON.stringify(log.details).toLowerCase().includes(search)
					: false;
				return matchMessage || matchDetails;
			}

			return true;
		})
	);

	function handleFilterClick() {
		filterExpanded = true;
		setTimeout(() => filterInputRef?.focus(), 50);
	}

	function handleFilterBlur() {
		if (keyFilter.length === 0) {
			filterExpanded = false;
		}
	}

	function handleContextMenu(e: MouseEvent, log: LogEntry) {
		e.preventDefault();
		contextMenu = { x: e.clientX, y: e.clientY, log };
	}

	function closeContextMenu() {
		contextMenu = null;
	}

	async function handleCopyEntry() {
		if (contextMenu?.log && typeof navigator !== 'undefined') {
			try {
				const entry = {
					timestamp: contextMenu.log.timestamp.toISOString(),
					level: contextMenu.log.level,
					stage: contextMenu.log.stage,
					message: contextMenu.log.message,
					target: contextMenu.log.target,
					details: contextMenu.log.details,
					request: contextMenu.log.request,
					response: contextMenu.log.response
				};
				const cleaned = JSON.parse(JSON.stringify(entry));
				await navigator.clipboard.writeText(JSON.stringify(cleaned, null, 2));
			} catch {
				/* clipboard may be unavailable */
			}
			closeContextMenu();
		}
	}

	async function handleCopyMessage() {
		if (contextMenu?.log && typeof navigator !== 'undefined') {
			try {
				await navigator.clipboard.writeText(contextMenu.log.message);
			} catch {
				/* clipboard may be unavailable */
			}
			closeContextMenu();
		}
	}

	function handleRemoveEntry() {
		if (contextMenu?.log && onRemoveLog) {
			onRemoveLog(contextMenu.log.id);
		}
		closeContextMenu();
	}

	function handleClearAll() {
		if (onClearLogs) {
			onClearLogs();
		}
		closeContextMenu();
	}

	function handleShowInfo() {
		if (contextMenu?.log) {
			infoModal = contextMenu.log;
			closeContextMenu();
		}
	}

	function closeInfoModal() {
		infoModal = null;
	}

	async function handleCopyLogs() {
		if (typeof navigator === 'undefined') return;

		try {
			const text = filteredLogs
				.map(
					(l) =>
						`[${l.timestamp.toISOString()}] [${l.level.toUpperCase()}] ${l.stage ? `[${l.stage}] ` : ''}${l.message} ${l.details ? JSON.stringify(l.details) : ''}`
				)
				.join('\n');

			await navigator.clipboard.writeText(text);
			isCopied = true;
			setTimeout(() => {
				isCopied = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy logs:', err);
		}
	}

	// Resize handlers
	function startResize(e: MouseEvent) {
		e.preventDefault();
		isResizing = true;
		const startY = e.clientY;
		const startHeight = consoleHeight;

		function onMouseMove(e: MouseEvent) {
			const delta = startY - e.clientY;
			const newHeight = Math.max(MIN_HEIGHT, Math.min(getMaxHeight(), startHeight + delta));
			consoleHeight = newHeight;
		}

		function onMouseUp() {
			isResizing = false;
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseup', onMouseUp);
			if (typeof window !== 'undefined') {
				localStorage.setItem(STORAGE_KEY, consoleHeight.toString());
			}
		}

		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);
	}
</script>

{#if visible && mounted}
	<div
		class={cn(
			'fixed right-0 bottom-0 left-0 z-[1000] border-t font-mono shadow-2xl transition-all duration-200 ease-in-out',
			!expanded && 'h-10',
			isDark
				? 'border-[color:var(--color-border)] bg-[color:var(--color-card)]'
				: 'border-zinc-800 bg-zinc-900'
		)}
		style:height={expanded ? `${consoleHeight}px` : undefined}
		style:z-index={9999}
	>
		<!-- Resize Handle -->
		{#if expanded}
			<div
				class={cn(
					'group absolute -top-1 right-0 left-0 flex h-2 cursor-ns-resize items-center justify-center',
					isResizing && 'bg-primary/20'
				)}
				onmousedown={startResize}
			>
				<div
					class={cn(
						'h-1 w-10 rounded-full transition-colors',
						isResizing
							? 'bg-primary'
							: isDark
								? 'bg-zinc-600 group-hover:bg-zinc-500'
								: 'bg-zinc-700 group-hover:bg-zinc-600'
					)}
				></div>
			</div>
		{/if}

		<!-- Header -->
		<div
			class={cn(
				'flex h-10 cursor-pointer items-center justify-between border-b px-3 transition-colors',
				isDark
					? 'border-[color:var(--color-border)] bg-[color:var(--color-muted)]/50 hover:bg-[color:var(--color-muted)]/80'
					: 'border-zinc-700/50 bg-zinc-800/80 hover:bg-zinc-700/50'
			)}
			onclick={() => (expanded = !expanded)}
		>
			<div class="flex items-center gap-2">
				<!-- Connection Status Icons -->
				<div class="flex items-center gap-1">
					<!-- QRS Status -->
					<div
						class={cn(
							'flex h-6 w-6 items-center justify-center rounded transition-colors',
							qrsConnected
								? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
								: 'bg-red-500/15 text-red-400 hover:bg-red-500/25'
						)}
						title={qrsConnected ? 'QRS: Connected' : 'QRS: Disconnected'}
					>
						<Server size={11} />
					</div>
					<!-- Svelte Status -->
					{#if svelteConnected}
						<div
							class="flex h-6 w-6 items-center justify-center rounded bg-orange-500/15 text-orange-400 transition-colors hover:bg-orange-500/25"
							title="Svelte: Ready"
						>
							<Flame size={11} />
						</div>
					{/if}
				</div>

				<div
					class={cn('h-4 w-px', isDark ? 'bg-[color:var(--color-border)]' : 'bg-zinc-700')}
				></div>

				<!-- Event Count -->
				<div
					class={cn(
						'flex h-6 items-center gap-1 rounded px-1.5 text-[10px]',
						isDark
							? 'bg-[color:var(--color-muted)]/50 text-[color:var(--color-muted-foreground)]'
							: 'bg-zinc-700/50 text-zinc-400'
					)}
					title="Total events"
				>
					<span class="tabular-nums">{logs.length}</span>
				</div>
			</div>

			<div class="flex items-center gap-0.5" onclick={(e: MouseEvent) => e.stopPropagation()}>
				<!-- Source Filter: ALL | Svelte | QRS -->
				<div
					class={cn(
						'mr-1 flex items-center rounded border p-0.5',
						isDark
							? 'border-[color:var(--color-border)] bg-[color:var(--color-card)]'
							: 'border-zinc-700/50 bg-zinc-900/80'
					)}
				>
					<button
						class={cn(
							'flex h-6 w-6 items-center justify-center rounded transition-colors',
							sourceFilter === 'all'
								? isDark
									? 'bg-[color:var(--color-primary)] text-white'
									: 'bg-zinc-600 text-white'
								: isDark
									? 'text-[color:var(--color-muted-foreground)] hover:bg-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]'
									: 'text-zinc-500 hover:bg-zinc-700 hover:text-zinc-200'
						)}
						onclick={() => (sourceFilter = 'all')}
						title="All Sources"
					>
						<Layers size={11} />
					</button>
					<button
						class={cn(
							'flex h-6 w-6 items-center justify-center rounded transition-colors',
							sourceFilter === 'SVELTE'
								? 'bg-orange-500/20 text-orange-400'
								: 'text-zinc-500 hover:bg-zinc-700 hover:text-orange-400'
						)}
						onclick={() => (sourceFilter = 'SVELTE')}
						title="Svelte"
					>
						<Flame size={11} />
					</button>
					<button
						class={cn(
							'flex h-6 w-6 items-center justify-center rounded transition-colors',
							sourceFilter === 'QRS'
								? 'bg-emerald-500/20 text-emerald-400'
								: 'text-zinc-500 hover:bg-zinc-700 hover:text-emerald-400'
						)}
						onclick={() => (sourceFilter = 'QRS')}
						title="QRS Backend"
					>
						<Server size={11} />
					</button>
				</div>

				<!-- Filter Input -->
				<div class="mr-1 flex items-center">
					{#if filterExpanded || hasFilter}
						<input
							bind:this={filterInputRef}
							bind:value={keyFilter}
							placeholder="Filter…"
							class={cn(
								'h-6 rounded border px-2 text-[10px] transition-all focus:outline-none',
								hasFilter ? 'w-32' : 'w-20',
								isDark
									? 'border-[color:var(--color-border)] bg-[color:var(--color-card)] text-[color:var(--color-foreground)] placeholder:text-[color:var(--color-muted-foreground)] focus:border-[color:var(--color-ring)]'
									: 'border-zinc-700 bg-zinc-900 text-zinc-200 placeholder:text-zinc-500 focus:border-zinc-500'
							)}
							onblur={handleFilterBlur}
						/>
					{:else}
						<button
							class={cn(
								'flex h-6 w-6 items-center justify-center rounded transition-colors',
								isDark
									? 'text-[color:var(--color-muted-foreground)] hover:bg-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]'
									: 'text-zinc-500 hover:bg-zinc-700 hover:text-zinc-200'
							)}
							onclick={handleFilterClick}
							title="Filter logs"
						>
							<Search size={11} />
						</button>
					{/if}
				</div>

				<!-- Log Type Filter: ALL | ERR | WARN -->
				<div
					class={cn(
						'mr-1 flex items-center rounded border p-0.5',
						isDark
							? 'border-[color:var(--color-border)] bg-[color:var(--color-card)]'
							: 'border-zinc-700/50 bg-zinc-900/80'
					)}
				>
					<button
						class={cn(
							'flex h-6 w-6 items-center justify-center rounded transition-colors',
							filter === 'all'
								? isDark
									? 'bg-[color:var(--color-primary)] text-white'
									: 'bg-zinc-600 text-white'
								: isDark
									? 'text-[color:var(--color-muted-foreground)] hover:bg-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]'
									: 'text-zinc-500 hover:bg-zinc-700 hover:text-zinc-200'
						)}
						onclick={() => (filter = 'all')}
						title="All Levels"
					>
						<Circle size={9} />
					</button>
					<button
						class={cn(
							'flex h-6 w-6 items-center justify-center rounded transition-colors',
							filter === 'error'
								? 'bg-red-500/20 text-red-400'
								: 'text-zinc-500 hover:bg-zinc-700 hover:text-red-400'
						)}
						onclick={() => (filter = 'error')}
						title="Errors"
					>
						<AlertCircle size={11} />
					</button>
					<button
						class={cn(
							'flex h-6 w-6 items-center justify-center rounded transition-colors',
							filter === 'warning'
								? 'bg-amber-500/20 text-amber-400'
								: 'text-zinc-500 hover:bg-zinc-700 hover:text-amber-400'
						)}
						onclick={() => (filter = 'warning')}
						title="Warnings"
					>
						<AlertTriangle size={11} />
					</button>
				</div>

				<div
					class={cn('mx-0.5 h-4 w-px', isDark ? 'bg-[color:var(--color-border)]' : 'bg-zinc-700')}
				></div>

				<!-- Action Buttons -->
				<button
					class={cn(
						'flex h-6 w-6 items-center justify-center rounded transition-colors',
						isDark
							? 'text-[color:var(--color-muted-foreground)] hover:bg-[color:var(--color-muted)] hover:text-emerald-400'
							: 'text-zinc-500 hover:bg-zinc-700 hover:text-emerald-400'
					)}
					onclick={() => handleCopyLogs()}
					title="Copy all logs"
				>
					{#if isCopied}
						<Check size={11} class="text-emerald-400" />
					{:else}
						<Copy size={11} />
					{/if}
				</button>
				<button
					class={cn(
						'flex h-6 w-6 items-center justify-center rounded transition-colors',
						isDark
							? 'text-[color:var(--color-muted-foreground)] hover:bg-[color:var(--color-muted)] hover:text-red-400'
							: 'text-zinc-500 hover:bg-zinc-700 hover:text-red-400'
					)}
					onclick={() => handleClearAll()}
					title="Clear all logs"
				>
					<Trash2 size={11} />
				</button>

				<div
					class={cn('mx-0.5 h-4 w-px', isDark ? 'bg-[color:var(--color-border)]' : 'bg-zinc-700')}
				></div>

				<button
					class={cn(
						'flex h-6 w-6 items-center justify-center rounded transition-colors',
						isDark
							? 'text-[color:var(--color-muted-foreground)] hover:bg-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]'
							: 'text-zinc-500 hover:bg-zinc-700 hover:text-white'
					)}
					onclick={() => (expanded = !expanded)}
					title={expanded ? 'Collapse' : 'Expand'}
				>
					{#if expanded}
						<Minimize2 size={11} />
					{:else}
						<Maximize2 size={11} />
					{/if}
				</button>
				<button
					class={cn(
						'flex h-6 w-6 items-center justify-center rounded transition-colors',
						isDark
							? 'text-[color:var(--color-muted-foreground)] hover:bg-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]'
							: 'text-zinc-500 hover:bg-zinc-700 hover:text-white'
					)}
					onclick={() => (visible = false)}
					title="Close"
				>
					<X size={11} />
				</button>
			</div>
		</div>

		<!-- Content -->
		{#if expanded}
			<div
				bind:this={scrollRef}
				class={cn(
					'scrollbar-thin space-y-px overflow-y-auto px-1.5 py-0.5',
					isDark ? 'bg-[color:var(--color-background)]' : 'bg-zinc-950'
				)}
				style:height="{consoleHeight - 40}px"
			>
				{#if filteredLogs.length === 0}
					<div
						class={cn(
							'flex h-full flex-col items-center justify-center gap-1',
							isDark ? 'text-[color:var(--color-muted-foreground)]' : 'text-zinc-600'
						)}
					>
						<Terminal size={18} class="opacity-30" />
						<p class="text-[9px] tracking-widest uppercase opacity-50">No logs</p>
					</div>
				{:else}
					{#each filteredLogs as log (log.id)}
						<div
							class={cn(
								'group flex cursor-default items-start gap-1.5 rounded px-1 py-px font-mono text-[9px] leading-tight transition-colors',
								getLevelStyle(log.level)
							)}
							oncontextmenu={(e) => handleContextMenu(e, log)}
						>
							<!-- Timestamp -->
							<span
								class={cn(
									'w-[66px] shrink-0 tabular-nums select-none',
									isDark ? 'text-[color:var(--color-muted-foreground)]/60' : 'text-zinc-600'
								)}
							>
								{formatTime(new Date(log.timestamp))}
							</span>

							<!-- Stage Badge -->
							{#if log.stage}
								<span
									class={cn(
										'w-8 shrink-0 rounded px-1 text-center text-[8px] font-semibold tracking-wide uppercase select-none',
										getStageStyle(log.stage)
									)}
								>
									{log.stage === 'SVELTE' ? 'SVT' : log.stage}
								</span>
							{/if}

							<!-- Content -->
							<div class="flex min-w-0 flex-1 flex-col gap-px">
								<div class="flex items-baseline gap-1.5">
									<!-- Message -->
									<span
										class={cn(
											'flex-1 text-[9px] leading-tight break-all',
											log.level === 'error' && 'font-medium text-red-300',
											log.level === 'warning' && 'text-amber-300',
											log.level === 'info' &&
												(isDark ? 'text-[color:var(--color-foreground)]/80' : 'text-zinc-300'),
											log.level === 'success' && 'text-emerald-300'
										)}
									>
										{log.message}
									</span>

									<!-- Meta: Target/Module -->
									{#if log.target}
										<span
											class={cn(
												'flex shrink-0 items-center gap-0.5 text-[8px] opacity-0 transition-opacity group-hover:opacity-100',
												isDark ? 'text-[color:var(--color-muted-foreground)]' : 'text-zinc-600'
											)}
										>
											<FileCode size={8} class="opacity-60" />
											{formatTarget(log.target)}
											{#if log.line}
												<span class="opacity-60">:{log.line}</span>
											{/if}
										</span>
									{/if}
								</div>

								<!-- Details -->
								{#if log.details}
									<div
										class={cn(
											'mt-px overflow-x-auto rounded p-1',
											isDark
												? 'border border-[color:var(--color-border)]/30 bg-[color:var(--color-muted)]/30'
												: 'border border-zinc-800/30 bg-black/30'
										)}
									>
										<pre
											class={cn(
												'text-[8px] leading-tight whitespace-pre-wrap',
												isDark ? 'text-[color:var(--color-muted-foreground)]' : 'text-zinc-500'
											)}>{JSON.stringify(log.details, null, 2)}</pre>
									</div>
								{/if}
							</div>
						</div>
					{/each}
				{/if}
			</div>
		{/if}
	</div>

	<!-- Context Menu -->
	{#if contextMenu}
		<div
			class={cn(
				'fixed z-[10000] min-w-[140px] rounded-md border py-1 text-[11px] shadow-lg',
				isDark
					? 'border-[color:var(--color-border)] bg-[color:var(--color-popover)] text-[color:var(--color-popover-foreground)]'
					: 'border-zinc-700 bg-zinc-800 text-zinc-200'
			)}
			style:left="{contextMenu.x}px"
			style:top="{contextMenu.y}px"
			onclick={(e) => e.stopPropagation()}
		>
			<button
				class={cn(
					'flex w-full items-center gap-2 px-3 py-1.5 text-left transition-colors',
					isDark ? 'hover:bg-[color:var(--color-muted)]' : 'hover:bg-zinc-700'
				)}
				onclick={handleShowInfo}
			>
				<FileCode size={12} />
				Show Info
			</button>
			<div class={cn('my-1 h-px', isDark ? 'bg-[color:var(--color-border)]' : 'bg-zinc-700')}></div>
			<button
				class={cn(
					'flex w-full items-center gap-2 px-3 py-1.5 text-left transition-colors',
					isDark ? 'hover:bg-[color:var(--color-muted)]' : 'hover:bg-zinc-700'
				)}
				onclick={handleCopyMessage}
			>
				<ClipboardCopy size={12} />
				Copy Message
			</button>
			<button
				class={cn(
					'flex w-full items-center gap-2 px-3 py-1.5 text-left transition-colors',
					isDark ? 'hover:bg-[color:var(--color-muted)]' : 'hover:bg-zinc-700'
				)}
				onclick={handleCopyEntry}
			>
				<Copy size={12} />
				Copy Entry (JSON)
			</button>
			<div class={cn('my-1 h-px', isDark ? 'bg-[color:var(--color-border)]' : 'bg-zinc-700')}></div>
			<button
				class={cn(
					'flex w-full items-center gap-2 px-3 py-1.5 text-left text-red-400 transition-colors',
					isDark ? 'hover:bg-red-500/10' : 'hover:bg-red-500/20'
				)}
				onclick={handleRemoveEntry}
			>
				<Trash size={12} />
				Remove
			</button>
			<button
				class={cn(
					'flex w-full items-center gap-2 px-3 py-1.5 text-left text-red-400 transition-colors',
					isDark ? 'hover:bg-red-500/10' : 'hover:bg-red-500/20'
				)}
				onclick={handleClearAll}
			>
				<Trash2 size={12} />
				Clear All
			</button>
		</div>
	{/if}

	<!-- Info Modal -->
	{#if infoModal}
		<div
			class="fixed inset-0 z-[10001] flex items-center justify-center bg-black/50 backdrop-blur-sm"
			onclick={closeInfoModal}
		>
			<div
				class={cn(
					'mx-4 flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border shadow-2xl',
					isDark
						? 'border-[color:var(--color-border)] bg-[color:var(--color-card)]'
						: 'border-zinc-700 bg-zinc-900'
				)}
				onclick={(e) => e.stopPropagation()}
			>
				<!-- Header -->
				<div
					class={cn(
						'flex items-center justify-between border-b px-4 py-3',
						isDark ? 'border-[color:var(--color-border)]' : 'border-zinc-700'
					)}
				>
					<div class="flex items-center gap-2">
						<FileCode
							size={16}
							class={isDark ? 'text-[color:var(--color-muted-foreground)]' : 'text-zinc-400'}
						/>
						<span class="text-sm font-semibold">Log Entry Details</span>
					</div>
					<button
						class={cn(
							'hover:bg-muted rounded p-1 transition-colors',
							isDark
								? 'text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)]'
								: 'text-zinc-400 hover:text-white'
						)}
						onclick={closeInfoModal}
					>
						<X size={16} />
					</button>
				</div>

				<!-- Content -->
				<div class="flex-1 overflow-auto p-4">
					<pre
						class={cn(
							'font-mono text-xs leading-relaxed break-all whitespace-pre-wrap',
							isDark ? 'text-[color:var(--color-foreground)]' : 'text-zinc-200'
						)}>{JSON.stringify(
							{
								timestamp: infoModal.timestamp.toISOString(),
								level: infoModal.level,
								stage: infoModal.stage,
								message: infoModal.message,
								target: infoModal.target,
								file: infoModal.file,
								line: infoModal.line,
								details: infoModal.details,
								request: infoModal.request,
								response: infoModal.response
							},
							null,
							2
						)}</pre>
				</div>

				<!-- Footer -->
				<div
					class={cn(
						'flex items-center justify-end gap-2 border-t px-4 py-3',
						isDark ? 'border-[color:var(--color-border)]' : 'border-zinc-700'
					)}
				>
					<button
						class={cn(
							'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-colors',
							isDark
								? 'bg-[color:var(--color-muted)] text-[color:var(--color-foreground)] hover:bg-[color:var(--color-muted)]/80'
								: 'bg-zinc-700 text-white hover:bg-zinc-600'
						)}
						onclick={async () => {
							try {
								const entry = {
									timestamp: infoModal?.timestamp?.toISOString(),
									level: infoModal?.level,
									stage: infoModal?.stage,
									message: infoModal?.message,
									target: infoModal?.target,
									details: infoModal?.details,
									request: infoModal?.request,
									response: infoModal?.response
								};
								const cleaned = JSON.parse(JSON.stringify(entry));
								if (typeof navigator !== 'undefined') {
									await navigator.clipboard.writeText(JSON.stringify(cleaned, null, 2));
								}
							} catch {
								/* clipboard may be unavailable */
							}
							closeInfoModal();
						}}
					>
						<Copy size={12} />
						Copy JSON
					</button>
					<button
						class={cn(
							'rounded-md px-3 py-1.5 text-xs transition-colors',
							isDark
								? 'text-[color:var(--color-muted-foreground)] hover:bg-[color:var(--color-muted)]'
								: 'text-zinc-400 hover:bg-zinc-700'
						)}
						onclick={closeInfoModal}
					>
						Close
					</button>
				</div>
			</div>
		</div>
	{/if}
{/if}

<style>
	/* Custom scrollbar */
	.scrollbar-thin::-webkit-scrollbar {
		width: 3px;
	}
	.scrollbar-thin::-webkit-scrollbar-track {
		background: transparent;
	}
	.scrollbar-thin::-webkit-scrollbar-thumb {
		background: rgb(63 63 70 / 0.5);
		border-radius: 2px;
	}
	.scrollbar-thin::-webkit-scrollbar-thumb:hover {
		background: rgb(82 82 91 / 0.8);
	}
</style>
