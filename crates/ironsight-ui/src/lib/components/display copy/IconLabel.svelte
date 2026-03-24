<script lang="ts">
	import { cn } from '../../utils';
	import type { Snippet } from 'svelte';
	import type { IconComponent } from '../../types';

	type Decoration = {
		text: string;
		color?: string;
	};

	let {
		children,
		icon: Icon,
		label = '',
		description = '',
		decorations = [],
		suffix,
		class: className,
		...rest
	}: {
		children?: Snippet;
		icon?: IconComponent;
		label?: string;
		description?: string;
		decorations?: Decoration[];
		suffix?: Snippet;
		class?: string;
		[key: string]: unknown;
	} = $props();
</script>

<div
	class={cn('flex min-w-0 items-center gap-[6px] font-sans text-[13px] leading-[22px]', className)}
	{...rest}
>
	{#if Icon}
		<span class="text-icon-fg flex shrink-0">
			<Icon size={16} />
		</span>
	{/if}

	<span class="flex min-w-0 flex-1 items-center gap-[4px]">
		{#if label}
			<span class="text-foreground truncate">{label}</span>
		{/if}
		{#if description}
			<span class="text-description-fg truncate text-[12px]">{description}</span>
		{/if}
		{@render children?.()}
	</span>

	{#if decorations.length > 0}
		<span class="flex shrink-0 items-center gap-[3px]">
			{#each decorations as deco (deco.text)}
				<span
					class="bg-badge-bg text-badge-fg inline-flex items-center rounded-[2px] px-[4px] py-[1px] text-[10px] leading-[14px]"
					style={deco.color ? `background-color: ${deco.color};` : ''}
				>
					{deco.text}
				</span>
			{/each}
		</span>
	{/if}

	{@render suffix?.()}
</div>
