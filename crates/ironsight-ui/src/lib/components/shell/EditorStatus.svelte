<script lang="ts">
	let {
		line = 1,
		column = 1,
		selected = 0,
		encoding = 'UTF-8',
		eol = 'LF',
		language = 'Plain Text',
		indentation = 'Spaces: 4',
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		notifications = 0,
		onlanguageclick,
		onencodingclick,
		oneolclick,
		onindentclick,
		class: className = ''
	}: {
		line?: number;
		column?: number;
		selected?: number;
		encoding?: string;
		eol?: string;
		language?: string;
		indentation?: string;
		notifications?: number;
		onlanguageclick?: () => void;
		onencodingclick?: () => void;
		oneolclick?: () => void;
		onindentclick?: () => void;
		class?: string;
	} = $props();

	const cursorText = $derived(
		selected > 0 ? `Ln ${line}, Col ${column} (${selected} selected)` : `Ln ${line}, Col ${column}`
	);
</script>

<div
	class="text-statusbar-fg flex items-center gap-3 text-[11px] select-none {className}"
	role="status"
	aria-label="Editor status"
>
	<span class="cursor-default" title="Go to Line/Column">
		{cursorText}
	</span>

	<button
		class="m-0 cursor-pointer rounded border-none bg-transparent px-1 py-0.5 text-current hover:bg-white/10"
		onclick={onindentclick}
	>
		{indentation}
	</button>

	<button
		class="m-0 cursor-pointer rounded border-none bg-transparent px-1 py-0.5 text-current hover:bg-white/10"
		onclick={onencodingclick}
	>
		{encoding}
	</button>

	<button
		class="m-0 cursor-pointer rounded border-none bg-transparent px-1 py-0.5 text-current hover:bg-white/10"
		onclick={oneolclick}
	>
		{eol}
	</button>

	<button
		class="m-0 cursor-pointer rounded border-none bg-transparent px-1 py-0.5 text-current hover:bg-white/10"
		onclick={onlanguageclick}
	>
		{language}
	</button>
</div>
