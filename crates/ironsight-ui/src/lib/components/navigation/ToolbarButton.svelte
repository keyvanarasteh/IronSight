<script lang="ts">
	import { cn } from '../../utils';
	import type { Snippet } from 'svelte';
	import Icon from '../basic-inputs/Icon.svelte';

	let {
		children,
		icon = '',
		label,
		title, // To provide standard title attribute
		toggleable = false,
		checked = $bindable(false),
		class: className,
		onchange,
		onclick,
		...rest
	}: {
		children?: Snippet;
		icon?: string;
		label?: string;
		title?: string;
		toggleable?: boolean;
		checked?: boolean;
		class?: string;
		onchange?: (checked: boolean) => void;
		onclick?: (e: MouseEvent) => void;
		[key: string]: unknown;
	} = $props();

	let isSlotEmpty = $derived(!children);

	function handleClick(e: MouseEvent) {
		if (toggleable) {
			checked = !checked;
			onchange?.(checked);
		}
		onclick?.(e);
	}
</script>

<button
	type="button"
	aria-label={label}
	{title}
	role={toggleable ? 'switch' : undefined}
	aria-checked={toggleable ? checked : undefined}
	class={cn(
		'text-foreground focus-visible:outline-primary hover:bg-hover-overlay active:bg-active-overlay inline-flex cursor-pointer items-center justify-center rounded-[5px] border-0 bg-transparent p-0 outline-1 -outline-offset-[1px] outline-none select-none hover:outline-transparent hover:outline-dashed focus-visible:outline-solid',
		toggleable && checked
			? 'bg-toggle-active outline-toggle-border text-foreground-bright outline-solid'
			: '',
		className
	)}
	onclick={handleClick}
	{...rest}
>
	{#if icon}
		<Icon
			name={icon}
			class={cn('block p-[3px]', toggleable && checked ? 'text-foreground-bright' : '')}
		/>
	{/if}
	{#if children}
		<span class={cn('flex h-[22px] items-center', icon ? 'pr-[5px] pl-[2px]' : 'px-[5px]')}>
			{@render children()}
		</span>
	{/if}
</button>
