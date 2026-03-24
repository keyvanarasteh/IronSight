import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Button from './Button.svelte';

describe('Button Component', () => {
	it('renders without crashing', () => {
		const { container } = render(Button);
		expect(container).toBeTruthy();
	});

	it('calls onclick handler', async () => {
		const onclick = vi.fn();
		const { container } = render(Button, { onclick });
		const el = container.querySelector('*');
		if (el) await fireEvent.click(el);
		expect(onclick).toHaveBeenCalled();
	});

	it('accepts variant prop', () => {
		const { container } = render(Button, { variant: 'default' });
		expect(container).toBeInTheDocument();
	});

	it('accepts size prop', () => {
		const { container } = render(Button, { size: 'default' });
		expect(container).toBeInTheDocument();
	});

	it('accepts href prop', () => {
		const { container } = render(Button, { href: 'test-value' });
		expect(container).toBeInTheDocument();
	});

	it('calls onclick handler', async () => {
		const onclick = vi.fn();
		const { container } = render(Button, { onclick });
		const el = container.querySelector('*');
		if (el) await fireEvent.click(el);
		expect(onclick).toHaveBeenCalled();
	});
});
