<script lang="ts">
	let {
		color,
		text
	}: {
		color: string;
		text: string;
	} = $props();
</script>

<span style="color: {color}">{text}</span>
