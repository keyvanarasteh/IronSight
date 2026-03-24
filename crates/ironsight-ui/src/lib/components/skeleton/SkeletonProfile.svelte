<script lang="ts">
	import { cn } from '../../utils';

	let { class: className = '' } = $props();
</script>

<div
	class={cn(
		'mx-auto flex w-full max-w-[270px] animate-pulse space-x-4 rounded-lg border p-4 shadow-sm',
		className
	)}
	aria-hidden="true"
>
	<div class="size-11 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>

	<div class="grow space-y-2 py-1">
		<div class="h-4 rounded bg-zinc-200 dark:bg-zinc-800"></div>
		<div class="h-4 w-[70%] rounded bg-zinc-200 dark:bg-zinc-800"></div>
	</div>
</div>
