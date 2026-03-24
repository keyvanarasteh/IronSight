<script lang="ts">
	import { cn } from '../../utils';

	let {
		class: className,
		...rest
	}: {
		class?: string;
		[key: string]: unknown;
	} = $props();
</script>

<div
	role="alert"
	aria-live="assertive"
	class={cn('m-0 block h-[28px] w-[28px] outline-none', className)}
	{...rest}
>
	<svg class="h-full w-full" viewBox="0 0 16 16">
		<circle class="fill-none stroke-transparent stroke-2" cx="8px" cy="8px" r="7px"></circle>
		<circle
			class="stroke-primary animate-spin-infinite fill-none stroke-2"
			style="stroke-linecap: square; transform-origin: 50% 50%;"
			cx="8px"
			cy="8px"
			r="7px"
		></circle>
	</svg>
</div>

<style>
	@keyframes spin-infinite {
		0% {
			stroke-dasharray: 0.01px 43.97px;
			transform: rotate(-90deg);
		}
		50% {
			stroke-dasharray: 21.99px 21.99px;
			transform: rotate(360deg);
		}
		100% {
			stroke-dasharray: 0.01px 43.97px;
			transform: rotate(990deg);
		}
	}

	.animate-spin-infinite {
		transition: all 0.2s ease-in-out;
		animation: spin-infinite 2s linear infinite;
	}
</style>
