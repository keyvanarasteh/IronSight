import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Dialog from './Dialog.svelte';

describe('Dialog Component', () => {
	it('renders nothing when closed', () => {
		const { container } = render(Dialog, { open: false, title: 'Test' });
		expect(container.querySelector('[role="dialog"]')).toBeNull();
	});

	it('renders when open', () => {
		const { container } = render(Dialog, { open: true, title: 'Confirm' });
		const dialog = container.querySelector('[role="dialog"]');
		expect(dialog).not.toBeNull();
	});

	it('displays title text', () => {
		render(Dialog, { open: true, title: 'Delete File?' });
		const heading = screen.getByText('Delete File?');
		expect(heading).not.toBeNull();
	});

	it('displays message and detail', () => {
		render(Dialog, {
			open: true,
			title: 'Test',
			message: 'Are you sure?',
			detail: 'This cannot be undone.'
		});
		expect(screen.getByText('Are you sure?')).not.toBeNull();
		expect(screen.getByText('This cannot be undone.')).not.toBeNull();
	});

	it('renders buttons', () => {
		render(Dialog, {
			open: true,
			title: 'Test',
			buttons: [
				{ label: 'OK', variant: 'primary' },
				{ label: 'Cancel', variant: 'secondary' }
			]
		});
		expect(screen.getByText('OK')).not.toBeNull();
		expect(screen.getByText('Cancel')).not.toBeNull();
	});

	it('shows type icon for warning', () => {
		render(Dialog, { open: true, title: 'Warning', type: 'warning' });
		expect(screen.getByText('⚠')).not.toBeNull();
	});

	it('applies custom class', () => {
		const { container } = render(Dialog, { open: true, title: 'T', class: 'my-dialog' });
		const dialog = container.querySelector('[role="dialog"]');
		expect(dialog).not.toBeNull();
		expect(dialog!).toHaveClass('my-dialog');
	});
});
