import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Icon from './Icon.svelte';

describe('Icon Component', () => {
	it('renders as presentation span by default', () => {
		const { container } = render(Icon, { name: 'add' });
		const span = container.querySelector('span[role="presentation"]');
		expect(span).not.toBeNull();
		const innerSpan = span!.querySelector('.codicon.codicon-add');
		expect(innerSpan).not.toBeNull();
	});

	it('renders as a button when actionIcon is true', () => {
		const { getByRole } = render(Icon, { name: 'add', actionIcon: true, label: 'Add Item' });
		const button = getByRole('button');
		expect(button).not.toBeNull();
		expect(button.getAttribute('aria-label')).toBe('Add Item');
	});

	it('respects size prop', () => {
		const { container } = render(Icon, { name: 'add', size: 24 });
		const innerSpan = container.querySelector('.codicon.codicon-add') as HTMLElement;
		expect(innerSpan.style.fontSize).toBe('24px');
		expect(innerSpan.style.width).toBe('24px');
		expect(innerSpan.style.height).toBe('24px');
	});

	it('applies spin animation when spin is true', () => {
		const { container } = render(Icon, { name: 'add', spin: true });
		const innerSpan = container.querySelector('.codicon.codicon-add') as HTMLElement;
		expect(innerSpan).toHaveClass('animate-icon-spin');
	});

	it('respects spinDuration prop', () => {
		const { container } = render(Icon, { name: 'add', spin: true, spinDuration: 2 });
		const innerSpan = container.querySelector('.codicon.codicon-add') as HTMLElement;
		expect(innerSpan.style.animationDuration).toBe('2s');
	});
});
