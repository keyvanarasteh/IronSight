<script lang="ts">
	import { cn } from '../../utils';

	let {
		value = $bindable(''),
		autocomplete,
		autofocus = false,
		disabled = false,
		invalid = false,
		maxLength,
		minLength,
		rows,
		cols,
		name,
		placeholder,
		readonly = false,
		resize = 'none',
		required = false,
		spellcheck = false,
		monospace = false,
		oninput,
		onchange,
		onkeydown,
		onblur,
		onfocus,
		class: className,
		...rest
	}: {
		value?: string;
		autocomplete?: 'on' | 'off';
		autofocus?: boolean;
		disabled?: boolean;
		invalid?: boolean;
		maxLength?: number;
		minLength?: number;
		rows?: number;
		cols?: number;
		name?: string;
		placeholder?: string;
		readonly?: boolean;
		resize?: 'both' | 'horizontal' | 'vertical' | 'none';
		required?: boolean;
		spellcheck?: boolean;
		monospace?: boolean;
		oninput?: (event: Event) => void;
		onchange?: (event: Event) => void;
		onkeydown?: (event: KeyboardEvent) => void;
		onblur?: (event: FocusEvent) => void;
		onfocus?: (event: FocusEvent) => void;
		class?: string;
		[key: string]: unknown;
	} = $props();

	const resizeMap = {
		none: 'resize-none',
		both: 'resize',
		horizontal: 'resize-x',
		vertical: 'resize-y'
	};

	function handleInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		value = target.value;
		if (oninput) oninput(event);
	}
</script>

<!-- svelte-ignore a11y_autofocus -->
<textarea
	{autocomplete}
	{autofocus}
	{disabled}
	maxlength={maxLength}
	minlength={minLength}
	{rows}
	{cols}
	{name}
	{placeholder}
	{readonly}
	{required}
	{spellcheck}
	class={cn(
		'box-border block w-full rounded-[4px] border border-solid px-[4px] py-[3px] transition-colors',
		'focus:border-primary focus:outline-none',
		!monospace && 'font-sans text-[13px] font-normal',
		monospace && 'bg-background text-foreground font-mono text-[14px]',
		!invalid && !monospace && 'bg-background-elevated text-foreground border-transparent',
		invalid && 'bg-destructive-bg border-destructive',
		disabled && 'cursor-not-allowed opacity-50',
		resizeMap[resize],
		'placeholder:text-foreground-subtle placeholder:opacity-100',
		'scrollbar-thin scrollbar-thumb-scrollbar hover:scrollbar-thumb-scrollbar-active active:scrollbar-thumb-scrollbar-hover scrollbar-track-transparent',
		className
	)}
	{value}
	oninput={handleInput}
	{onchange}
	{onkeydown}
	{onblur}
	{onfocus}
	{...rest}
></textarea>
