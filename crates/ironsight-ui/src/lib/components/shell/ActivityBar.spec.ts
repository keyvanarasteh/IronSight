import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ActivityBar from './ActivityBar.svelte';
import { Search, Settings } from 'lucide-svelte';
import type { ActivityItem } from '../../types';

vi.mock('$lib/theme', () => ({
	getThemeContext: () => ({
		resolved: 'dark',
		setMode: vi.fn(),
		toggleTheme: vi.fn()
	})
}));

describe('ActivityBar', () => {
	const topItems: ActivityItem[] = [{ id: 'search', icon: Search, tooltip: 'Search' }];
	const bottomItems: ActivityItem[] = [{ id: 'settings', icon: Settings, tooltip: 'Settings' }];

	it('renders top and bottom items', () => {
		const { getByTitle } = render(ActivityBar, {
			activeSidebar: 'search',
			onSidebarChange: vi.fn(),
			topItems,
			bottomItems
		});

		expect(getByTitle('Search')).toBeInTheDocument();
		expect(getByTitle('Settings')).toBeInTheDocument();
	});

	it('highlights active item', () => {
		const { getByTitle } = render(ActivityBar, {
			activeSidebar: 'settings',
			onSidebarChange: vi.fn(),
			topItems,
			bottomItems
		});

		const searchBtn = getByTitle('Search');
		const settingsBtn = getByTitle('Settings');

		expect(searchBtn).toHaveClass('opacity-80');
		expect(settingsBtn).toHaveClass('opacity-100');
	});

	it('calls onSidebarChange when item clicked', async () => {
		const onSidebarChange = vi.fn();
		const { getByTitle } = render(ActivityBar, {
			activeSidebar: 'search',
			onSidebarChange,
			topItems,
			bottomItems
		});

		await fireEvent.click(getByTitle('Settings'));
		expect(onSidebarChange).toHaveBeenCalledWith('settings');
	});

	it('accepts topItems prop', () => {
		const { container } = render(ActivityBar, { topItems: [] });
		expect(container).toBeInTheDocument();
	});

	it('accepts bottomItems prop', () => {
		const { container } = render(ActivityBar, { bottomItems: [] });
		expect(container).toBeInTheDocument();
	});
});
