<script lang="ts">
	import { getContext, onMount, type Snippet } from 'svelte';
	import { cn } from '../../utils';
	import { SELECT_CONTEXT_KEY } from './Select.svelte';

	let {
		children,
		value,
		label,
		description = '',
		disabled = false,
		class: className,
		...rest
	}: {
		children?: Snippet;
		value: string;
		label?: string;
		description?: string;
		disabled?: boolean;
		class?: string;
		[key: string]: unknown;
	} = $props();

	interface SelectContext {
		multiple: boolean;
		value: string | string[];
		registerOption: (opt: {
			value: string;
			label: string;
			disabled: boolean;
		}) => (() => void) | undefined;
		close: () => void;
	}

	const selectContext = getContext<SelectContext>(SELECT_CONTEXT_KEY);

	let rootNode: HTMLLIElement | undefined = $state();
	let innerText = $state('');

	// Fallback label to inner text if not provided
	let displayLabel = $derived(label || innerText || value);

	let isSelected = $derived.by(() => {
		if (!selectContext) return false;
		if (selectContext.multiple) {
			return Array.isArray(selectContext.value) && selectContext.value.includes(value);
		}
		return selectContext.value === value;
	});

	onMount(() => {
		if (rootNode && !label) {
			innerText = rootNode.innerText.trim();
		}

		const unregister = selectContext?.registerOption({ value, label: displayLabel, disabled });
		return () => {
			if (unregister) unregister();
		};
	});

	function handleClick(e: MouseEvent) {
		e.stopPropagation();
		if (disabled || !selectContext) return;

		if (selectContext.multiple) {
			let current = Array.isArray(selectContext.value) ? [...selectContext.value] : [];
			if (current.includes(value)) {
				current = current.filter((v: string) => v !== value);
			} else {
				current.push(value);
			}
			selectContext.value = current;
		} else {
			selectContext.value = value;
			selectContext.close();
		}
	}
</script>

<li
	bind:this={rootNode}
	class={cn(
		'text-foreground relative box-border flex min-h-[22px] cursor-pointer flex-col justify-center border border-transparent px-[6px] py-[4px] text-[13px]',
		!disabled && !isSelected && 'hover:bg-background-hover hover:text-foreground-bright',
		isSelected && 'bg-primary-selection text-foreground-bright border-primary',
		disabled && 'cursor-not-allowed opacity-50',
		className
	)}
	role="option"
	aria-selected={isSelected}
	onclick={handleClick}
	{...rest}
>
	<div class="flex items-center">
		{#if selectContext?.multiple}
			<div
				class={cn(
					'bg-background-elevated mr-[8px] box-border flex h-[16px] w-[16px] items-center justify-center rounded-[3px] border border-solid',
					isSelected ? 'border-primary bg-primary' : 'border-border'
				)}
			>
				{#if isSelected}
					<svg
						width="14"
						height="14"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M14.22 3.03l-8.08 8.08-3.32-3.32-1.06 1.06 4.38 4.38 9.14-9.14-1.06-1.06z"
							fill="var(--foreground-bright)"
						/>
					</svg>
				{/if}
			</div>
		{/if}

		<span class="truncate">
			{#if children}
				{@render children()}
			{:else}
				{displayLabel}
			{/if}
		</span>
	</div>

	{#if description}
		<div class="mt-[2px] text-[11px] opacity-70">{description}</div>
	{/if}
</li>
