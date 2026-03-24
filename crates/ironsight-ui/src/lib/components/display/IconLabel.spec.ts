import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import IconLabel from './IconLabel.svelte';

describe('IconLabel Component', () => {
	it('renders label text', () => {
		render(IconLabel, { label: 'index.ts' });
		expect(screen.getByText('index.ts')).not.toBeNull();
	});

	it('renders description', () => {
		render(IconLabel, { label: 'file.ts', description: 'TypeScript file' });
		expect(screen.getByText('TypeScript file')).not.toBeNull();
	});

	it('applies custom class', () => {
		const { container } = render(IconLabel, { label: 'Test', class: 'my-icon-label' });
		const el = container.firstChild as HTMLElement;
		expect(el).toHaveClass('my-icon-label');
	});

	it('accepts icon prop', () => {
		const { container } = render(IconLabel, { icon: 'test' });
		expect(container).toBeInTheDocument();
	});

	it('accepts decorations prop', () => {
		const { container } = render(IconLabel, { decorations: [] });
		expect(container).toBeInTheDocument();
	});

	it('accepts suffix snippet prop', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { container } = render(IconLabel, { suffix: (() => null) as any });
		expect(container).toBeInTheDocument();
	});
});
