import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Separator from './Separator.svelte';

describe('Separator Component', () => {
	it('renders as a simple separator by default', () => {
		const { getByRole, container } = render(Separator);
		const sep = getByRole('separator');
		expect(sep).not.toBeNull();
		expect(sep).toHaveClass('h-[1px]', 'w-full', 'rounded-full', 'bg-border');
		expect(sep.getAttribute('aria-orientation')).toBe('horizontal');
	});

	it('applies gradient style when specified', () => {
		const { getByRole } = render(Separator, { gradient: true });
		const sep = getByRole('separator');
		expect(sep).toHaveClass('bg-gradient-to-r');
	});

	it('applies custom classes', () => {
		const { getByRole } = render(Separator, { class: 'mb-4' });
		const sep = getByRole('separator');
		expect(sep).toHaveClass('mb-4');
	});

	it('accepts label snippet prop without error', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { container } = render(Separator, { label: (() => null) as any });
		expect(container).toBeInTheDocument();
	});
});
