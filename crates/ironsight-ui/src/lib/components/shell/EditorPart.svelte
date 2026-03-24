<script lang="ts">
	import type { Snippet } from 'svelte';

	type SplitDirection = 'horizontal' | 'vertical';

	let {
		direction = 'horizontal' as SplitDirection,
		children,
		class: className = ''
	}: {
		direction?: SplitDirection;
		children?: Snippet;
		class?: string;
	} = $props();
</script>

<div
	class="flex min-h-0 min-w-0 flex-1 overflow-hidden {direction === 'horizontal'
		? 'flex-row'
		: 'flex-col'} {className}"
	role="region"
	aria-label="Editor area"
>
	{#if children}
		{@render children()}
	{/if}
</div>
