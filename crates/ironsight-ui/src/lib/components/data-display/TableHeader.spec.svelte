<script lang="ts">
	import Table from './Table.svelte';
	import TableHeader from './TableHeader.svelte';
	import TableHeaderCell from './TableHeaderCell.svelte';
</script>

<Table>
	{#snippet header()}
		<TableHeader>
			<TableHeaderCell>Name</TableHeaderCell>
			<TableHeaderCell minWidth="100px">Value</TableHeaderCell>
		</TableHeader>
	{/snippet}
	{#snippet body()}
		<div></div>
	{/snippet}
</Table>
