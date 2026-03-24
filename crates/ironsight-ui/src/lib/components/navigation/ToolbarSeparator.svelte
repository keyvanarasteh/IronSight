<script lang="ts">
	import { cn } from '../../utils';

	let {
		class: className,
		...rest
	}: {
		class?: string;
		[key: string]: unknown;
	} = $props();
</script>

<div
	class={cn('bg-border mx-[2px] h-[16px] w-[1px] self-center', className)}
	role="separator"
	{...rest}
></div>
