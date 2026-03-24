<script lang="ts">
	import { cn } from '../../utils';
	import type { Snippet } from 'svelte';

	let {
		children,
		checked = $bindable(false),
		indeterminate = false,
		disabled = false,
		invalid = false,
		required = false,
		toggle = false,
		value = '',
		name,
		onchange,
		class: className,
		...rest
	}: {
		children?: Snippet;
		checked?: boolean;
		indeterminate?: boolean;
		disabled?: boolean;
		invalid?: boolean;
		required?: boolean;
		toggle?: boolean;
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
			type="checkbox"
			{name}
			{value}
			{disabled}
			{required}
			class="peer sr-only"
			bind:checked
			onchange={handleChange}
			{...rest}
		/>

		{#if toggle}
			<!-- Toggle Switch Mode -->
			<div
				class={cn(
					'relative box-border flex h-[20px] w-[36px] items-center rounded-full transition-colors',
					'bg-checkbox-bg border-checkbox-border border',
					checked && 'bg-primary-selection border-primary',
					invalid && 'bg-destructive-bg border-destructive',
					'peer-focus:outline-primary peer-focus:outline peer-focus:outline-1 peer-focus:outline-offset-2'
				)}
			>
				<span
					class={cn(
						'bg-foreground ml-[1px] inline-block h-[16px] w-[16px] rounded-full transition-transform duration-120 ease-in-out',
						checked && 'bg-foreground-bright translate-x-[16px] transform',
						invalid && 'bg-destructive'
					)}
				></span>
			</div>
		{:else}
			<!-- Checkbox Mode -->
			<div
				class={cn(
					'bg-checkbox-bg border-checkbox-border box-border flex h-[16px] w-[16px] items-center justify-center rounded-[3px] border',
					(checked || indeterminate) && 'bg-primary border-primary',
					invalid && 'bg-destructive-bg border-destructive',
					'group-hover:border-primary',
					'peer-focus:outline-primary peer-focus:outline peer-focus:outline-1 peer-focus:outline-offset-[-1px]',
					'text-foreground'
				)}
			>
				{#if indeterminate}
					<span class="bg-currentColor absolute h-[1px] w-[12px]"></span>
				{:else if checked}
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						class="h-full w-full"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M14.431 3.323l-8.47 10-.79-.036-3.35-4.77.818-.574 2.978 4.24 8.051-9.506.764.646z"
						/>
					</svg>
				{/if}
			</div>
		{/if}

		{#if children}
			<!-- Label Content -->
			<span
				class={cn(
					'text-center font-sans text-[13px] leading-[20px] select-none',
					toggle ? 'pl-[9px]' : 'pl-[8px]'
				)}
			>
				{@render children()}
			</span>
		{/if}
	</label>
</div>
