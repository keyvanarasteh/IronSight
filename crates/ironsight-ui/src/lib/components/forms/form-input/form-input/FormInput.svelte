<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		value: string;
		type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'url' | 'tel';
		placeholder?: string;
		label?: string;
		error?: string;
		hint?: string;
		leadingIcon?: import('svelte').Component<{ size?: number; class?: string }>;
		trailingIcon?: import('svelte').Component<{ size?: number; class?: string }>;
		disabled?: boolean;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}

	let {
		value = $bindable(''),
		type = 'text',
		placeholder = '',
		label = '',
		error = '',
		hint = '',
		leadingIcon: LeadingIcon,
		trailingIcon: TrailingIcon,
		disabled = false,
		size = 'md',
		class: className = ''
	}: Props = $props();

	const sizeClasses: Record<'sm' | 'md' | 'lg', { input: string; icon: number; label: string }> = {
		sm: { input: 'h-8 text-xs px-2.5', icon: 14, label: 'text-[11px]' },
		md: { input: 'h-9 text-sm px-3', icon: 16, label: 'text-xs' },
		lg: { input: 'h-11 text-base px-4', icon: 18, label: 'text-sm' }
	};

	let s = $derived(sizeClasses[size]);
</script>

<div class={cn('space-y-1.5', className)}>
	{#if label}
		<span class={cn('text-foreground mb-1.5 block font-medium', s.label)}>
			{label}
		</span>
	{/if}
	<div class="relative">
		{#if LeadingIcon}
			<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
				<LeadingIcon size={s.icon} class="text-muted-foreground" />
			</div>
		{/if}
		<input
			{type}
			{placeholder}
			{disabled}
			bind:value
			class={cn(
				'bg-background text-foreground placeholder:text-muted-foreground w-full rounded-lg border transition-all outline-none',
				s.input,
				LeadingIcon && 'pl-9',
				TrailingIcon && 'pr-9',
				error
					? 'border-destructive focus:ring-destructive focus:ring-1'
					: 'border-input focus:border-primary focus:ring-primary focus:ring-1',
				disabled && 'cursor-not-allowed opacity-50'
			)}
		/>
		{#if TrailingIcon}
			<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
				<TrailingIcon size={s.icon} class="text-muted-foreground" />
			</div>
		{/if}
	</div>
	{#if error}
		<p class="text-destructive text-[11px] font-medium">{error}</p>
	{:else if hint}
		<p class="text-muted-foreground text-[11px]">{hint}</p>
	{/if}
</div>
