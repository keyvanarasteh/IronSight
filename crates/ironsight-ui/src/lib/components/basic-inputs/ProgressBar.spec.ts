import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import ProgressBar from './ProgressBar.svelte';

describe('ProgressBar Component', () => {
	it('renders generic indeterminate state by default', () => {
		const { getByRole } = render(ProgressBar);
		const progress = getByRole('progressbar');
		expect(progress).not.toBeNull();
		expect(progress.getAttribute('aria-valuenow')).toBeNull();
	});

	it('renders determinate state when value is provided', () => {
		const { getByRole } = render(ProgressBar, { value: 50, max: 100 });
		const progress = getByRole('progressbar');
		expect(progress.getAttribute('aria-valuenow')).toBe('50');
		expect(progress.getAttribute('aria-valuemax')).toBe('100');
	});

	it('forces indeterminate mode if indeterminate prop is set even with value', () => {
		const { getByRole } = render(ProgressBar, { value: 50, indeterminate: true });
		const progress = getByRole('progressbar');
		expect(progress.getAttribute('aria-valuenow')).toBeNull();
	});

	it('accepts longRunningThreshold prop', () => {
		const { getByRole } = render(ProgressBar, { longRunningThreshold: 5000 });
		const progress = getByRole('progressbar');
		expect(progress).not.toBeNull();
	});

	it('accepts ariaLabel prop', () => {
		const { getByRole } = render(ProgressBar, { ariaLabel: 'Loading data' });
		const progress = getByRole('progressbar');
		expect(progress).not.toBeNull();
	});
});
