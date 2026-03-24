<script module>
	export const SELECT_CONTEXT_KEY = Symbol('select');
</script>

<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import { cn } from '../../utils';

	let {
		children,
		value = $bindable(),
		multiple = false,
		placeholder = '',
		disabled = false,
		invalid = false,
		class: className,
		...rest
	}: {
		children?: Snippet;
		value?: string | string[];
		multiple?: boolean;
		placeholder?: string;
		disabled?: boolean;
		invalid?: boolean;
		class?: string;
		[key: string]: unknown;
	} = $props();

	let open = $state(false);
	let options = $state<Array<{ value: string; label: string; disabled: boolean }>>([]);

	// Initialize value based on multiple
	$effect(() => {
		if (multiple && value === undefined) value = [];
		if (!multiple && value === undefined) value = '';
	});

	setContext(SELECT_CONTEXT_KEY, {
		get multiple() {
			return multiple;
		},
		get value() {
			return value;
		},
		set value(v) {
			value = v;
		},
		registerOption: (opt: { value: string; label: string; disabled: boolean }) => {
			options.push(opt);
			return () => {
				options = options.filter((o) => o.value !== opt.value);
			};
		},
		updateOption: (oldValue: string, opt: { value: string; label: string; disabled: boolean }) => {
			const index = options.findIndex((o) => o.value === oldValue);
			if (index !== -1) options[index] = opt;
		},
		close: () => {
			open = false;
		}
	});

	let displayLabel = $derived.by(() => {
		if (multiple) {
			const arr = Array.isArray(value) ? value : [];
			if (arr.length === 0) return placeholder || '0 Selected';
			return `${arr.length} Selected`;
		} else {
			const selectedOpt = options.find((o) => o.value === value);
			return selectedOpt ? selectedOpt.label : placeholder || '';
		}
	});

	function toggle() {
		if (!disabled) open = !open;
	}

	function handleBlur(e: FocusEvent) {
		const currentTarget = e.currentTarget as HTMLElement;
		if (!currentTarget.contains(e.relatedTarget as Node)) {
			open = false;
		}
	}
</script>

<div
	class={cn('relative inline-block w-[320px] max-w-full font-sans text-[13px]', className)}
	onfocusout={handleBlur}
	tabindex="-1"
>
	<button
		type="button"
		class={cn(
			'box-border flex w-full items-center justify-between rounded-[4px] border border-solid px-[4px] py-[3px] text-left transition-colors',
			'bg-background-elevated border-border text-foreground',
			'focus:border-primary focus:outline-none',
			invalid && 'border-destructive bg-destructive-bg',
			disabled && 'cursor-not-allowed opacity-50'
		)}
		{disabled}
		onclick={toggle}
		{...rest}
	>
		<span class="truncate pr-2">{displayLabel}</span>
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			class="shrink-0"
		>
			<path d="M4.2 6.1L8 10L11.8 6.1L11 5.4L8 8.6L5 5.4L4.2 6.1Z" fill="currentColor" />
		</svg>
	</button>

	<!-- The dropdown menu -->
	<div
		class={cn(
			'border-border-subtle bg-background-elevated absolute left-0 z-50 mt-[2px] w-full rounded-[4px] border border-solid shadow-md',
			open ? 'block' : 'hidden'
		)}
	>
		<ul
			class="scrollbar-thin scrollbar-thumb-scrollbar m-0 max-h-[220px] list-none overflow-y-auto py-1"
			role="listbox"
		>
			{@render children?.()}
		</ul>
	</div>
</div>
