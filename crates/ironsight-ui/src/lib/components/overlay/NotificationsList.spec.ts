import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import NotificationsList from './NotificationsList.svelte';

describe('NotificationsList', () => {
	it('renders list role', () => {
		const { getByRole } = render(NotificationsList);
		expect(getByRole('list')).toBeInTheDocument();
	});

	it('shows empty message when no children', () => {
		const { getByText } = render(NotificationsList);
		expect(getByText('No notifications')).toBeInTheDocument();
	});

	it('accepts emptyMessage prop', () => {
		const { container } = render(NotificationsList, { emptyMessage: 'No notifications' });
		expect(container).toBeInTheDocument();
	});
});
