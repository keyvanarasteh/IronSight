<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	type $$Props = HTMLAttributes<HTMLTableRowElement>;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<tr
	class={cn(
		'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
		className
	)}
	{...$$restProps}
>
	<slot />
</tr>
