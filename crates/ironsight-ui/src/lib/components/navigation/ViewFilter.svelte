<script lang="ts">
	import { Search, X, Filter } from 'lucide-svelte';

	let {
		value = $bindable(''),
		placeholder = 'Filter...',
		showFilterButton = false,
		filterActive = $bindable(false),
		onfilter,
		class: className = ''
	}: {
		value?: string;
		placeholder?: string;
		showFilterButton?: boolean;
		filterActive?: boolean;
		onfilter?: () => void;
		class?: string;
	} = $props();
</script>

<div
	class="bg-input-bg border-input-border flex h-7 items-center gap-1 rounded border px-1 text-xs {className}"
	role="search"
>
	<Search class="h-3.5 w-3.5 shrink-0 opacity-50" />
	<input
		type="text"
		bind:value
		{placeholder}
		class="text-input-fg placeholder:text-foreground/30 m-0 min-w-0 flex-1 border-none bg-transparent p-0 text-xs outline-none"
	/>
	{#if value}
		<button
			class="m-0 shrink-0 cursor-pointer rounded border-none bg-transparent p-0.5 text-current hover:bg-white/10"
			onclick={() => (value = '')}
			aria-label="Clear filter"
		>
			<X class="h-3 w-3" />
		</button>
	{/if}
	{#if showFilterButton}
		<button
			class="m-0 shrink-0 cursor-pointer rounded border-none bg-transparent p-0.5 text-current {filterActive
				? 'bg-focusborder/20 text-focusborder'
				: 'hover:bg-white/10'}"
			onclick={onfilter}
			aria-label="Toggle filter"
			aria-pressed={filterActive}
		>
			<Filter class="h-3 w-3" />
		</button>
	{/if}
</div>
