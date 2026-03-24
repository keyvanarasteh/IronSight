<script lang="ts">
	import Button from './Button.svelte';
</script>

{#snippet descriptionSnippet()}
	<span id="test-description">Description Text</span>
{/snippet}

<Button description={descriptionSnippet}>Button with Description</Button>
