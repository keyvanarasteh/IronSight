<script lang="ts">
	import SplitLayout from './SplitLayout.svelte';
</script>

<SplitLayout>
	{#snippet start()}
		<div>Start Pane</div>
	{/snippet}
	{#snippet end()}
		<div>End Pane</div>
	{/snippet}
</SplitLayout>
