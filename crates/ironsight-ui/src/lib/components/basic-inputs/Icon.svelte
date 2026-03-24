<script lang="ts">
	import { cn } from '../../utils';

	let {
		name = '',
		label = '',
		size = 16,
		spin = false,
		spinDuration = 1.5,
		actionIcon = false,
		class: className,
		...rest
	}: {
		name?: string;
		label?: string;
		size?: number;
		spin?: boolean;
		spinDuration?: number;
		actionIcon?: boolean;
		class?: string;
		[key: string]: unknown;
	} = $props();
</script>

{#snippet IconContent()}
	<span
		class={cn('codicon block', `codicon-${name}`, spin && 'animate-icon-spin')}
		style="font-size: {size}px; width: {size}px; height: {size}px; {spin
			? `animation-duration: ${spinDuration}s;`
			: ''}"
	></span>
{/snippet}

{#if actionIcon}
	<button
		type="button"
		aria-label={label}
		class={cn(
			'inline-block cursor-pointer rounded-[5px] border border-solid border-transparent bg-transparent p-[2px] text-current',
			'hover:bg-hover-overlay focus-visible:border-primary focus:outline-none',
			className
		)}
		{...rest}
	>
		{@render IconContent()}
	</button>
{:else}
	<span
		class={cn('inline-block bg-transparent p-0', className)}
		aria-hidden="true"
		role="presentation"
		{...rest}
	>
		{@render IconContent()}
	</span>
{/if}

<style>
	@keyframes icon-spin {
		100% {
			transform: rotate(360deg);
		}
	}
	.animate-icon-spin {
		animation-name: icon-spin;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
	}
</style>
