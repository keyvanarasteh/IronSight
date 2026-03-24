<script lang="ts">
	import { cn } from '$lib/utils/cn.js';

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<div class={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...$$restProps}>
	<slot />
</div>
