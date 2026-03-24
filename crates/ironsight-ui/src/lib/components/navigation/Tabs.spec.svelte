<script lang="ts">
	import Tabs from './Tabs.svelte';
	import TabHeader from './TabHeader.svelte';
	import TabPanel from './TabPanel.svelte';
</script>

<Tabs>
	{#snippet header()}
		<TabHeader>Header 1</TabHeader>
		<TabHeader>Header 2</TabHeader>
	{/snippet}

	<TabPanel>Panel 1</TabPanel>
	<TabPanel>Panel 2</TabPanel>
</Tabs>
