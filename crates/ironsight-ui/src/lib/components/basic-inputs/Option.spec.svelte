<script lang="ts">
	import Select from './Select.svelte';
	import Option from './Option.svelte';
</script>

<Select placeholder="Pick one">
	<Option value="a" label="Alpha">Alpha</Option>
	<Option value="b" label="Beta">Beta</Option>
	<Option value="c" label="Gamma" disabled>Gamma</Option>
	<Option value="d" label="Delta Only Label" />
	<Option value="e" label="Epsilon" description="Epsilon description" />
</Select>
