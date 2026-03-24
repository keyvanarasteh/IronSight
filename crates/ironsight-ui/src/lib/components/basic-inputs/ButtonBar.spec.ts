import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import ButtonBar from './ButtonBar.svelte';

describe('ButtonBar Component', () => {
	it('renders with right alignment by default', () => {
		const { container } = render(ButtonBar);
		const bar = container.firstChild as HTMLElement;
		expect(bar).not.toBeNull();
		expect(bar).toHaveClass('justify-end');
	});

	it('renders with left alignment', () => {
		const { container } = render(ButtonBar, { alignment: 'left' });
		const bar = container.firstChild as HTMLElement;
		expect(bar).toHaveClass('justify-start');
	});

	it('renders with center alignment', () => {
		const { container } = render(ButtonBar, { alignment: 'center' });
		const bar = container.firstChild as HTMLElement;
		expect(bar).toHaveClass('justify-center');
	});

	it('renders explicitly with right alignment', () => {
		const { container } = render(ButtonBar, { alignment: 'right' });
		const bar = container.firstChild as HTMLElement;
		expect(bar).toHaveClass('justify-end');
	});
});
