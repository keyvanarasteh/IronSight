<script lang="ts">
	import { cn } from '../../utils';

	let {
		value = $bindable(''),
		regex = $bindable(false),
		caseSensitive = $bindable(false),
		wholeWord = $bindable(false),
		placeholder = 'Search',
		class: className,
		oninput,
		...rest
	}: {
		value?: string;
		regex?: boolean;
		caseSensitive?: boolean;
		wholeWord?: boolean;
		placeholder?: string;
		class?: string;
		oninput?: (e: Event) => void;
		[key: string]: unknown;
	} = $props();
</script>

<div
	class={cn(
		'border-input-border bg-input flex h-[24px] items-center gap-0 rounded-[2px] border',
		'focus-within:border-ring',
		className
	)}
	{...rest}
>
	<input
		type="text"
		{placeholder}
		bind:value
		{oninput}
		class="text-input-fg placeholder:text-placeholder min-w-0 flex-1 border-none bg-transparent px-[4px] py-0 text-[13px] outline-none"
	/>

	<!-- Toggle buttons -->
	<button
		type="button"
		title="Match Case"
		class={cn(
			'flex h-[20px] w-[22px] shrink-0 cursor-pointer items-center justify-center rounded-[2px] border border-transparent transition-colors',
			'text-foreground-muted hover:text-foreground',
			caseSensitive && 'bg-input-option-active-bg border-input-option-active-border text-foreground'
		)}
		onclick={() => (caseSensitive = !caseSensitive)}
	>
		<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
			<path
				d="M8.854 11.702h-1l-.816-2.159H3.772l-.768 2.16H2L5.106 4h.716l3.032 7.702zm-2.15-2.9L5.17 5.066l-1.539 3.737h3.074zm7.145.342q0 1.012-.363 1.539-.363.521-.959.521-.449 0-.801-.246l-.068.198h-.635V4.117h.771v2.688q.363-.289.854-.289.514 0 .867.453.353.453.353 1.387l-.018.79zm-.771-.152v-.674q0-.7-.18-1.014-.18-.315-.51-.315-.226 0-.413.11-.188.109-.377.312v2.463q.304.354.738.354.27 0 .44-.258.17-.26.27-.828l.032-.15z"
			/>
		</svg>
	</button>

	<button
		type="button"
		title="Match Whole Word"
		class={cn(
			'flex h-[20px] w-[22px] shrink-0 cursor-pointer items-center justify-center rounded-[2px] border border-transparent transition-colors',
			'text-foreground-muted hover:text-foreground',
			wholeWord && 'bg-input-option-active-bg border-input-option-active-border text-foreground'
		)}
		onclick={() => (wholeWord = !wholeWord)}
	>
		<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
			<path
				d="M0 11h1v2h14v-2h1v3H0v-3zm3.691-1.758L5.073 4h.716l3.032 7.702h-1l-.816-2.16H3.815l-.768 2.16H2l1.691-5.498zM6.82 8.802L5.246 5.067 3.772 8.802h3.048zm4.987-4.686h.635v.4l.068-.2q.371-.252.82-.252.576 0 .94.453.363.453.363 1.387v.672q0 1.012-.363 1.539-.363.521-.96.521-.448 0-.8-.246V12H11.806V4.117zm.772 3.203v-.674q0-.7-.18-1.014-.18-.315-.51-.315-.227 0-.414.11-.188.109-.377.312v2.463q.304.354.738.354.27 0 .44-.258.171-.259.271-.828l.032-.15z"
			/>
		</svg>
	</button>

	<button
		type="button"
		title="Use Regular Expression"
		class={cn(
			'mr-[2px] flex h-[20px] w-[22px] shrink-0 cursor-pointer items-center justify-center rounded-[2px] border border-transparent transition-colors',
			'text-foreground-muted hover:text-foreground',
			regex && 'bg-input-option-active-bg border-input-option-active-border text-foreground'
		)}
		onclick={() => (regex = !regex)}
	>
		<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
			<path
				d="M10.012 2h.976v3.113l2.56-1.557.486.885L11.47 6l2.564 1.559-.486.885-2.56-1.557V10h-.976V6.887l-2.56 1.557-.486-.885L9.53 6 6.966 4.441l.486-.885 2.56 1.557V2zM2 10h4v4H2v-4z"
			/>
		</svg>
	</button>
</div>
