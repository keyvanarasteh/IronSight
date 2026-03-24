import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import BentoGrid from './BentoGrid.svelte';

describe('BentoGrid Component', () => {
	it('renders default 4-column layout with placeholders', () => {
		const { container } = render(BentoGrid);
		const el = container.firstElementChild as HTMLElement;
		expect(el).not.toBeNull();
		expect(el).toHaveClass('grid-cols-1', 'gap-2');
		expect(el.className).toContain('md:grid-cols-4');

		const items = container.querySelectorAll('.rounded-lg');
		expect(items.length).toBe(4);
	});

	it('renders 6-column layout', () => {
		const { container } = render(BentoGrid, { columns: 6 });
		const el = container.firstElementChild as HTMLElement;
		expect(el.className).toContain('md:grid-cols-6');

		const items = container.querySelectorAll('.rounded-lg');
		expect(items.length).toBe(6);
	});

	it('renders custom items', () => {
		const customItems = [
			{ title: 'Test 1', content: 'Desc 1', className: 'custom-1' },
			{ title: 'Test 2', content: 'Desc 2', className: 'custom-2' }
		];
		const { container, getByText } = render(BentoGrid, { items: customItems });

		expect(getByText('Test 1')).not.toBeNull();
		expect(getByText('Test 2')).not.toBeNull();

		const itemElements = container.querySelectorAll('.rounded-lg');
		expect(itemElements.length).toBe(2);
		expect(itemElements[0]).toHaveClass('custom-1');
		expect(itemElements[1]).toHaveClass('custom-2');
	});

	it('supports custom gap', () => {
		const { container } = render(BentoGrid, { gap: '4' });
		const el = container.firstElementChild as HTMLElement;
		expect(el).toHaveClass('gap-4');
	});

	it('reflects variant prop layout classes', () => {
		const { container } = render(BentoGrid, { variant: '2' });
		const items = container.querySelectorAll('.rounded-lg');
		// preset 2 for 4-col sets md:col-span-3 for the first item
		expect(items[0]).toHaveClass('md:col-span-3');
	});

	it('respects explicitly provided layout prop', () => {
		const layout = [{ colSpan: 2, rowSpan: 2 }];
		const { container } = render(BentoGrid, { layout, items: [{ title: 'Custom' }] });
		const item = container.querySelector('.rounded-lg') as HTMLElement;
		expect(item).not.toBeNull();
		expect(item.className).toContain('md:col-span-2');
		expect(item.className).toContain('md:row-span-2');
	});

	it('respects custom itemHeight prop', () => {
		const { container } = render(BentoGrid, { itemHeight: 'h-64' });
		const items = container.querySelectorAll('.rounded-lg');
		expect(items[0]).toHaveClass('h-64');
	});

	it('hides placeholders when showPlaceholders is false', () => {
		const { container } = render(BentoGrid, { showPlaceholders: false, items: [] });
		const items = container.querySelectorAll('.rounded-lg');
		expect(items.length).toBe(0);
	});

	it('accepts layout prop', () => {
		const { container } = render(BentoGrid, { layout: 'test' });
		expect(container).toBeInTheDocument();
	});
});
