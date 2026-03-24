<script lang="ts">
	import Collapsible from './Collapsible.svelte';
</script>

<Collapsible heading="Test Section" description="A description">
	{#snippet actions()}<button class="collapsible-action">Action</button>{/snippet}
	{#snippet decorations()}<span class="collapsible-decoration">3</span>{/snippet}
	<div class="p-2">The body content</div>
</Collapsible>
