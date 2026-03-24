<script lang="ts">
	import ContextMenu from './ContextMenu.svelte';

	let showMenu = $state(false);

	const menuData = [
		{ label: 'Copy', keybinding: 'Ctrl+C', value: 'copy' },
		{ separator: true },
		{ label: 'Paste', keybinding: 'Ctrl+V', value: 'paste' }
	];
</script>

<button
	onclick={(e) => {
		e.stopPropagation();
		showMenu = !showMenu;
	}}>Toggle Menu</button
>

<div class="absolute mt-2">
	<ContextMenu bind:show={showMenu} data={menuData} />
</div>
