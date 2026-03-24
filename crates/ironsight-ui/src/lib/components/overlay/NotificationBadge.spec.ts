import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import NotificationBadge from './NotificationBadge.svelte';

describe('NotificationBadge', () => {
	it('renders count', () => {
		const { getByText } = render(NotificationBadge, { count: 5 });
		expect(getByText('5')).toBeInTheDocument();
	});

	it('hides when count is 0', () => {
		const { container } = render(NotificationBadge, { count: 0 });
		expect(container.textContent?.trim()).toBe('');
	});
});
