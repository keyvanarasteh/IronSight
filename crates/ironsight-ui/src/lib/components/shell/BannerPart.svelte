<script lang="ts">
	import type { Snippet, Component } from 'svelte';
	import { X, Info, AlertTriangle, ShieldAlert } from 'lucide-svelte';

	type BannerSeverity = 'info' | 'warning' | 'error';

	let {
		message = '',
		severity = 'info' as BannerSeverity,
		icon: IconComponent,
		visible = true,
		closeable = true,
		onclose,
		actions,
		class: className = ''
	}: {
		message?: string;
		severity?: BannerSeverity;
		icon?: Component;
		visible?: boolean;
		closeable?: boolean;
		onclose?: () => void;
		actions?: Snippet;
		class?: string;
	} = $props();

	const severityClasses: Record<BannerSeverity, string> = {
		info: 'bg-banner-bg text-banner-fg',
		warning:
			'bg-[var(--qix-inputValidation-warningBg,#352a05)] text-[var(--qix-inputValidation-warningFg,#cca700)]',
		error:
			'bg-[var(--qix-inputValidation-errorBg,#5a1d1d)] text-[var(--qix-inputValidation-errorFg,#f14c4c)]'
	};

	const defaultIcons = {
		info: Info,
		warning: AlertTriangle,
		error: ShieldAlert
	} as const;

	const ResolvedIcon = $derived(IconComponent ?? defaultIcons[severity]);
</script>

{#if visible}
	<div
		class="flex shrink-0 items-center gap-2 px-3 py-1.5 text-xs {severityClasses[
			severity
		]} {className}"
		role="banner"
	>
		<ResolvedIcon class="h-4 w-4 shrink-0" />
		<span class="flex-1 truncate">{message}</span>
		{#if actions}
			<div class="flex items-center gap-2">
				{@render actions()}
			</div>
		{/if}
		{#if closeable}
			<button
				class="m-0 shrink-0 cursor-pointer rounded border-none bg-transparent p-0.5 text-current hover:bg-white/10"
				onclick={onclose}
				aria-label="Close banner"
			>
				<X class="h-3.5 w-3.5" />
			</button>
		{/if}
	</div>
{/if}
