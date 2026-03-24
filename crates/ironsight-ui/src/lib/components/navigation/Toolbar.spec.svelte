<script lang="ts">
	import ToolbarContainer from './ToolbarContainer.svelte';
	import ToolbarButton from './ToolbarButton.svelte';

	let isChecked = $state(false);
</script>

<ToolbarContainer>
	<ToolbarButton icon="add">Button 1</ToolbarButton>
	<ToolbarButton icon="check" toggleable bind:checked={isChecked}>
		Toggle Button ({isChecked ? 'On' : 'Off'})
	</ToolbarButton>
</ToolbarContainer>
