import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import AuxiliaryBar from './AuxiliaryBar.svelte';

describe('AuxiliaryBar', () => {
	it('renders aside element', () => {
		const { container } = render(AuxiliaryBar, { title: 'Chat' });
		expect(container.querySelector('aside')).not.toBeNull();
	});

	it('renders title', () => {
		const { getByText } = render(AuxiliaryBar, { title: 'Chat' });
		expect(getByText('Chat')).toBeInTheDocument();
	});

	it('hides when visible is false', () => {
		const { container } = render(AuxiliaryBar, { visible: false });
		expect(container.querySelector('aside')).toBeNull();
	});

	it('has aria-label', () => {
		const { getByLabelText } = render(AuxiliaryBar, { title: 'Copilot' });
		expect(getByLabelText('Copilot')).toBeInTheDocument();
	});

	it('accepts position prop', () => {
		const { container } = render(AuxiliaryBar, { position: 'right' as 'left' | 'right' });
		expect(container).toBeInTheDocument();
	});

	it('accepts width prop', () => {
		const { container } = render(AuxiliaryBar, { width: 300 });
		expect(container).toBeInTheDocument();
	});

	it('accepts minWidth prop', () => {
		const { container } = render(AuxiliaryBar, { minWidth: 170 });
		expect(container).toBeInTheDocument();
	});

	it('accepts maximized prop', () => {
		const { container } = render(AuxiliaryBar, { maximized: false });
		expect(container).toBeInTheDocument();
	});
});
