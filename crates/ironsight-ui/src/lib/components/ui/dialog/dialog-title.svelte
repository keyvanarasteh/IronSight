<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils/cn.js';

	type $$Props = DialogPrimitive.TitleProps;
	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<DialogPrimitive.Title
	class={cn('text-foreground text-lg leading-none font-semibold tracking-tight', className)}
	{...$$restProps}
>
	<slot />
</DialogPrimitive.Title>
