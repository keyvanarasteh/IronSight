import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Resizable from './Resizable.svelte';

describe('Resizable Component', () => {
	it('renders container', () => {
		const { container } = render(Resizable);
		const el = container.firstChild as HTMLElement;
		expect(el).not.toBeNull();
		expect(el).toHaveClass('relative');
	});

	it('renders edge handles', () => {
		const { container } = render(Resizable, { edges: ['right', 'bottom'] });
		const handles = container.querySelectorAll('.absolute.z-\\[3\\]');
		expect(handles.length).toBe(2);
	});
});
