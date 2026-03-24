<script lang="ts">
	import type { IconComponent } from '../../types';

	let {
		icon: Icon,
		label
	}: {
		icon?: IconComponent;
		label: string;
	} = $props();
</script>

<div
	class="hover:bg-statusbar-item-hover hover:text-statusbar-item-hover-fg flex h-full cursor-pointer items-center gap-1 px-2 text-[10px] text-inherit md:text-[11px]"
>
	{#if Icon}
		<Icon class="h-3 w-3" />
	{/if}
	<span class="max-w-[80px] truncate md:max-w-none">{label}</span>
</div>
