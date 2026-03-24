import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import NotificationsToasts from './NotificationsToasts.svelte';

describe('NotificationsToasts', () => {
	it('renders log role', () => {
		const { getByRole } = render(NotificationsToasts);
		expect(getByRole('log')).toBeInTheDocument();
	});

	it('has polite aria-live', () => {
		const { getByRole } = render(NotificationsToasts);
		expect(getByRole('log')).toHaveAttribute('aria-live', 'polite');
	});

	it('auto-generated test for variant bottom-right', () => {
		const { container } = render(NotificationsToasts, { position: 'bottom-right' });
		expect(container).toBeInTheDocument();
	});

	it('auto-generated test for variant bottom-left', () => {
		const { container } = render(NotificationsToasts, { position: 'bottom-left' });
		expect(container).toBeInTheDocument();
	});

	it('auto-generated test for variant top-right', () => {
		const { container } = render(NotificationsToasts, { position: 'top-right' });
		expect(container).toBeInTheDocument();
	});

	it('auto-generated test for variant top-left', () => {
		const { container } = render(NotificationsToasts, { position: 'top-left' });
		expect(container).toBeInTheDocument();
	});

	it('accepts maxVisible prop', () => {
		const { container } = render(NotificationsToasts, { maxVisible: 3 });
		expect(container).toBeInTheDocument();
	});
});
