<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Info, AlertTriangle, ShieldAlert, X, ChevronDown, ChevronUp } from 'lucide-svelte';

	type NotificationSeverity = 'info' | 'warning' | 'error';

	let {
		severity = 'info' as NotificationSeverity,
		message = '',
		detail = '',
		source = '',
		progress,
		expanded = $bindable(false),
		headerToggleable = true,
		actions,
		ondismiss,
		class: className = ''
	}: {
		severity?: NotificationSeverity;
		message?: string;
		detail?: string | Snippet;
		source?: string;
		progress?: number;
		expanded?: boolean;
		headerToggleable?: boolean;
		actions?: Snippet;
		ondismiss?: () => void;
		class?: string;
	} = $props();

	const severityIcons = {
		info: Info,
		warning: AlertTriangle,
		error: ShieldAlert
	} as const;

	const SeverityIcon = $derived(severityIcons[severity]);

	const severityColors: Record<NotificationSeverity, string> = {
		info: 'text-notification-fg',
		warning: 'text-[var(--qix-notificationsWarningIcon-fg,#cca700)]',
		error: 'text-[var(--qix-notificationsErrorIcon-fg,#f14c4c)]'
	};
</script>

<div
	class="bg-notification-bg text-notification-fg border-notification-border flex flex-col border-b text-xs {className}"
	role="alert"
	aria-live="polite"
>
	{#if progress !== undefined}
		<div class="h-0.5 bg-white/5">
			<div
				class="bg-progressbar-bg h-full transition-all"
				style="width: {Math.min(100, Math.max(0, progress))}%"
			></div>
		</div>
	{/if}

	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="flex items-start gap-2 p-2 {headerToggleable && detail
			? 'cursor-pointer transition-colors hover:bg-white/5'
			: ''}"
		onclick={() => {
			if (headerToggleable && detail) {
				expanded = !expanded;
			}
		}}
	>
		<SeverityIcon class="mt-0.5 h-4 w-4 shrink-0 {severityColors[severity]}" />

		<div class="min-w-0 flex-1">
			<div class="leading-5">
				{#if source}
					<span class="font-semibold">{source}: </span>
				{/if}
				<span>{message}</span>
			</div>

			{#if expanded && detail}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div onclick={(e) => e.stopPropagation()} class="cursor-auto">
					{#if typeof detail === 'string'}
						<p class="mt-1 whitespace-pre-wrap opacity-70">{detail}</p>
					{:else}
						{@render detail()}
					{/if}
				</div>
			{/if}
			{#if actions}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="mt-1.5 flex cursor-auto items-center gap-1"
					onclick={(e) => e.stopPropagation()}
				>
					{@render actions()}
				</div>
			{/if}
		</div>

		<div class="flex shrink-0 items-center gap-0.5">
			{#if detail}
				<button
					class="m-0 cursor-pointer rounded border-none bg-transparent p-0.5 text-current hover:bg-white/10"
					onclick={(e) => {
						e.stopPropagation();
						expanded = !expanded;
					}}
					aria-label={expanded ? 'Collapse' : 'Expand'}
				>
					{#if expanded}
						<ChevronUp class="h-3.5 w-3.5" />
					{:else}
						<ChevronDown class="h-3.5 w-3.5" />
					{/if}
				</button>
			{/if}
			{#if ondismiss}
				<button
					class="m-0 cursor-pointer rounded border-none bg-transparent p-0.5 text-current hover:bg-white/10"
					onclick={(e) => {
						e.stopPropagation();
						ondismiss();
					}}
					aria-label="Dismiss notification"
				>
					<X class="h-3.5 w-3.5" />
				</button>
			{/if}
		</div>
	</div>
</div>
