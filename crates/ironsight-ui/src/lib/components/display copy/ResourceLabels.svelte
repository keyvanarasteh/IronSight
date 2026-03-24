<script lang="ts">
	import type { Component } from 'svelte';

	type ResourceLabelFormat = 'short' | 'medium' | 'long';

	let {
		path = '',
		name = '',
		icon: FileIcon,
		format = 'short' as ResourceLabelFormat,
		separator = '/',
		decoration,
		class: className = ''
	}: {
		path?: string;
		name?: string;
		icon?: Component;
		format?: ResourceLabelFormat;
		separator?: string;
		decoration?: { color?: string; letter?: string; tooltip?: string };
		class?: string;
	} = $props();

	const segments = $derived(path.split(separator).filter(Boolean));
	const fileName = $derived(name || segments[segments.length - 1] || '');
	const parentPath = $derived(segments.slice(0, -1).join(separator));

	const displayText = $derived(() => {
		switch (format) {
			case 'short':
				return fileName;
			case 'medium':
				return segments.length > 1 ? `${fileName} — ${parentPath}` : fileName;
			case 'long':
				return path || fileName;
		}
	});
</script>

<span class="inline-flex min-w-0 items-center gap-1.5 text-xs {className}" title={path || fileName}>
	{#if FileIcon}
		{@const IconComp = FileIcon}
		<IconComp class="h-4 w-4 shrink-0 opacity-80" />
	{/if}
	<span class="truncate">{displayText()}</span>
	{#if decoration}
		<span
			class="ml-0.5 shrink-0 text-[10px] font-bold"
			style={decoration.color ? `color: ${decoration.color}` : ''}
			title={decoration.tooltip}
		>
			{decoration.letter ?? ''}
		</span>
	{/if}
</span>
