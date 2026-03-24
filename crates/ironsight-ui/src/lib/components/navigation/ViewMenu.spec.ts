import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ViewMenu from './ViewMenu.svelte';

describe('ViewMenu', () => {
	it('renders trigger button', () => {
		const { getByLabelText } = render(ViewMenu);
		expect(getByLabelText('View actions')).toBeInTheDocument();
	});

	it('opens menu on click', async () => {
		const { getByLabelText, getByRole } = render(ViewMenu, {
			items: [{ label: 'Sort by Name' }]
		});
		await fireEvent.click(getByLabelText('View actions'));
		expect(getByRole('menu')).toBeInTheDocument();
	});
});
