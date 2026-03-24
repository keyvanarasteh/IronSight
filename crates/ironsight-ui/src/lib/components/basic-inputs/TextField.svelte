<script lang="ts">
	import { cn } from '../../utils';
	import type { Snippet } from 'svelte';

	let {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		children,
		value = $bindable(''),
		placeholder = '',
		disabled = false,
		readonly = false,
		type = 'text',
		validationState = 'none',
		validationMessage = '',
		showHistory = false,
		history = [],
		ariaLabel = '',
		class: className,
		oninput,
		onchange,
		onkeydown,
		...rest
	}: {
		children?: Snippet;
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		readonly?: boolean;
		type?: 'text' | 'password' | 'number' | 'email' | 'url';
		validationState?: 'none' | 'info' | 'warning' | 'error';
		validationMessage?: string;
		showHistory?: boolean;
		history?: string[];
		ariaLabel?: string;
		class?: string;
		oninput?: (e: Event) => void;
		onchange?: (e: Event) => void;
		onkeydown?: (e: KeyboardEvent) => void;
		[key: string]: unknown;
	} = $props();

	let historyIndex = $state(-1);
	let savedValue = $state('');

	const borderColors: Record<string, string> = {
		none: 'border-input-border',
		info: 'border-info',
		warning: 'border-warning',
		error: 'border-error-fg'
	};

	const messageColors: Record<string, string> = {
		none: '',
		info: 'text-info',
		warning: 'text-warning',
		error: 'text-error-fg'
	};

	const messageIcons: Record<string, string> = {
		none: '',
		info: 'ℹ',
		warning: '⚠',
		error: '✕'
	};

	function handleKeyDown(e: KeyboardEvent) {
		onkeydown?.(e);

		if (!showHistory || history.length === 0) return;

		if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (historyIndex === -1) {
				savedValue = value;
				historyIndex = history.length - 1;
			} else if (historyIndex > 0) {
				historyIndex--;
			}
			value = history[historyIndex] ?? '';
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (historyIndex === -1) return;
			if (historyIndex < history.length - 1) {
				historyIndex++;
				value = history[historyIndex] ?? '';
			} else {
				historyIndex = -1;
				value = savedValue;
			}
		}
	}
</script>

<div class={cn('flex flex-col', className)}>
	<input
		{type}
		{disabled}
		{readonly}
		{placeholder}
		bind:value
		aria-label={ariaLabel || undefined}
		aria-invalid={validationState === 'error' ? 'true' : undefined}
		{oninput}
		{onchange}
		onkeydown={handleKeyDown}
		class={cn(
			'box-border w-full rounded-[2px] border border-solid px-[4px] py-[3px]',
			'bg-input text-input-fg font-sans text-[13px] leading-[20px]',
			'placeholder:text-placeholder',
			'focus:border-ring focus:outline-none',
			borderColors[validationState],
			disabled && 'cursor-not-allowed opacity-50'
		)}
		{...rest}
	/>
	{#if validationState !== 'none' && validationMessage}
		<div
			class={cn(
				'mt-1 flex items-start gap-1 text-[11px] leading-[14px]',
				messageColors[validationState]
			)}
		>
			<span class="shrink-0 text-[12px]">{messageIcons[validationState]}</span>
			<span>{validationMessage}</span>
		</div>
	{/if}
</div>
