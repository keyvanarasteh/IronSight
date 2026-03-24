<script lang="ts">
	import { SplitSquareHorizontal, Pin, PinOff, X } from 'lucide-svelte';

	let {
		onclose,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		oncloseall,
		onsplit,
		onpin,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		ontogglelock,
		pinned = false,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		locked = false,
		class: className = ''
	}: {
		onclose?: () => void;
		oncloseall?: () => void;
		onsplit?: (direction: 'left' | 'right' | 'down') => void;
		onpin?: () => void;
		ontogglelock?: () => void;
		pinned?: boolean;
		locked?: boolean;
		class?: string;
	} = $props();
</script>

<div class="flex items-center gap-0.5 {className}" role="toolbar" aria-label="Editor actions">
	{#if onsplit}
		<button
			class="text-foreground/60 m-0 cursor-pointer rounded border-none bg-transparent p-1 hover:bg-white/10"
			onclick={() => onsplit?.('right')}
			aria-label="Split editor right"
		>
			<SplitSquareHorizontal class="h-3.5 w-3.5" />
		</button>
	{/if}

	{#if onpin}
		<button
			class="m-0 cursor-pointer rounded border-none bg-transparent p-1 hover:bg-white/10
				{pinned ? 'text-focusborder' : 'text-foreground/60'}"
			onclick={onpin}
			aria-label={pinned ? 'Unpin editor' : 'Pin editor'}
			aria-pressed={pinned}
		>
			{#if pinned}
				<PinOff class="h-3.5 w-3.5" />
			{:else}
				<Pin class="h-3.5 w-3.5" />
			{/if}
		</button>
	{/if}

	{#if onclose}
		<button
			class="text-foreground/60 m-0 cursor-pointer rounded border-none bg-transparent p-1 hover:bg-white/10"
			onclick={onclose}
			aria-label="Close editor"
		>
			<X class="h-3.5 w-3.5" />
		</button>
	{/if}
</div>
