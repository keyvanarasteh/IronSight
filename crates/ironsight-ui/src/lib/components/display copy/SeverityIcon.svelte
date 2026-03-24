<script lang="ts">
	import { cn } from '../../utils';

	let {
		severity = 'info',
		size = 16,
		class: className,
		...rest
	}: {
		severity?: 'error' | 'warning' | 'info' | 'ignore';
		size?: number;
		class?: string;
		[key: string]: unknown;
	} = $props();

	const colors: Record<string, string> = {
		error: 'text-error-fg',
		warning: 'text-warning',
		info: 'text-info',
		ignore: 'text-foreground-muted'
	};

	const paths: Record<string, string> = {
		error:
			'M8 1a7 7 0 100 14A7 7 0 008 1zm0 1a6 6 0 110 12A6 6 0 018 2zm-.75 3h1.5v5h-1.5V5zm0 6h1.5v1.5h-1.5V11z',
		warning:
			'M7.56 1h.88l6.54 12.26-.44.74H1.44L1 13.26 7.56 1zM8 2.28L2.28 13h11.44L8 2.28zM7.25 6h1.5v4h-1.5V6zm0 5h1.5v1.5h-1.5V11z',
		info: 'M8 1a7 7 0 100 14A7 7 0 008 1zm0 1a6 6 0 110 12A6 6 0 018 2zm-.75 3h1.5v1.5h-1.5V5zm0 3h1.5v4h-1.5V8z',
		ignore: 'M8 1a7 7 0 100 14A7 7 0 008 1zm0 1a6 6 0 110 12A6 6 0 018 2z'
	};
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 16 16"
	fill="currentColor"
	class={cn(colors[severity], className)}
	aria-label={severity}
	{...rest}
>
	<path d={paths[severity]} />
</svg>
