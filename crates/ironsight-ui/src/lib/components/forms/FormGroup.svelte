<script lang="ts">
	import { cn } from '../../utils';
	import type { Snippet } from 'svelte';

	let {
		children,
		variant = 'horizontal',
		class: className,
		...rest
	}: {
		children?: Snippet;
		variant?: 'horizontal' | 'vertical' | 'settings-group';
		class?: string;
		[key: string]: unknown;
	} = $props();
</script>

<div
	class={cn(
		'block',
		variant === 'settings-group' ? 'm-0 max-w-[727px] px-[14px] py-[12px] pb-[18px]' : 'my-[15px]',
		className
	)}
	{...rest}
>
	<div
		class={cn(
			variant === 'horizontal' ? 'flex flex-wrap' : 'block',
			variant === 'horizontal' && [
				'[&>label]:mr-[14px] [&>label]:block [&>label]:w-[150px] [&>label]:text-right',
				'[&>.vsc-form-helper]:ml-[164px]',
				'[&>button:first-of-type]:ml-[164px]',
				'[&>button]:mr-[4px]'
			],
			variant === 'vertical' && [
				'[&>label]:ml-0 [&>label]:block [&>label]:text-left',
				'[&>.vsc-form-helper]:ml-0 [&>.vsc-form-helper]:block',
				'[&>button]:mr-[4px] [&>button]:ml-0'
			],
			variant === 'settings-group' && [
				'[&>label]:mr-0 [&>label]:mb-[4px] [&>label]:block [&>label]:h-[18px] [&>label]:p-0 [&>label]:text-left [&>label]:leading-[18px]',
				'[&>.vsc-form-helper]:my-0 [&>.vsc-form-helper]:ml-0 [&>.vsc-form-helper]:block',
				'[&>button:first-of-type]:ml-[164px]',
				'[&>button]:mr-[4px]'
			]
		)}
	>
		{@render children?.()}
	</div>
</div>
