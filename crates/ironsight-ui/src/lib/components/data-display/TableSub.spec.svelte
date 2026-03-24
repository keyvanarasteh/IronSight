<script lang="ts">
	import Table from './Table.svelte';
	import TableBody from './TableBody.svelte';
	import TableRow from './TableRow.svelte';
	import TableCell from './TableCell.svelte';
</script>

<Table>
	{#snippet body()}
		<TableBody>
			<TableRow>
				<TableCell>Cell A</TableCell>
				<TableCell columnLabel="Col">Cell B</TableCell>
			</TableRow>
		</TableBody>
	{/snippet}
</Table>
