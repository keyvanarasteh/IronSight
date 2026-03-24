<script lang="ts">
	import type { Snippet } from 'svelte';
	import { X, Bell } from 'lucide-svelte';

	let {
		visible = false,
		title = 'Notifications',
		count = 0,
		onclose,
		onclearall,
		children,
		class: className = ''
	}: {
		visible?: boolean;
		title?: string;
		count?: number;
		onclose?: () => void;
		onclearall?: () => void;
		children?: Snippet;
		class?: string;
	} = $props();
</script>

{#if visible}
	<div
		class="bg-notification-center-bg border-notification-center-border flex max-h-[400px] w-[380px] flex-col overflow-hidden rounded-lg border shadow-xl {className}"
		role="region"
		aria-label={title}
	>
		<!-- Header -->
		<div
			class="border-notification-center-border flex items-center justify-between border-b px-3 py-2"
		>
			<div class="text-notification-center-fg flex items-center gap-2 text-xs font-semibold">
				<Bell class="h-3.5 w-3.5" />
				<span>{title}</span>
				{#if count > 0}
					<span
						class="bg-badge-bg text-badge-fg rounded-full px-1.5 py-0.5 text-[10px] leading-none"
						>{count}</span
					>
				{/if}
			</div>
			<div class="flex items-center gap-1">
				{#if onclearall}
					<button
						class="text-notification-center-fg m-0 cursor-pointer rounded border-none bg-transparent px-1.5 py-0.5 text-[10px] hover:bg-white/10"
						onclick={onclearall}
					>
						Clear All
					</button>
				{/if}
				{#if onclose}
					<button
						class="text-notification-center-fg m-0 cursor-pointer rounded border-none bg-transparent p-0.5 hover:bg-white/10"
						onclick={onclose}
						aria-label="Close notifications"
					>
						<X class="h-3.5 w-3.5" />
					</button>
				{/if}
			</div>
		</div>

		<!-- Notification List -->
		<div class="flex-1 overflow-y-auto">
			{#if children}
				{@render children()}
			{:else}
				<div
					class="text-notification-center-fg flex h-20 items-center justify-center text-xs opacity-50"
				>
					No new notifications
				</div>
			{/if}
		</div>
	</div>
{/if}
