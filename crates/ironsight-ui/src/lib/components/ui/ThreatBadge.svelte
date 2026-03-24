<script lang="ts">
	import { cn } from '../../utils';

	let {
		level,
		class: className = ''
	}: {
		level: 'Clean' | 'Low' | 'Medium' | 'High' | 'Critical';
		class?: string;
	} = $props();

	let badgeStyle = $derived.by(() => {
		switch (level) {
			case 'Clean':
				return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30';
			case 'Low':
				return 'bg-blue-500/15 text-blue-500 border-blue-500/30';
			case 'Medium':
				return 'bg-amber-500/15 text-amber-500 border-amber-500/30';
			case 'High':
				return 'bg-orange-500/15 text-orange-500 border-orange-500/30';
			case 'Critical':
				return 'bg-red-500/15 text-red-500 border-red-500/30';
			default:
				return 'bg-zinc-500/15 text-zinc-500 border-zinc-500/30';
		}
	});

	let dotStyle = $derived.by(() => {
		switch (level) {
			case 'Clean':
				return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
			case 'Low':
				return 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]';
			case 'Medium':
				return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]';
			case 'High':
				return 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]';
			case 'Critical':
				return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse';
			default:
				return 'bg-zinc-500';
		}
	});
</script>

<div
	class={cn(
		'inline-flex items-center justify-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider',
		badgeStyle,
		className
	)}
>
	<span class={cn('h-1.5 w-1.5 rounded-full', dotStyle)}></span>
	{level}
</div>
