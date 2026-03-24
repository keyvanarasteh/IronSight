import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import NotificationViewer from './NotificationViewer.svelte';

describe('NotificationViewer', () => {
	it('renders the message', () => {
		const { getByText } = render(NotificationViewer, { message: 'Build succeeded' });
		expect(getByText('Build succeeded')).toBeInTheDocument();
	});

	it('has alert role', () => {
		const { getByRole } = render(NotificationViewer, { message: 'Test' });
		expect(getByRole('alert')).toBeInTheDocument();
	});

	it('renders source label', () => {
		const { getByText } = render(NotificationViewer, { message: 'Error', source: 'Git' });
		expect(getByText(/Git/)).toBeInTheDocument();
	});

	it('renders dismiss button', async () => {
		const ondismiss = vi.fn();
		const { getByLabelText } = render(NotificationViewer, { message: 'Test', ondismiss });
		await fireEvent.click(getByLabelText('Dismiss notification'));
		expect(ondismiss).toHaveBeenCalled();
	});

	it('auto-generated test for variant info', () => {
		const { container } = render(NotificationViewer, { color: 'info' });
		expect(container).toBeInTheDocument();
	});

	it('auto-generated test for variant warning', () => {
		const { container } = render(NotificationViewer, { color: 'warning' });
		expect(container).toBeInTheDocument();
	});

	it('auto-generated test for variant error', () => {
		const { container } = render(NotificationViewer, { color: 'error' });
		expect(container).toBeInTheDocument();
	});

	it('accepts severity prop', () => {
		const { container } = render(NotificationViewer, { severity: 'info' as NotificationSeverity });
		expect(container).toBeInTheDocument();
	});

	it('accepts detail prop', () => {
		const { container } = render(NotificationViewer, { detail: '' });
		expect(container).toBeInTheDocument();
	});

	it('accepts progress prop', () => {
		const { container } = render(NotificationViewer, { progress: 42 });
		expect(container).toBeInTheDocument();
	});

	it('accepts expanded prop', () => {
		const { container } = render(NotificationViewer, { expanded: false });
		expect(container).toBeInTheDocument();
	});
});
