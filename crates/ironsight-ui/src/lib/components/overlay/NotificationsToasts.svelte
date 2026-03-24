<script lang="ts">
	import type { Snippet } from 'svelte';

	type ToastPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

	let {
		position = 'bottom-right' as ToastPosition,
		maxVisible = 3,
		children,
		class: className = ''
	}: {
		position?: ToastPosition;
		maxVisible?: number;
		children?: Snippet;
		class?: string;
	} = $props();

	const positionClasses: Record<ToastPosition, string> = {
		'bottom-right': 'bottom-4 right-4',
		'bottom-left': 'bottom-4 left-4',
		'top-right': 'top-4 right-4',
		'top-left': 'top-4 left-4'
	};
</script>

<div
	class="pointer-events-none fixed z-100 flex w-[380px] flex-col gap-2 {positionClasses[
		position
	]} {className}"
	role="log"
	aria-live="polite"
	aria-label="Notifications"
>
	<div
		class="pointer-events-auto flex flex-col gap-2"
		style="max-height: calc({maxVisible} * 120px); overflow: hidden;"
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>
