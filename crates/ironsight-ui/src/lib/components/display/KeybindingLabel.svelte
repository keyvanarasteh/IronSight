<script lang="ts">
	let {
		keybinding,
		os = 'mac',
		class: className = ''
	}: {
		keybinding: string;
		os?: 'mac' | 'windows' | 'linux';
		class?: string;
	} = $props();

	// Very simple display logic for the keybinding
	let displayKey = $derived(os === 'mac' && keybinding.includes('Cmd') 
		? keybinding.replace('Cmd+', '⌘') 
		: keybinding.replace('Cmd+', 'Ctrl+'));
</script>

<div class="flex items-center justify-center rounded border border-border bg-muted/30 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground {className}">
	{displayKey}
</div>
