<script lang="ts">
	import { cn } from '$lib/utils';
	import type { IconComponent } from '$lib/types/navigation';

	interface Props {
		title: string;
		subtitle: string;
		icon?: IconComponent | string;
		iconClass?: string;
		children?: import('svelte').Snippet;
	}

	let { title, subtitle, icon, iconClass = 'text-qrs-accent', children }: Props = $props();
</script>

<div class="border-qrs-border/30 mb-6 flex items-center justify-between border-b pb-6">
	<div class="flex items-center space-x-4">
		{#if icon}
			<div
				class={cn(
					'bg-qrs-bg-elevated border-qrs-border/30 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border',
					iconClass
				)}
			>
				{#if typeof icon === 'string'}
					<!-- Handle string icons if needed, e.g. "lucide:scale" -->
					<!-- We can just display it or omit actual string render since lucide-svelte expects components -->
				{:else}
					{@const Icon = icon}
					<Icon class="h-6 w-6" />
				{/if}
			</div>
		{/if}
		<div>
			<h1 class="text-qrs-text-primary text-2xl font-bold tracking-tight">{title}</h1>
			<p class="text-qrs-text-muted mt-1 text-sm font-medium">{subtitle}</p>
		</div>
	</div>

	{#if children}
		<div class="flex items-center gap-3">
			{@render children()}
		</div>
	{/if}
</div>
