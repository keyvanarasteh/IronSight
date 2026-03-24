<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		visible = true,
		position = 'right' as 'left' | 'right',
		width = 300,
		minWidth = 170,
		maximized = false,
		title = '',
		headerActions,
		children,
		class: className = ''
	}: {
		visible?: boolean;
		position?: 'left' | 'right';
		width?: number;
		minWidth?: number;
		maximized?: boolean;
		title?: string;
		headerActions?: Snippet;
		children?: Snippet;
		class?: string;
	} = $props();
</script>

{#if visible}
	<aside
		class="bg-sidebar border-border flex shrink-0 flex-col overflow-hidden
			{position === 'left' ? 'border-r' : 'border-l'}
			{maximized ? 'flex-1' : ''}
			{className}"
		style={maximized ? '' : `width: ${width}px; min-width: ${minWidth}px`}
		aria-label={title || 'Auxiliary panel'}
	>
		{#if title}
			<div class="border-border flex h-[35px] shrink-0 items-center justify-between border-b px-3">
				<span class="text-sidebar-fg truncate text-xs font-semibold tracking-wider uppercase"
					>{title}</span
				>
				{#if headerActions}
					<div class="flex shrink-0 items-center gap-0.5">
						{@render headerActions()}
					</div>
				{/if}
			</div>
		{/if}
		<div class="flex-1 overflow-y-auto">
			{#if children}
				{@render children()}
			{/if}
		</div>
	</aside>
{/if}
