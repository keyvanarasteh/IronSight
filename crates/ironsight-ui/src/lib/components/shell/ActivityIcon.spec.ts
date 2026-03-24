import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ActivityIcon from './ActivityIcon.svelte';
import { Search } from 'lucide-svelte';

describe('ActivityIcon', () => {
	it('renders correctly', () => {
		const { container } = render(ActivityIcon, { icon: Search });
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	it('shows active state correctly', () => {
		const { container } = render(ActivityIcon, { icon: Search, active: true });
		expect(container.querySelector('.bg-activitybar-active-border')).toBeInTheDocument();
		const btn = container.querySelector('button');
		expect(btn).toBeTruthy();
		expect(btn!).toHaveClass('opacity-100');
	});

	it('handles click events', async () => {
		const onclick = vi.fn();
		const { getByRole } = render(ActivityIcon, { icon: Search, onclick });

		const btn = getByRole('button');
		await fireEvent.click(btn);

		expect(onclick).toHaveBeenCalledOnce();
	});

	it('renders tooltip title', () => {
		const { getByRole } = render(ActivityIcon, { icon: Search, tooltip: 'Search Files' });
		expect(getByRole('button')).toHaveAttribute('title', 'Search Files');
	});

	it('calls onclick handler', async () => {
		const onclick = vi.fn();
		const { container } = render(ActivityIcon, { onclick });
		const el = container.querySelector('*');
		if (el) await fireEvent.click(el);
		expect(onclick).toHaveBeenCalled();
	});
});
