<script lang="ts">
	import { cn } from '../../utils';

	let {
		src,
		alt,
		title,
		description,
		class: className = ''
	}: {
		src: string;
		alt: string;
		title: string;
		description: string;
		class?: string;
	} = $props();
</script>

<div
	class={cn(
		'group relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-100 shadow-lg dark:bg-zinc-800',
		className
	)}
>
	<img
		{src}
		{alt}
		class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
	/>

	<div
		class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90"
	></div>

	<div class="absolute inset-0 flex flex-col justify-end p-6">
		<h3
			class="mb-1 transform text-xl font-bold tracking-tight text-white transition-transform duration-300 group-hover:-translate-y-1"
		>
			{title}
		</h3>
		<p
			class="translate-y-4 transform text-sm text-zinc-300 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
		>
			{description}
		</p>
	</div>
</div>
