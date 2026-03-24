import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import NotificationsCenter from './NotificationsCenter.svelte';

describe('NotificationsCenter', () => {
	it('renders region when visible', () => {
		const { getByRole } = render(NotificationsCenter, { visible: true });
		expect(getByRole('region')).toBeInTheDocument();
	});

	it('does not render when not visible', () => {
		const { queryByRole } = render(NotificationsCenter, { visible: false });
		expect(queryByRole('region')).toBeNull();
	});

	it('accepts title prop', () => {
		const { container } = render(NotificationsCenter, { title: 'Notifications' });
		expect(container).toBeInTheDocument();
	});

	it('accepts count prop', () => {
		const { container } = render(NotificationsCenter, { count: 0 });
		expect(container).toBeInTheDocument();
	});
});
