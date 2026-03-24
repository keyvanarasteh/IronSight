<script lang="ts">
	import type { ComponentType, SvelteComponent, Component, Snippet } from 'svelte';
	import { ChevronDown, ChevronRight } from 'lucide-svelte';

	let {
		title = '',
		icon: PaneIcon,
		expanded = $bindable(true),
		collapsible = true,
		headerActions,
		filter,
		children,
		class: className = ''
	}: {
		title?: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		icon?: ComponentType<SvelteComponent> | Component<any>;
		expanded?: boolean;
		collapsible?: boolean;
		headerActions?: Snippet;
		filter?: Snippet;
		children?: Snippet;
		class?: string;
	} = $props();
</script>

<div class="border-border flex flex-col border-b {className}" role="region" aria-label={title}>
	<!-- Header -->
	<div
		class="text-foreground flex h-[22px] shrink-0 items-center px-1 text-[11px] font-semibold tracking-wider uppercase select-none"
	>
		{#if collapsible}
			<button
				class="hover:bg-hover-overlay m-0 flex h-full min-w-0 flex-1 cursor-pointer items-center gap-1 border-none bg-transparent p-0 text-current"
				onclick={() => (expanded = !expanded)}
				aria-expanded={expanded}
			>
				{#if expanded}
					<ChevronDown class="h-3.5 w-3.5 shrink-0" />
				{:else}
					<ChevronRight class="h-3.5 w-3.5 shrink-0" />
				{/if}
				{#if PaneIcon}
					<PaneIcon class="h-3.5 w-3.5 shrink-0 opacity-70" />
				{/if}
				<span class="truncate">{title}</span>
			</button>
		{:else}
			<div class="flex min-w-0 flex-1 items-center gap-1">
				{#if PaneIcon}
					<PaneIcon class="h-3.5 w-3.5 shrink-0 opacity-70" />
				{/if}
				<span class="truncate">{title}</span>
			</div>
		{/if}

		{#if headerActions}
			<div
				class="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100"
			>
				{@render headerActions()}
			</div>
		{/if}
	</div>

	<!-- Filter bar -->
	{#if expanded && filter}
		<div class="px-1 pb-1">
			{@render filter()}
		</div>
	{/if}

	<!-- Body -->
	{#if expanded}
		<div class="flex-1 overflow-y-auto">
			{#if children}
				{@render children()}
			{/if}
		</div>
	{/if}
</div>
