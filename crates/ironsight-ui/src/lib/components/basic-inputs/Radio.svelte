<script lang="ts">
	import { cn } from '../../utils';
	import type { Snippet } from 'svelte';

	let {
		children,
		checked = false,
		disabled = false,
		invalid = false,
		required = false,
		value = '',
		name,
		onchange,
		class: className,
		...rest
	}: {
		children?: Snippet;
		checked?: boolean;
		disabled?: boolean;
		invalid?: boolean;
		required?: boolean;
		value?: string | number;
		name?: string;
		onchange?: (event: Event) => void;
		class?: string;
		[key: string]: unknown;
	} = $props();

	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		checked = target.checked;
		if (onchange) {
			onchange(event);
		}
	}
</script>

<div
	class={cn(
		'inline-flex min-h-[20px] cursor-pointer items-center',
		disabled && 'pointer-events-none cursor-default opacity-40',
		className
	)}
>
	<label class="group relative flex h-full w-full cursor-pointer items-center">
		<input
			type="radio"
			{name}
			{value}
			{disabled}
			{required}
			class="peer sr-only"
			{checked}
			onchange={handleChange}
			{...rest}
		/>

		<!-- Radio Indicator -->
		<div
			class={cn(
				'bg-background-elevated border-border box-border flex h-[16px] w-[16px] items-center justify-center rounded-full border',
				invalid && 'bg-destructive-bg border-destructive',
				'group-hover:border-primary',
				'peer-focus:outline-primary peer-focus:outline peer-focus:outline-1 peer-focus:outline-offset-[1px]',
				'text-foreground'
			)}
		>
			<span
				class={cn(
					'block h-[8px] w-[8px] rounded-full transition-transform duration-100 ease-in-out',
					checked ? 'bg-foreground scale-100' : 'scale-0 bg-transparent',
					invalid && checked && 'bg-foreground'
				)}
			></span>
		</div>

		{#if children}
			<!-- Label Content -->
			<span class="pl-[8px] text-center font-sans text-[13px] leading-[20px] select-none">
				{@render children()}
			</span>
		{/if}
	</label>
</div>
