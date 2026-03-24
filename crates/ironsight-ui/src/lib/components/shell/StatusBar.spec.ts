import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import StatusBar from './StatusBar.svelte';

describe('StatusBar', () => {
	const props = {
		branch: 'main',
		errors: 0,
		warnings: 2,
		language: 'TypeScript',
		encoding: 'UTF-8',
		indentSize: 4
	};

	it('renders all metrics', () => {
		const { getByText } = render(StatusBar, props);

		expect(getByText('main')).toBeInTheDocument();
		expect(getByText('0')).toBeInTheDocument();
		expect(getByText('2')).toBeInTheDocument();

		expect(getByText('TypeScript')).toBeInTheDocument();
		expect(getByText('UTF-8')).toBeInTheDocument();
		expect(getByText('Spaces: 4')).toBeInTheDocument();
	});

	it('uses default values', () => {
		const { getByText } = render(StatusBar, {
			branch: 'dev',
			errors: 1,
			warnings: 0,
			language: 'JavaScript'
		});

		// Falls back to spaces 2 and UTF-8
		expect(getByText('Spaces: 2')).toBeInTheDocument();
		expect(getByText('UTF-8')).toBeInTheDocument();
	});

	it('accepts encoding prop', () => {
		const { container } = render(StatusBar, { encoding: 'UTF-8' });
		expect(container).toBeInTheDocument();
	});

	it('accepts indentSize prop', () => {
		const { container } = render(StatusBar, { indentSize: 2 });
		expect(container).toBeInTheDocument();
	});
});
