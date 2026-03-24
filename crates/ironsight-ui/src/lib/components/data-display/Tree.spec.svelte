<script lang="ts">
	import Tree from './Tree.svelte';
	import TreeItem from './TreeItem.svelte';

	let branch1Open = $state(false);
</script>

<div class="h-[300px] w-[300px]">
	<Tree onSelect={(items) => console.log('Selected:', items)}>
		<TreeItem branch bind:open={branch1Open}>
			Branch 1
			{#snippet nestedItems()}
				<TreeItem>Leaf 1-1</TreeItem>
				<TreeItem>Leaf 1-2</TreeItem>
			{/snippet}
		</TreeItem>

		<TreeItem>
			Leaf 2
			{#snippet description()}
				<span>This is a description</span>
			{/snippet}
		</TreeItem>
	</Tree>
</div>
