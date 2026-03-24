<script lang="ts">
	import { cn } from '../../utils';

	let {
		role = 'separator',
		class: className,
		...rest
	}: {
		role?: 'separator' | 'presentation';
		class?: string;
		[key: string]: unknown;
	} = $props();
</script>

<div {role} class={cn('my-[10px] block', className)} {...rest}>
	<div class="bg-border h-[1px] w-full"></div>
</div>
