<script lang="ts">
	import { Bell } from 'lucide-svelte';

	let {
		count = 0,
		onclick,
		class: className = ''
	}: {
		count?: number;
		onclick?: () => void;
		class?: string;
	} = $props();
</script>

<button
	class="relative m-0 inline-flex cursor-pointer items-center rounded border-none bg-transparent p-1 text-current hover:bg-white/10 {className}"
	{onclick}
	aria-label="Notifications{count > 0 ? ` (${count} new)` : ''}"
>
	<Bell class="text-statusbar-fg h-3.5 w-3.5" />
	{#if count > 0}
		<span
			class="bg-badge-bg text-badge-fg absolute -top-0.5 -right-0.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full px-1 text-[9px] leading-none font-bold"
		>
			{count > 99 ? '99+' : count}
		</span>
	{/if}
</button>
