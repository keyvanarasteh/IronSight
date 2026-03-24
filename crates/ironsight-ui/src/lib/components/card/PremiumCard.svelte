<script lang="ts">
	import { cn } from '../../utils';
	import { resolve } from '$app/paths';

	let {
		variant = '1',
		title = 'The Godfather',
		description = 'A man who doesn’t spend time with his family can never be a real man.',
		image,
		buttonText = 'Svelte Components',
		href = '/',
		class: className = ''
	}: {
		variant?: '1' | '2' | '3' | '4';
		title?: string;
		description?: string;
		image?: string;
		buttonText?: string;
		href?: string;
		class?: string;
	} = $props();

	const images = {
		'1': 'https://i.pinimg.com/564x/e7/e4/a2/e7e4a2bc3409fc3e18fcd2c4c0792cc2.jpg',
		'2': 'https://i.pinimg.com/564x/e2/3c/fb/e23cfb960318ded88fde45ad4601c4d8.jpg',
		'3': 'https://i.pinimg.com/564x/78/43/6d/78436dfe6edfea96f451285557605d9f.jpg',
		'4': 'https://i.pinimg.com/564x/4c/91/3c/4c913ce774559e1eaad5c302b74a1d2e.jpg'
	};

	let displayImage = $derived(image || images[variant] || images['1']);
</script>

{#if variant === '1'}
	<div
		class={cn(
			'group relative mx-auto aspect-[4/3] w-full max-w-sm overflow-hidden rounded-2xl',
			className
		)}
	>
		<img
			src={displayImage}
			alt={title}
			class="m-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
		/>
		<!-- Overlay -->
		<div
			class="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/60 to-stone-900/5 backdrop-blur-[2px] transition-all duration-300"
		></div>
		<!-- Content -->
		<div
			class="absolute inset-x-0 bottom-0 flex size-full flex-col justify-end px-6 pb-4 text-left text-gray-100"
		>
			<h3 class="mt-3 mb-1 text-xl font-bold tracking-tighter">{title}</h3>
			<p class="text-sm leading-5 opacity-90">{description}</p>
		</div>
	</div>
{:else if variant === '2'}
	<div
		class={cn(
			'group relative mx-auto aspect-[4/3] w-full max-w-sm overflow-hidden rounded-2xl',
			className
		)}
	>
		<img
			src={displayImage}
			alt={title}
			class="m-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
		/>
		<!-- Overlay -->
		<div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/10"></div>
		<!-- Content -->
		<div
			class="absolute inset-x-0 bottom-0 flex size-full flex-col justify-end px-6 pb-4 text-left text-gray-100"
		>
			<h3 class="mt-3 mb-1 text-xl font-bold tracking-tighter">{title}</h3>
			<p class="text-sm leading-5 opacity-90">{description}</p>
		</div>
	</div>
{:else if variant === '3'}
	<div
		class={cn(
			'group relative mx-auto aspect-[4/3] w-full max-w-sm overflow-hidden rounded-2xl',
			className
		)}
	>
		<img
			src={displayImage}
			alt={title}
			class="m-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
		/>
		<!-- Overlay -->
		<div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/10"></div>
		<!-- Blurry Content Badge -->
		<div
			class="absolute inset-x-0 bottom-2 mx-2 mb-2 flex flex-col justify-end rounded-2xl bg-gray-600/25 px-4 pb-2 text-left text-gray-100 backdrop-blur-lg sm:pb-2"
		>
			<h3 class="mt-3 mb-1 text-lg font-bold tracking-tighter">{title}</h3>
			<p class="mb-1 text-sm leading-5 opacity-90">{description}</p>
		</div>
	</div>
{:else if variant === '4'}
	<div
		class={cn(
			'z-20 mx-auto w-full max-w-sm overflow-hidden rounded-xl border bg-zinc-50 p-2.5 pb-3 dark:bg-zinc-950',
			className
		)}
	>
		<div class="relative h-[266px] w-full overflow-hidden rounded-xl">
			<img
				src={displayImage}
				alt={title}
				class="h-full w-full rounded-xl object-cover shadow-[0px_0px_10px_#A1A1AA] transition-transform duration-500 hover:scale-105 dark:shadow-[0px_0px_12px_rgb(39,39,42,0.7)]"
			/>
		</div>
		<div class="mt-3 px-2 text-left text-gray-800 dark:text-gray-200">
			<h3 class="mb-1 text-lg font-bold tracking-tighter">{title}</h3>
			<p class="mb-4 text-sm leading-5 opacity-80">{description}</p>
		</div>
		<div class="px-2">
			<a
				href={resolve(href, {})}
				class="bg-foreground text-background hover:bg-foreground/90 block w-full rounded-lg py-2 text-center text-sm font-medium transition-colors"
				>{buttonText}</a
			>
		</div>
	</div>
{/if}
