<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { IconComponent } from '../../types';
	import { cn } from '../../utils';

	let {
		children,
		description,
		variant = 'primary',
		type = 'button',
		block = false,
		disabled = false,
		icon: Icon,
		iconSpin = false,
		iconAfter: IconAfter,
		iconAfterSpin = false,
		iconOnly = false,
		dropdown = false,
		dropdownOpen = $bindable(false),
		onclick,
		ondropdown,
		class: className,
		...rest
	}: {
		children?: Snippet;
		description?: Snippet;
		variant?: 'primary' | 'secondary';
		type?: 'button' | 'submit' | 'reset';
		block?: boolean;
		disabled?: boolean;
		icon?: IconComponent;
		iconSpin?: boolean;
		iconAfter?: IconComponent;
		iconAfterSpin?: boolean;
		iconOnly?: boolean;
		dropdown?: boolean;
		dropdownOpen?: boolean;
		onclick?: (event: MouseEvent) => void;
		ondropdown?: (event: MouseEvent) => void;
		class?: string;
		[key: string]: unknown;
	} = $props();

	const variantClasses = {
		primary:
			'bg-button-bg text-button-fg border-button-border hover:bg-button-hover-bg focus:outline focus:outline-1 focus:outline-ring focus:outline-offset-2',
		secondary:
			'bg-button-secondary-bg text-button-secondary-fg border-button-border hover:bg-button-secondary-hover-bg focus:outline focus:outline-1 focus:outline-ring focus:outline-offset-2'
	};

	function handleDropdownClick(e: MouseEvent) {
		e.stopPropagation();
		dropdownOpen = !dropdownOpen;
		ondropdown?.(e);
	}
</script>

{#if dropdown}
	<!-- Split button: main action + dropdown arrow -->
	<div class={cn('inline-flex items-stretch', block && 'w-full', className)}>
		<button
			{type}
			{disabled}
			{onclick}
			class={cn(
				'btn-base group relative box-border flex items-center justify-center overflow-hidden rounded-l-[2px] border border-r-0 whitespace-nowrap transition-colors select-none',
				'font-sans text-[13px] leading-[22px]',
				block ? 'flex-1' : 'w-auto',
				!children || iconOnly ? 'min-h-[24px] min-w-[26px] p-[1px_4px]' : 'px-[13px] py-px',
				variantClasses[variant],
				disabled && 'pointer-events-none cursor-not-allowed opacity-40',
				!disabled && 'cursor-pointer'
			)}
			{...rest}
		>
			{#if Icon}
				<span
					class={cn(
						'flex shrink-0',
						children && !iconOnly && 'mr-[3px]',
						iconSpin && 'animate-spin'
					)}
				>
					<Icon size={14} />
				</span>
			{/if}
			<span class="flex flex-col items-start">
				{@render children?.()}
				{#if description}
					<span class="text-[11px] leading-tight opacity-70">
						{@render description()}
					</span>
				{/if}
			</span>
			{#if IconAfter}
				<span
					class={cn(
						'flex shrink-0',
						children && !iconOnly && 'ml-[3px]',
						iconAfterSpin && 'animate-spin'
					)}
				>
					<IconAfter size={14} />
				</span>
			{/if}
		</button>
		<button
			type="button"
			aria-label="Toggle dropdown"
			{disabled}
			onclick={handleDropdownClick}
			class={cn(
				'box-border flex items-center justify-center rounded-r-[2px] border px-[4px] transition-colors',
				variantClasses[variant],
				disabled && 'pointer-events-none cursor-not-allowed opacity-40',
				!disabled && 'cursor-pointer'
			)}
		>
			<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
				<path d="M4.2 6.1L8 10L11.8 6.1L11 5.4L8 8.6L5 5.4L4.2 6.1Z" fill="currentColor" />
			</svg>
		</button>
	</div>
{:else}
	<!-- Standard button -->
	<button
		{type}
		{disabled}
		{onclick}
		class={cn(
			'btn-base group relative box-border flex items-center justify-center overflow-hidden rounded-[2px] border whitespace-nowrap transition-colors select-none',
			'font-sans text-[13px] leading-[22px]',
			block ? 'w-full flex-1 text-center' : 'w-auto',
			!children || iconOnly ? 'min-h-[24px] min-w-[26px] p-[1px_4px]' : 'px-[13px] py-px',
			variantClasses[variant],
			disabled &&
				'pointer-events-none cursor-not-allowed opacity-40 hover:bg-inherit hover:focus:bg-inherit',
			!disabled && 'cursor-pointer',
			className
		)}
		{...rest}
	>
		{#if Icon}
			<span
				class={cn('flex shrink-0', children && !iconOnly && 'mr-[3px]', iconSpin && 'animate-spin')}
			>
				<Icon size={14} />
			</span>
		{/if}
		<span class="flex flex-col items-start">
			{@render children?.()}
			{#if description}
				<span class="text-[11px] leading-tight opacity-70">
					{@render description()}
				</span>
			{/if}
		</span>
		{#if IconAfter}
			<span
				class={cn(
					'flex shrink-0',
					children && !iconOnly && 'ml-[3px]',
					iconAfterSpin && 'animate-spin'
				)}
			>
				<IconAfter size={14} />
			</span>
		{/if}
	</button>
{/if}
