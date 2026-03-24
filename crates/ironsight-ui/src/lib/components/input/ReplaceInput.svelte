<script lang="ts">
	import { cn } from '../../utils';

	let {
		value = $bindable(''),

		replaceValue = $bindable(''),
		regex = $bindable(false),
		caseSensitive = $bindable(false),
		wholeWord = $bindable(false),
		preserveCase = $bindable(false),
		class: className,
		oninput,
		onreplace,
		onreplaceall,
		...rest
	}: {
		value?: string;

		replaceValue?: string;
		regex?: boolean;
		caseSensitive?: boolean;
		wholeWord?: boolean;
		preserveCase?: boolean;
		class?: string;
		oninput?: (e: Event) => void;
		onreplace?: () => void;
		onreplaceall?: () => void;
		[key: string]: unknown;
	} = $props();
</script>

<div class={cn('flex flex-col gap-[4px]', className)} {...rest}>
	<!-- Search row -->
	<div
		class="border-input-border bg-input focus-within:border-ring flex h-[24px] items-center gap-0 rounded-[2px] border"
	>
		<input
			type="text"
			placeholder="Search"
			bind:value
			{oninput}
			class="text-input-fg placeholder:text-placeholder min-w-0 flex-1 border-none bg-transparent px-[4px] py-0 text-[13px] outline-none"
		/>
		<button
			type="button"
			title="Match Case"
			class={cn(
				'flex h-[20px] w-[22px] shrink-0 cursor-pointer items-center justify-center rounded-[2px] border border-transparent transition-colors',
				'text-foreground-muted hover:text-foreground',
				caseSensitive &&
					'bg-input-option-active-bg border-input-option-active-border text-foreground'
			)}
			onclick={() => (caseSensitive = !caseSensitive)}>Aa</button
		>
		<button
			type="button"
			title="Match Whole Word"
			class={cn(
				'flex h-[20px] w-[22px] shrink-0 cursor-pointer items-center justify-center rounded-[2px] border border-transparent transition-colors',
				'text-foreground-muted hover:text-foreground',
				wholeWord && 'bg-input-option-active-bg border-input-option-active-border text-foreground'
			)}
			onclick={() => (wholeWord = !wholeWord)}>Ab</button
		>
		<button
			type="button"
			title="Use Regular Expression"
			class={cn(
				'mr-[2px] flex h-[20px] w-[22px] shrink-0 cursor-pointer items-center justify-center rounded-[2px] border border-transparent transition-colors',
				'text-foreground-muted hover:text-foreground',
				regex && 'bg-input-option-active-bg border-input-option-active-border text-foreground'
			)}
			onclick={() => (regex = !regex)}>.*</button
		>
	</div>

	<!-- Replace row -->
	<div class="flex items-center gap-[4px]">
		<div
			class="border-input-border bg-input focus-within:border-ring flex h-[24px] flex-1 items-center gap-0 rounded-[2px] border"
		>
			<input
				type="text"
				placeholder="Replace"
				bind:value={replaceValue}
				class="text-input-fg placeholder:text-placeholder min-w-0 flex-1 border-none bg-transparent px-[4px] py-0 text-[13px] outline-none"
			/>
			<button
				type="button"
				title="Preserve Case"
				class={cn(
					'mr-[2px] flex h-[20px] w-[22px] shrink-0 cursor-pointer items-center justify-center rounded-[2px] border border-transparent transition-colors',
					'text-foreground-muted hover:text-foreground',
					preserveCase &&
						'bg-input-option-active-bg border-input-option-active-border text-foreground'
				)}
				onclick={() => (preserveCase = !preserveCase)}>AB</button
			>
		</div>

		<button
			type="button"
			title="Replace"
			class="text-foreground-muted hover:text-foreground hover:bg-background-hover flex h-[22px] w-[24px] cursor-pointer items-center justify-center rounded-[2px] border border-transparent transition-colors"
			onclick={() => onreplace?.()}
		>
			<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
				<path
					d="M3.221 3.739l2.261 2.269L7.7 3.784l-.7-.7-1.012 1.007-.008-1.6a.523.523 0 01.155-.373.53.53 0 01.372-.156h3.873v-1H6.507a1.527 1.527 0 00-1.08.448 1.52 1.52 0 00-.448 1.074l.008 1.576-1.06-1.06-.706.739z"
				/>
				<path d="M4 7h7v2H4V7z" />
				<path d="M4 11h7v2H4v-2z" />
			</svg>
		</button>
		<button
			type="button"
			title="Replace All"
			class="text-foreground-muted hover:text-foreground hover:bg-background-hover flex h-[22px] w-[24px] cursor-pointer items-center justify-center rounded-[2px] border border-transparent transition-colors"
			onclick={() => onreplaceall?.()}
		>
			<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
				<path
					d="M11.6 2.677l-1.088.778-.072-.11A2.428 2.428 0 009.42 2.47a2.427 2.427 0 00-1.349-.187 2.432 2.432 0 00-1.249.607L9.17 5.379a2.442 2.442 0 00.513-1.319 2.44 2.44 0 00-.263-1.391l.72-.514.701.986-1.411 1.004-.074-.073L7.69 5.715l1.41-1.004.073.073-2.383 2.345.073.072 1.41-1.004.073.073-1.41 1.004.722 1.012 1.41-1.004.073.072-1.41 1.004.706.992-.054.088h3.986v-1H9.655l1.413-1.008-.073-.072-1.41 1.004-.722-1.012 1.41-1.004-.073-.072-1.41 1.004-.073-.073 2.384-2.345-.073-.072-1.41 1.004-.701-.986 1.41-1.004zM4 7h7v2H4V7z"
				/>
				<path d="M4 11h7v2H4v-2z" />
			</svg>
		</button>
	</div>
</div>
