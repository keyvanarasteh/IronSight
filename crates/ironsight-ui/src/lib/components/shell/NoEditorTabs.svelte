<script lang="ts">
	let {
		class: className = ''
	}: {
		class?: string;
	} = $props();
</script>

<div
	class="bg-editor-bg border-border h-0 border-b {className}"
	role="presentation"
	aria-hidden="true"
></div>
