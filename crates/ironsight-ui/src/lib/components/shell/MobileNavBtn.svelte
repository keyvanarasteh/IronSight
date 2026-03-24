<script lang="ts">
	import type { IconComponent } from '../../types';

	let {
		icon: Icon,
		active = false,
		onclick
	}: {
		icon: IconComponent;
		active?: boolean;
		onclick?: () => void;
	} = $props();
</script>

<button
	{onclick}
	class="m-0 flex flex-col items-center justify-center rounded-lg border-none bg-transparent p-2 transition-colors
	{active
		? 'bg-primary/10 text-sidebar-foreground'
		: 'text-sidebar-foreground/40 hover:bg-sidebar-accent/50'}"
>
	<Icon size={20} />
</button>
