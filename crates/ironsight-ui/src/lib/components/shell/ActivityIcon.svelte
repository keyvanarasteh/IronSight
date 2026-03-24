<script lang="ts">
	import type { IconComponent } from '../../types';

	let {
		icon: Icon,
		active = false,
		tooltip,
		onclick
	}: {
		icon: IconComponent;
		active?: boolean;
		tooltip?: string;
		onclick?: () => void;
	} = $props();
</script>

<button
	{onclick}
	title={tooltip}
	class="relative m-0 flex h-12 w-full cursor-pointer items-center justify-center border-none bg-transparent p-0 transition-all
	{active
		? 'text-activitybar-fg opacity-100'
		: 'text-activitybar-inactive-fg hover:text-activitybar-fg opacity-80 hover:opacity-100'}"
>
	{#if active}
		<div class="bg-activitybar-active-border absolute left-0 h-full w-[2px]"></div>
	{/if}
	<Icon size={24} strokeWidth={1.5} />
</button>
