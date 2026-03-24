import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import SidebarSection from './SidebarSection.svelte';

describe('SidebarSection', () => {
	it('renders title', () => {
		const { getByText } = render(SidebarSection, { title: 'EXPLORER' });
		expect(getByText('EXPLORER')).toBeInTheDocument();
	});

	it('toggles open state', async () => {
		const { getByRole, container } = render(SidebarSection, { title: 'EXPLORER', open: false });

		const btn = getByRole('button');
		expect(container.innerHTML).not.toContain('chevron-down'); // using lucide internal classes proxy check

		await fireEvent.click(btn);
		// Assuming children renders or chevron class changes when open
		expect(container.innerHTML).toContain('lucide-chevron-down');
	});
});
