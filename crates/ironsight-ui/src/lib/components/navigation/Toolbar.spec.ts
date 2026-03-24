import { render, fireEvent } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import ToolbarTest from './Toolbar.spec.svelte';

describe('Toolbar Components', () => {
	it('renders toolbar buttons and handles toggle', async () => {
		const { getByText, getByRole } = render(ToolbarTest);

		expect(getByText('Button 1')).not.toBeNull();

		const toggleBtn = getByRole('switch');
		expect(toggleBtn.getAttribute('aria-checked')).toBe('false');

		await fireEvent.click(toggleBtn);

		expect(toggleBtn.getAttribute('aria-checked')).toBe('true');
	});
});
