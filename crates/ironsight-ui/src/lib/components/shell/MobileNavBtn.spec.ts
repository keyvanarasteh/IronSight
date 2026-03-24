import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import MobileNavBtn from './MobileNavBtn.svelte';
import { Search } from 'lucide-svelte';

describe('MobileNavBtn', () => {
	it('renders correctly', () => {
		const { container } = render(MobileNavBtn, { icon: Search });
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	it('shows active state correctly', () => {
		const { getByRole } = render(MobileNavBtn, { icon: Search, active: true });
		expect(getByRole('button')).toHaveClass('bg-primary/10');
	});

	it('handles click events', async () => {
		const onclick = vi.fn();
		const { getByRole } = render(MobileNavBtn, { icon: Search, onclick });

		const btn = getByRole('button');
		await fireEvent.click(btn);

		expect(onclick).toHaveBeenCalledOnce();
	});

	it('calls onclick handler', async () => {
		const onclick = vi.fn();
		const { container } = render(MobileNavBtn, { onclick });
		const el = container.querySelector('*');
		if (el) await fireEvent.click(el);
		expect(onclick).toHaveBeenCalled();
	});
});
