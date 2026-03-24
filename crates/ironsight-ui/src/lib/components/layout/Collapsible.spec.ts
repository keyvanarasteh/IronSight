import { render, fireEvent } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import CollapsibleTest from './Collapsible.spec.svelte';
import Collapsible from './Collapsible.svelte';

describe('Collapsible Component', () => {
	it('renders heading and handles toggle', async () => {
		const { getByText, getByRole, container } = render(CollapsibleTest);

		expect(getByText('Test Section')).not.toBeNull();
		const header = getByRole('button');
		expect(header.getAttribute('aria-expanded')).toBe('false');

		expect(container.textContent).not.toContain('The body content');

		await fireEvent.click(header);
		expect(header.getAttribute('aria-expanded')).toBe('true');
		expect(container.textContent).toContain('The body content');
	});

	it('accepts heading prop', () => {
		const { container } = render(Collapsible, { heading: '' });
		expect(container).toBeInTheDocument();
	});

	it('accepts description prop', () => {
		const { container } = render(Collapsible, { description: '' });
		expect(container).toBeInTheDocument();
	});

	it('accepts open prop', () => {
		const { container } = render(Collapsible, { open: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts alwaysShowHeaderActions prop', () => {
		const { container } = render(Collapsible, { alwaysShowHeaderActions: false });
		expect(container).toBeInTheDocument();
	});

	it('renders actions snippet', () => {
		const { container } = render(CollapsibleTest);
		expect(container.querySelector('.collapsible-action')).toBeInTheDocument();
	});

	it('renders decorations snippet', () => {
		const { container } = render(CollapsibleTest);
		expect(container.querySelector('.collapsible-decoration')).toBeInTheDocument();
	});
});
