<script lang="ts">
	let {
		label,
		count,
		active = false,
		onclick
	}: {
		label: string;
		count?: number | undefined;
		active?: boolean;
		onclick?: () => void;
	} = $props();
</script>

<button
	{onclick}
	class="relative m-0 flex h-full cursor-pointer items-center gap-1.5 border-none bg-transparent px-0.5 whitespace-nowrap
	{active
		? 'text-foreground border-foreground border-b'
		: 'text-foreground opacity-50 hover:opacity-100'}"
>
	{label}
	{#if count !== undefined}
		<span class="bg-muted rounded-full px-1.5 text-[9px]">{count}</span>
	{/if}
</button>
