import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import ThemeProvider from './ThemeProvider.svelte';

describe('ThemeProvider Component', () => {
	it('renders without crashing', () => {
		const { container } = render(ThemeProvider);
		expect(container).toBeTruthy();
	});

	it('accepts theme prop', () => {
		const { container } = render(ThemeProvider, { theme: 'system' });
		expect(container).toBeInTheDocument();
	});

	it('accepts storageKey prop', () => {
		const { container } = render(ThemeProvider, { storageKey: 'qix-theme' });
		expect(container).toBeInTheDocument();
	});
});
