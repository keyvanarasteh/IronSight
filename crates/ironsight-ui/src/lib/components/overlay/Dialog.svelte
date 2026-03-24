<script lang="ts" module>
	export type DialogType = 'none' | 'info' | 'warning' | 'error';
	export type DialogButton = {
		label: string;
		variant?: 'primary' | 'secondary';
		value?: string;
	};
	export type DialogInput = {
		placeholder?: string;
		type?: 'text' | 'password';
		value?: string;
	};
</script>

<script lang="ts">
	import { cn } from '../../utils';
	import type { Snippet } from 'svelte';

	let {
		children,
		open = $bindable(false),
		type = 'none',
		title = '',
		message = '',
		detail = '',
		buttons = [],
		inputs = [],
		showCheckbox = false,
		checkboxLabel = '',
		checkboxChecked = $bindable(false),
		closeOnBackdrop = true,
		loading = false,
		class: className,
		onclose,
		onsubmit,
		...rest
	}: {
		children?: Snippet;
		open?: boolean;
		type?: DialogType;
		title?: string;
		message?: string;
		detail?: string;
		buttons?: DialogButton[];
		inputs?: DialogInput[];
		showCheckbox?: boolean;
		checkboxLabel?: string;
		checkboxChecked?: boolean;
		closeOnBackdrop?: boolean;
		loading?: boolean;
		class?: string;
		onclose?: () => void;
		onsubmit?: (result: {
			button: string;
			inputValues: string[];
			checkboxChecked: boolean;
		}) => void | boolean;
		[key: string]: unknown;
	} = $props();

	let dialogRef: HTMLDivElement | undefined = $state();
	let inputValues = $state<string[]>([]);
	let previousFocus: HTMLElement | null = null;

	$effect(() => {
		if (open && !loading) {
			inputValues = inputs.map((i) => i.value ?? '');
			previousFocus = document.activeElement as HTMLElement;
			requestAnimationFrame(() => {
				if (dialogRef) {
					// Focus first input or first button
					const firstInput = dialogRef.querySelector('input') as HTMLElement;
					const firstButton = dialogRef.querySelector('.dialog-btn') as HTMLElement;
					(firstInput ?? firstButton)?.focus();
				}
			});
		} else if (previousFocus) {
			previousFocus.focus();
			previousFocus = null;
		}
	});

	function close() {
		open = false;
		onclose?.();
	}

	function submit(buttonValue: string) {
		const res = onsubmit?.({
			button: buttonValue,
			inputValues,
			checkboxChecked
		});
		if (res !== false) {
			open = false;
		}
	}

	function handleBackdropClick(e: MouseEvent) {
		if (closeOnBackdrop && e.target === e.currentTarget) close();
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (!open) return;
		if (e.key === 'Escape') {
			e.preventDefault();
			close();
			return;
		}
		// Focus trap
		if (e.key === 'Tab' && dialogRef) {
			const focusables = dialogRef.querySelectorAll<HTMLElement>(
				'button, input, [tabindex]:not([tabindex="-1"])'
			);
			if (focusables.length === 0) return;
			const first = focusables[0]!;
			const last = focusables[focusables.length - 1]!;
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		}
	}

	const typeIcons: Record<DialogType, string> = {
		none: '',
		info: '$(info)',
		warning: '⚠',
		error: '✕'
	};

	const typeColors: Record<DialogType, string> = {
		none: '',
		info: 'text-info',
		warning: 'text-warning',
		error: 'text-error-fg'
	};
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if open}
	<!-- Backdrop -->
	<div
		role="presentation"
		class="fixed inset-0 z-9999 flex items-center justify-center bg-black/40"
		onclick={!loading ? handleBackdropClick : undefined}
		onkeydown={(e) => {
			if (!loading && (e.key === 'Enter' || e.key === ' ')) handleBackdropClick(e as any);
		}}
	>
		<!-- Dialog -->
		<div
			bind:this={dialogRef}
			role="dialog"
			aria-modal="true"
			aria-label={title || 'Dialog'}
			class={cn(
				'relative flex w-full max-w-[450px] min-w-[280px] flex-col rounded-[6px] shadow-[0_4px_16px_var(--shadow)]',
				'bg-widget-bg border-widget-border text-foreground border font-sans text-[13px]',
				className
			)}
			{...rest}
		>
			{#if title || type !== 'none'}
				<!-- Header -->
				<div class="flex items-center gap-2 px-4 pt-4 pb-2">
					{#if type !== 'none'}
						<span class={cn('shrink-0 text-[20px]', typeColors[type])}>
							{typeIcons[type]}
						</span>
					{/if}
					{#if title}
						<h2 class="text-foreground-bright m-0 text-[14px] leading-tight font-semibold">
							{title}
						</h2>
					{/if}
				</div>
			{/if}

			<!-- Body -->
			<div class="flex-1 px-4 py-2">
				{#if message}
					<p class="text-foreground m-0 mb-2 leading-normal">{message}</p>
				{/if}
				{#if detail}
					<p class="text-foreground-muted m-0 mb-2 text-[12px] leading-normal">{detail}</p>
				{/if}

				{#if inputs.length > 0}
					<div class="mt-2 flex flex-col gap-2">
						{#each inputs as input, i (i)}
							<input
								disabled={loading}
								type={input.type ?? 'text'}
								placeholder={input.placeholder ?? ''}
								bind:value={inputValues[i]}
								onkeydown={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault();
										const primary =
											buttons.find((b) => b.variant === 'primary') || buttons[buttons.length - 1];
										if (primary) {
											submit(primary.value ?? primary.label);
										}
									}
								}}
								class={cn(
									'border-input-border bg-input text-input-fg w-full rounded-[2px] border px-2 py-[3px] text-[13px]',
									'focus:border-ring focus:outline-none',
									loading && 'cursor-not-allowed opacity-60'
								)}
							/>
						{/each}
					</div>
				{/if}

				{#if showCheckbox}
					<label
						class="text-foreground-muted mt-3 flex cursor-pointer items-center gap-2 text-[12px]"
					>
						<input
							disabled={loading}
							type="checkbox"
							bind:checked={checkboxChecked}
							class={cn(
								'accent-primary h-[13px] w-[13px]',
								loading && 'cursor-not-allowed opacity-60'
							)}
						/>
						{checkboxLabel}
					</label>
				{/if}

				{#if loading}
					<div class="bg-foreground/10 mt-4 flex h-1 w-full overflow-hidden rounded-full">
						<div class="bg-primary h-full w-full animate-pulse rounded-full"></div>
					</div>
				{/if}

				{@render children?.()}
			</div>

			<!-- Footer / Buttons -->
			{#if buttons.length > 0}
				<div class="flex items-center justify-end gap-2 px-4 pt-2 pb-4">
					{#each buttons as btn, i (i)}
						<button
							disabled={loading}
							class={cn(
								'dialog-btn cursor-pointer rounded-[2px] border px-[13px] py-px text-[13px] leading-[22px] transition-colors',
								btn.variant === 'secondary' || !btn.variant
									? 'bg-button-secondary-bg text-button-secondary-fg border-button-border hover:bg-button-secondary-hover-bg'
									: 'bg-button-bg text-button-fg border-button-border hover:bg-button-hover-bg',
								loading && 'cursor-not-allowed opacity-60'
							)}
							onclick={() => submit(btn.value ?? btn.label)}
						>
							{btn.label}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>
{/if}
