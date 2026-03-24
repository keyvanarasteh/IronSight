import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import DragImage from './DragImage.svelte';

describe('DragImage Component', () => {
	it('renders drag preview element', () => {
		const { container } = render(DragImage);
		const el = container.firstChild as HTMLElement;
		expect(el).not.toBeNull();
		expect(el).toHaveClass('inline-flex');
	});

	it('renders label text', () => {
		const { container } = render(DragImage, { label: 'file.ts' });
		const label = container.querySelector('span');
		expect(label).not.toBeNull();
		expect(label!.textContent).toBe('file.ts');
	});
});
