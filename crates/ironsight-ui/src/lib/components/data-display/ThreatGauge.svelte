<script lang="ts">
	import { cn } from '../../utils';

	let {
		score,
		level,
		size = 'md',
		class: className = ''
	}: {
		score: number;
		level: 'Clean' | 'Low' | 'Medium' | 'High' | 'Critical';
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	} = $props();

	// SVG specific dimensions based on size
	let dim = $derived(size === 'sm' ? 64 : size === 'lg' ? 160 : 120);
	let strokeW = $derived(size === 'sm' ? 4 : size === 'lg' ? 10 : 8);
	let radius = $derived((dim - strokeW) / 2);
	let circumference = $derived(2 * Math.PI * radius);
	
	// Semi-circle (gauge style)
	let dashArc = $derived((circumference * 2) / 3);
	let dashOffset = $derived(dashArc - (score / 100) * dashArc);

	let gaugeColor = $derived.by(() => {
		switch (level) {
			case 'Clean':
				return 'stroke-emerald-500';
			case 'Low':
				return 'stroke-blue-500';
			case 'Medium':
				return 'stroke-amber-500';
			case 'High':
				return 'stroke-orange-500';
			case 'Critical':
				return 'stroke-red-500';
			default:
				return 'stroke-zinc-500';
		}
	});
</script>

<div class={cn('relative flex flex-col items-center justify-center', className)}>
	<svg
		width={dim}
		height={dim}
		viewBox="0 0 {dim} {dim}"
		class="rotate-[150deg] transform"
	>
		<!-- Background track -->
		<circle
			cx={dim / 2}
			cy={dim / 2}
			r={radius}
			fill="none"
			stroke="currentColor"
			stroke-width={strokeW}
			class="stroke-zinc-200 dark:stroke-zinc-800"
			stroke-dasharray="{dashArc} {circumference}"
			stroke-linecap="round"
		/>
		<!-- Foreground value -->
		<circle
			cx={dim / 2}
			cy={dim / 2}
			r={radius}
			fill="none"
			stroke-width={strokeW}
			class={cn('transition-all duration-1000 ease-out', gaugeColor)}
			stroke-dasharray="{dashArc} {circumference}"
			stroke-dashoffset={dashOffset}
			stroke-linecap="round"
		/>
	</svg>
	
	<div class="absolute inset-0 flex flex-col items-center justify-center pt-2">
		<span class={cn(
			'font-bold tracking-tighter text-foreground',
			size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-5xl' : 'text-3xl'
		)}>
			{score}
		</span>
		{#if size !== 'sm'}
			<span class={cn(
				'font-semibold uppercase tracking-widest text-muted-foreground',
				size === 'lg' ? 'text-sm' : 'text-[10px]'
			)}>
				{level}
			</span>
		{/if}
	</div>
</div>
