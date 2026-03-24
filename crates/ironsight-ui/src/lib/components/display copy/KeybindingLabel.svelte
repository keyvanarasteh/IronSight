<script lang="ts">
	import { cn } from '../../utils';

	let {
		keybinding = '',
		os = 'linux',
		class: className,
		...rest
	}: {
		keybinding?: string;
		os?: 'win' | 'mac' | 'linux';
		class?: string;
		[key: string]: unknown;
	} = $props();

	// Parse "Ctrl+Shift+P" into segments
	let keys = $derived(
		keybinding.split('+').map((key) => {
			if (os === 'mac') {
				switch (key.toLowerCase()) {
					case 'ctrl':
						return '⌃';
					case 'shift':
						return '⇧';
					case 'alt':
						return '⌥';
					case 'meta':
					case 'cmd':
						return '⌘';
					default:
						return key;
				}
			}
			return key;
		})
	);
</script>

<span
	class={cn('text-keybinding-fg inline-flex items-center gap-[2px] text-[11px]', className)}
	{...rest}
>
	{#each keys as key, i (key)}
		{#if i > 0}
			<span class="text-foreground-muted text-[9px]">+</span>
		{/if}
		<kbd
			class="border-border bg-background-elevated text-keybinding-fg inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-[3px] border px-[4px] font-sans text-[11px] leading-none"
		>
			{key}
		</kbd>
	{/each}
</span>
