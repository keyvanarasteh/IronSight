<script lang="ts">
	import { cn } from '../../utils';
	import type { Snippet } from 'svelte';

	let {
		children,
		shadow = true,
		class: className,
		...rest
	}: {
		children?: Snippet;
		shadow?: boolean;
		class?: string;
		[key: string]: unknown;
	} = $props();

	let containerNode: HTMLDivElement | undefined = $state();
	let scrolled = $state(false);

	function handleScroll() {
		if (containerNode) {
			scrolled = containerNode.scrollTop > 0;
		}
	}
</script>

<div class={cn('relative block h-full w-full overflow-hidden', className)} {...rest}>
	{#if shadow}
		<div
			class={cn(
				'pointer-events-none absolute top-0 left-0 z-[1] h-[3px] w-full transition-opacity duration-200',
				scrolled ? 'opacity-100' : 'opacity-0'
			)}
			style="box-shadow: #000000 0 6px 6px -6px inset;"
		></div>
	{/if}

	<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
	<div
		bind:this={containerNode}
		onscroll={handleScroll}
		onkeydown={() => {}}
		class="vscode-scrollable-container h-full w-full overflow-auto"
		tabindex="0"
		role="region"
		aria-label={rest['aria-label']?.toString() || 'Scrollable content'}
	>
		<div class="overflow-hidden">
			{@render children?.()}
		</div>
	</div>
</div>

<style>
	/* Webkit custom scrollbars targeting the container */
	.vscode-scrollable-container::-webkit-scrollbar {
		width: 10px;
		height: 10px;
	}

	.vscode-scrollable-container::-webkit-scrollbar-track {
		background: transparent;
	}

	.vscode-scrollable-container::-webkit-scrollbar-thumb {
		background-color: transparent;
		min-height: 20px;
	}

	.vscode-scrollable-container:hover::-webkit-scrollbar-thumb {
		background-color: var(--scrollbar);
	}

	.vscode-scrollable-container::-webkit-scrollbar-thumb:hover {
		background-color: var(--scrollbar-active);
	}

	.vscode-scrollable-container::-webkit-scrollbar-thumb:active {
		background-color: var(--scrollbar-hover);
	}

	/* Firefox fallback */
	.vscode-scrollable-container {
		scrollbar-width: thin;
		scrollbar-color: var(--scrollbar) transparent;
	}
</style>
