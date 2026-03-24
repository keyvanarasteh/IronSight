<script lang="ts">
	import Tree from './Tree.svelte';
	import TreeItem from './TreeItem.svelte';
</script>

<Tree>
	<TreeItem branch open>
		{#snippet iconBranch()}<span class="icon-branch">📁</span>{/snippet}
		{#snippet iconBranchOpened()}<span class="icon-branch-opened">📂</span>{/snippet}
		{#snippet children()}Parent Node{/snippet}
		{#snippet description()}<span class="tree-description">A parent item</span>{/snippet}
		{#snippet actions()}<button class="tree-action">Edit</button>{/snippet}
		{#snippet decoration()}<span class="tree-decoration">★</span>{/snippet}
		{#snippet nestedItems()}
			<TreeItem>
				{#snippet iconLeaf()}<span class="icon-leaf">📄</span>{/snippet}
				{#snippet children()}Leaf Node{/snippet}
			</TreeItem>
		{/snippet}
	</TreeItem>
	<TreeItem>
		{#snippet children()}Simple Leaf{/snippet}
	</TreeItem>
</Tree>
