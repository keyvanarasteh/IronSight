<script lang="ts">
	import Table from './Table.svelte';
	import TableHeader from './TableHeader.svelte';
	import TableHeaderCell from './TableHeaderCell.svelte';
	import TableBody from './TableBody.svelte';
	import TableRow from './TableRow.svelte';
	import TableCell from './TableCell.svelte';
</script>

<div class="h-[200px] w-[500px]">
	<Table zebra bordered>
		{#snippet caption()}<caption>Test Caption</caption>{/snippet}
		{#snippet header()}
			<TableHeader>
				<TableHeaderCell class="w-[50%]">Column 1</TableHeaderCell>
				<TableHeaderCell class="w-[50%]">Column 2</TableHeaderCell>
			</TableHeader>
		{/snippet}

		{#snippet body()}
			<TableBody>
				<TableRow>
					<TableCell>Data 1</TableCell>
					<TableCell>Data 2</TableCell>
				</TableRow>
				<TableRow>
					<TableCell>Data 3</TableCell>
					<TableCell>Data 4</TableCell>
				</TableRow>
			</TableBody>
		{/snippet}
	</Table>
</div>
