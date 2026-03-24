<script lang="ts">
	import { cn } from '../../utils';

	let { class: className = '' } = $props();
</script>

<div
	class={cn(
		'mx-auto w-full max-w-[270px] animate-pulse rounded-md border p-4 shadow-sm',
		className
	)}
	aria-hidden="true"
>
	<div class="mb-4 h-36 w-full rounded-sm bg-zinc-200 dark:bg-zinc-800"></div>

	<div class="space-y-2">
		<div class="h-4 w-[60%] rounded bg-zinc-200 dark:bg-zinc-800"></div>
		<div class="h-4 w-[90%] rounded bg-zinc-200 dark:bg-zinc-800"></div>
		<div class="h-4 w-[90%] rounded bg-zinc-200 dark:bg-zinc-800"></div>
		<div class="h-4 w-[40%] rounded bg-zinc-200 dark:bg-zinc-800"></div>
	</div>
</div>
