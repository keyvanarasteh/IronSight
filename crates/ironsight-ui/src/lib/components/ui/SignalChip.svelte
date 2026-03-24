<script lang="ts">
	import { cn } from '../../utils';

	let {
		name,
		weight,
		class: className = ''
	}: {
		name: string;
		weight: number;
		class?: string;
	} = $props();

	// Color logic based on weight (higher weight = darker red)
	let chipStyle = $derived.by(() => {
		if (weight >= 50) return 'bg-red-500/15 text-red-500 border-red-500/30';
		if (weight >= 25) return 'bg-orange-500/15 text-orange-500 border-orange-500/30';
		if (weight > 0) return 'bg-amber-500/15 text-amber-500 border-amber-500/30';
		return 'bg-zinc-500/15 text-zinc-500 border-zinc-500/30';
	});
</script>

<div
	class={cn(
		'inline-flex items-center justify-between gap-2 border px-2 py-0.5 text-xs font-mono rounded',
		chipStyle,
		className
	)}
>
	<span class="truncate">{name}</span>
	<span class="font-bold opacity-80">{weight}</span>
</div>
