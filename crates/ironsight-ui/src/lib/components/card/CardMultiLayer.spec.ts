import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import CardMultiLayer from './CardMultiLayer.svelte';

describe('CardMultiLayer Component', () => {
	it('renders with default props', () => {
		const { container, getByText, getByRole } = render(CardMultiLayer);

		const el = container.firstElementChild as HTMLElement;
		expect(el).toHaveClass('group', 'relative');
		expect(el.style.perspective).toBe('1000px');

		expect(getByText('Multi-Layer')).not.toBeNull();
		expect(
			getByText(
				'Hover to reveal the depth of the stack. This pattern is excellent for representing collections or gamified elements.'
			)
		).not.toBeNull();

		const btn = getByRole('button');
		expect(btn.textContent?.trim()).toBe('Action');
	});

	it('renders with custom props', () => {
		const { getByText, getByRole, container } = render(CardMultiLayer, {
			title: 'Custom Title',
			description: 'Custom Desc',
			actionLabel: 'Click Me',
			class: 'custom-layer'
		});

		const el = container.firstElementChild as HTMLElement;
		expect(el).toHaveClass('custom-layer');

		expect(getByText('Custom Title')).not.toBeNull();
		expect(getByText('Custom Desc')).not.toBeNull();
		const btn = getByRole('button');
		expect(btn.textContent?.trim()).toBe('Click Me');
	});

	it('renders with icon snippet', async () => {
		// Import createRawSnippet to create a mock snippet for testing Svelte 5 snippets directly
		const { createRawSnippet } = await import('svelte');
		const iconSnippet = createRawSnippet(() => ({
			render: () => '<svg data-testid="my-icon"></svg>'
		}));

		const { getByTestId } = render(CardMultiLayer, { icon: iconSnippet });
		expect(getByTestId('my-icon')).not.toBeNull();
	});
});
