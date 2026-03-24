import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import PanelPart from './PanelPart.svelte';

describe('PanelPart', () => {
	it('renders region element', () => {
		const { getByRole } = render(PanelPart, {
			tabs: [{ id: 'terminal', label: 'Terminal' }]
		});
		expect(getByRole('region')).toBeInTheDocument();
	});

	it('renders tabs', () => {
		const { getByText } = render(PanelPart, {
			tabs: [
				{ id: 'terminal', label: 'Terminal' },
				{ id: 'output', label: 'Output' }
			]
		});
		expect(getByText('Terminal')).toBeInTheDocument();
		expect(getByText('Output')).toBeInTheDocument();
	});

	it('accepts activeTab prop', () => {
		const { container } = render(PanelPart, { activeTab: '' });
		expect(container).toBeInTheDocument();
	});

	it('accepts visible prop', () => {
		const { container } = render(PanelPart, { visible: true });
		expect(container).toBeInTheDocument();
	});

	it('accepts position prop', () => {
		const { container } = render(PanelPart, { position: 'bottom' as 'bottom' | 'left' | 'right' });
		expect(container).toBeInTheDocument();
	});

	it('accepts maximized prop', () => {
		const { container } = render(PanelPart, { maximized: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts height prop', () => {
		const { container } = render(PanelPart, { height: 250 });
		expect(container).toBeInTheDocument();
	});
});
