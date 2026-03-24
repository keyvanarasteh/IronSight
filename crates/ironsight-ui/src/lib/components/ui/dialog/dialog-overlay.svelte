<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils/cn.js';

	type $$Props = DialogPrimitive.OverlayProps;
	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<DialogPrimitive.Overlay
	class={cn(
		'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 bg-background/80 fixed inset-0 z-50 backdrop-blur-sm',
		className
	)}
	{...$$restProps}
/>
