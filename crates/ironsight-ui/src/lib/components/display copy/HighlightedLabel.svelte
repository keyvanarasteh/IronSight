<script lang="ts">
	import { cn } from '../../utils';

	let {
		text = '',
		highlights = [],
		class: className,
		...rest
	}: {
		text?: string;
		highlights?: [number, number][];
		class?: string;
		[key: string]: unknown;
	} = $props();

	type Segment = { text: string; highlighted: boolean };

	let segments = $derived.by((): Segment[] => {
		if (!text || highlights.length === 0) return [{ text, highlighted: false }];

		// Sort and merge overlapping highlights
		const sorted = [...highlights].sort((a, b) => a[0] - b[0]);
		const merged: [number, number][] = [];
		for (const [s, e] of sorted) {
			const last = merged[merged.length - 1];
			if (last && s <= last[1]) {
				last[1] = Math.max(last[1], e);
			} else {
				merged.push([s, e]);
			}
		}

		const result: Segment[] = [];
		let pos = 0;
		for (const [start, end] of merged) {
			if (pos < start) {
				result.push({ text: text.slice(pos, start), highlighted: false });
			}
			result.push({ text: text.slice(start, end), highlighted: true });
			pos = end;
		}
		if (pos < text.length) {
			result.push({ text: text.slice(pos), highlighted: false });
		}
		return result;
	});
</script>

<span class={cn('text-foreground', className)} {...rest}>
	{#each segments as segment, i (i)}
		{#if segment.highlighted}
			<span class="bg-find-match text-foreground font-inherit">{segment.text}</span>
		{:else}
			{segment.text}
		{/if}
	{/each}
</span>
