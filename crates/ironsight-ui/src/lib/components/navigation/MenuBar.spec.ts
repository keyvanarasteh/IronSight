import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import MenuBar from './MenuBar.svelte';

describe('MenuBar Component', () => {
	it('renders with menubar role', () => {
		const { container } = render(MenuBar, { items: [] });
		const bar = container.querySelector('[role="menubar"]');
		expect(bar).not.toBeNull();
	});

	it('renders menu items', () => {
		render(MenuBar, {
			items: [
				{ label: 'File', submenu: [] },
				{ label: 'Edit', submenu: [] }
			]
		});
		expect(screen.getByText('ile')).not.toBeNull(); // "F" is in a span
		expect(screen.getByText('dit')).not.toBeNull();
	});

	it('applies menu-bg class', () => {
		const { container } = render(MenuBar, { items: [] });
		const bar = container.querySelector('[role="menubar"]');
		expect(bar!).toHaveClass('bg-menu-bg');
	});
});
