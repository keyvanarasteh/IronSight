import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import AnimatedContainer from './AnimatedContainer.svelte';

describe('AnimatedContainer Component', () => {
	it('renders container', () => {
		const { container } = render(AnimatedContainer);
		const el = container.firstChild as HTMLElement;
		expect(el).not.toBeNull();
		expect(el).toHaveClass('overflow-hidden');
	});

	it('applies custom class', () => {
		const { container } = render(AnimatedContainer, { class: 'my-anim' });
		const el = container.firstChild as HTMLElement;
		expect(el).toHaveClass('my-anim');
	});

	it('accepts expanded prop', () => {
		const { container } = render(AnimatedContainer, { expanded: true });
		expect(container).toBeInTheDocument();
	});

	it('accepts duration prop', () => {
		const { container } = render(AnimatedContainer, { duration: 200 });
		expect(container).toBeInTheDocument();
	});
});
