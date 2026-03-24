<script lang="ts">
	import Tabs from './Tabs.svelte';
	import TabHeader from './TabHeader.svelte';
	import TabPanel from './TabPanel.svelte';
</script>

<Tabs selectedIndex={0}>
	{#snippet header()}
		<TabHeader>Tab One</TabHeader>
		<TabHeader>Tab Two</TabHeader>
	{/snippet}

	<TabPanel>Panel One Content</TabPanel>
	<TabPanel>Panel Two Content</TabPanel>
</Tabs>
