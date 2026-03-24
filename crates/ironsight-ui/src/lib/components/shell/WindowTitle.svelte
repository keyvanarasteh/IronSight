<script lang="ts">
	let {
		template = '${dirty}${activeEditor} - ${rootName}',
		activeEditor = '',
		rootName = '',
		dirty = false,
		separator = ' — ',
		prefix = '',
		suffix = '',
		class: className = ''
	}: {
		template?: string;
		activeEditor?: string;
		rootName?: string;
		dirty?: boolean;
		separator?: string;
		prefix?: string;
		suffix?: string;
		class?: string;
	} = $props();

	const formatted = $derived(() => {
		let result = template
			.replace('${activeEditor}', activeEditor)
			.replace('${rootName}', rootName)
			.replace('${dirty}', dirty ? '● ' : '')
			.replace('${separator}', separator);
		if (prefix) result = prefix + separator + result;
		if (suffix) result = result + separator + suffix;
		return result;
	});
</script>

<span class="text-titlebar-fg truncate text-xs select-none {className}" title={formatted()}>
	{formatted()}
</span>
