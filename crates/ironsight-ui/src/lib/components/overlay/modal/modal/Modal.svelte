<script lang="ts">
	import type { Component } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { X } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import type { Snippet } from 'svelte';

	interface Props {
		open: boolean;
		title?: string;
		description?: string;
		icon?: Component;
		size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
		closable?: boolean;
		class?: string;
		children: Snippet;
		footer?: Snippet;
	}

	let {
		open = $bindable(false),
		title = '',
		description = '',
		icon: Icon,
		size = 'md',
		closable = true,
		class: className = '',
		children,
		footer
	}: Props = $props();

	const sizeClasses: Record<string, string> = {
		sm: 'max-w-sm',
		md: 'max-w-lg',
		lg: 'max-w-2xl',
		xl: 'max-w-4xl',
		full: 'inset-4 sm:inset-8 lg:inset-12 max-w-none'
	};

	function close() {
		if (closable) open = false;
	}

	function handleBackdrop(e: MouseEvent) {
		if (e.target === e.currentTarget) close();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- Backdrop -->
	<div
		class="bg-background/60 fixed inset-0 z-200 flex items-center justify-center backdrop-blur-sm"
		transition:fade={{ duration: 150 }}
		onclick={handleBackdrop}
		onkeydown={handleKeydown}
		role="button"
		tabindex="-1"
	>
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_interactive_supports_focus -->
		<div
			class={cn(
				'border-border bg-card text-card-foreground flex flex-col overflow-hidden rounded-2xl border shadow-2xl',
				size === 'full' ? 'fixed' : 'relative mx-4 w-full',
				sizeClasses[size],
				size === 'full' ? 'max-h-full' : 'max-h-[90vh]',
				className
			)}
			transition:fly={{ y: 20, duration: 200 }}
			role="dialog"
			aria-modal="true"
			onclick={(e) => e.stopPropagation()}
		>
			<!-- Header -->
			{#if title || closable}
				<div class="border-border/50 flex shrink-0 items-center justify-between border-b px-6 py-4">
					<div class="flex items-center gap-3">
						{#if Icon}
							<div class="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-xl">
								<Icon size={18} class="text-primary" />
							</div>
						{/if}
						<div>
							{#if title}
								<h2 class="text-foreground text-base font-bold">{title}</h2>
							{/if}
							{#if description}
								<p class="text-muted-foreground text-xs">{description}</p>
							{/if}
						</div>
					</div>
					{#if closable}
						<button
							onclick={close}
							class="text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg p-2 transition-colors"
						>
							<X size={18} />
						</button>
					{/if}
				</div>
			{/if}

			<!-- Body -->
			<div class="flex-1 overflow-y-auto px-6 py-4">
				{@render children()}
			</div>

			<!-- Footer -->
			{#if footer}
				<div class="border-border/50 shrink-0 border-t px-6 py-3">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}
