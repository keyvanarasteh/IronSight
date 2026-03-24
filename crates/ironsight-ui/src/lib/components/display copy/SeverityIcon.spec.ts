import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import SeverityIcon from './SeverityIcon.svelte';

describe('SeverityIcon Component', () => {
	it('renders svg element', () => {
		const { container } = render(SeverityIcon, { severity: 'error' });
		const svg = container.querySelector('svg');
		expect(svg).not.toBeNull();
	});

	it('applies error color class', () => {
		const { container } = render(SeverityIcon, { severity: 'error' });
		const svg = container.querySelector('svg');
		expect(svg!).toHaveClass('text-error-fg');
	});

	it('applies warning color class', () => {
		const { container } = render(SeverityIcon, { severity: 'warning' });
		const svg = container.querySelector('svg');
		expect(svg!).toHaveClass('text-warning');
	});

	it('applies info color class', () => {
		const { container } = render(SeverityIcon, { severity: 'info' });
		const svg = container.querySelector('svg');
		expect(svg!).toHaveClass('text-info');
	});

	it('applies muted color for ignore', () => {
		const { container } = render(SeverityIcon, { severity: 'ignore' });
		const svg = container.querySelector('svg');
		expect(svg!).toHaveClass('text-foreground-muted');
	});

	it('accepts size prop', () => {
		const { container } = render(SeverityIcon, { size: 16 });
		expect(container).toBeInTheDocument();
	});
});
