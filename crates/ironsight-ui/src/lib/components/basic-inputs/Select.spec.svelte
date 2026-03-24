<script lang="ts">
	import Select from './Select.svelte';
	import Option from './Option.svelte';

	let val = $state('1');
</script>

<Select bind:value={val}>
	<Option value="1" label="Option 1" />
	<Option value="2" label="Option 2" />
	<Option value="3" label="Option 3" />
</Select>
