<script lang="ts">
	import { cn } from '../../utils';
	import { onDestroy } from 'svelte';

	let {
		value,
		max = 100,
		indeterminate = false,
		longRunningThreshold = 15000,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		ariaLabel = '',
		class: className,
		...rest
	}: {
		value?: number;
		max?: number;
		indeterminate?: boolean;
		longRunningThreshold?: number;
		ariaLabel?: string;
		class?: string;
		[key: string]: unknown;
	} = $props();

	let longRunning = $state(false);
	let timeoutId: ReturnType<typeof setTimeout> | undefined;

	let isDeterminate = $derived(!indeterminate && typeof value === 'number' && isFinite(value));

	let clampedValue = $derived.by(() => {
		const maximum = max > 0 ? max : 100;
		if (isDeterminate) {
			return Math.min(Math.max(value ?? 0, 0), maximum);
		}
		return 0;
	});

	let percent = $derived.by(() => {
		const maximum = max > 0 ? max : 100;
		return isDeterminate ? (clampedValue / maximum) * 100 : 0;
	});

	$effect(() => {
		if (!isDeterminate && longRunningThreshold > 0) {
			if (!timeoutId) {
				timeoutId = setTimeout(() => {
					longRunning = true;
				}, longRunningThreshold);
			}
		} else {
			if (timeoutId) {
				clearTimeout(timeoutId);
				timeoutId = undefined;
			}
			longRunning = false;
		}
	});

	onDestroy(() => {
		if (timeoutId) clearTimeout(timeoutId);
	});
</script>

<div
	role="progressbar"
	aria-valuemin="0"
	aria-valuemax={max}
	aria-valuenow={isDeterminate ? Math.round(clampedValue) : undefined}
	class={cn('relative block h-[2px] w-full overflow-hidden outline-none', className)}
	{...rest}
>
	<div class="absolute inset-0 bg-transparent"></div>
	<div
		class={cn(
			'bg-primary indicator absolute top-0 bottom-0 left-0 h-full will-change-transform',
			isDeterminate ? 'transition-[width] duration-100 ease-linear' : 'w-[2%]',
			!isDeterminate && !longRunning ? 'animate-vscode-progress' : '',
			!isDeterminate && longRunning ? 'animate-vscode-progress-steps' : ''
		)}
		style={isDeterminate ? `width: ${percent}%;` : ''}
	></div>
</div>

<style>
	@keyframes vscode-progress {
		from {
			transform: translateX(0%) scaleX(1);
		}
		50% {
			transform: translateX(2500%) scaleX(3);
		}
		to {
			transform: translateX(4900%) scaleX(1);
		}
	}

	.animate-vscode-progress {
		animation: vscode-progress 4s linear infinite;
		transform: translate3d(0px, 0px, 0px);
	}

	.animate-vscode-progress-steps {
		animation: vscode-progress 4s steps(100) infinite;
		transform: translate3d(0px, 0px, 0px);
	}

	@media (prefers-reduced-motion: reduce) {
		.indicator {
			transition: none !important;
		}
		.animate-vscode-progress,
		.animate-vscode-progress-steps {
			animation: none !important;
			width: 100% !important;
		}
	}
</style>
