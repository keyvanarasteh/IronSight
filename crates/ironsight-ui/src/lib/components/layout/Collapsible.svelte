<script lang="ts">
	import { cn } from '../../utils';
	import type { Snippet } from 'svelte';

	let {
		children,
		actions,
		decorations,
		heading = '',
		description = '',
		open = $bindable(false),
		alwaysShowHeaderActions = false,
		class: className,
		...rest
	}: {
		children?: Snippet;
		actions?: Snippet;
		decorations?: Snippet;
		heading?: string;
		description?: string;
		open?: boolean;
		alwaysShowHeaderActions?: boolean;
		class?: string;
		[key: string]: unknown;
	} = $props();

	function toggle() {
		open = !open;
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			toggle();
		}
	}
</script>

<div class={cn('bg-background-panel group block', className)} {...rest}>
	<!-- Header -->

	<header
		role="button"
		tabindex="0"
		class={cn(
			'bg-background-panel flex h-[22px] cursor-pointer items-center leading-[22px] select-none',
			'focus:outline-primary focus:opacity-100 focus:outline-1 focus:-outline-offset-1 focus:outline-solid'
		)}
		onclick={toggle}
		onkeydown={handleKeyDown}
		aria-expanded={open}
	>
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			xmlns="http://www.w3.org/2000/svg"
			fill="currentColor"
			class={cn(
				'text-foreground mx-[3px] shrink-0 transition-transform duration-100',
				open && 'rotate-90'
			)}
		>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M10.072 8.024L5.715 3.667l.618-.62L11 7.716v.618L6.333 13l-.618-.619 4.357-4.357z"
			/>
		</svg>

		<h3
			class="text-foreground m-0 overflow-hidden text-[11px] font-bold text-ellipsis whitespace-nowrap uppercase"
		>
			{heading}
			{#if description}
				<span class="ml-[10px] font-normal normal-case opacity-60">{description}</span>
			{/if}
		</h3>

		<div class="mr-[4px] ml-auto flex h-[22px] items-center">
			{#if actions}
				<!-- actions container -->
				<div
					class={cn(
						'flex max-h-[22px] items-center overflow-hidden',
						!alwaysShowHeaderActions && 'hidden group-hover:flex',
						alwaysShowHeaderActions && 'flex',
						!open && 'hidden group-hover:hidden' // actions only visible when open
					)}
					onclick={(e) => e.stopPropagation()}
					onkeydown={(e) => e.stopPropagation()}
					role="toolbar"
					tabindex="-1"
				>
					{@render actions()}
				</div>
			{/if}

			{#if decorations}
				<div
					class="flex max-h-[22px] items-center overflow-hidden"
					onclick={(e) => e.stopPropagation()}
					onkeydown={(e) => e.stopPropagation()}
					role="presentation"
				>
					{@render decorations()}
				</div>
			{/if}
		</div>
	</header>

	<!-- Body -->
	{#if open}
		<div class="block overflow-hidden">
			{@render children?.()}
		</div>
	{/if}
</div>
