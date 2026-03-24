<script lang="ts">
	import { FileQuestion } from 'lucide-svelte';

	let {
		message = 'This editor could not be opened.',
		detail = '',
		icon: ErrorIcon = FileQuestion,
		class: className = ''
	}: {
		message?: string;
		detail?: string;
		icon?: typeof FileQuestion;
		class?: string;
	} = $props();
</script>

<div
	class="text-foreground/50 flex h-full flex-col items-center justify-center gap-4 p-8 text-center select-none {className}"
	role="alert"
>
	<ErrorIcon class="h-12 w-12 opacity-40" />
	<p class="text-sm font-medium">{message}</p>
	{#if detail}
		<p class="max-w-md text-xs opacity-60">{detail}</p>
	{/if}
</div>
