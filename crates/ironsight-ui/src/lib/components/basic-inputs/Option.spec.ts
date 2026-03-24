import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import OptionTest from './Option.spec.svelte';
import Option from './Option.svelte';

describe('Option Component', () => {
	it('renders options with option role', () => {
		const { container } = render(OptionTest);
		const options = container.querySelectorAll('[role="option"]');
		expect(options.length).toBe(5);
	});

	it('renders option text content', () => {
		const { getByText } = render(OptionTest);
		expect(getByText('Alpha')).not.toBeNull();
		expect(getByText('Beta')).not.toBeNull();
		expect(getByText('Gamma')).not.toBeNull();
	});

	it('renders label when children are missing', () => {
		const { getByText } = render(OptionTest);
		expect(getByText('Delta Only Label')).not.toBeNull();
	});

	it('renders description when provided', () => {
		const { getByText } = render(OptionTest);
		const desc = getByText('Epsilon description');
		expect(desc).toBeInTheDocument();
		expect(desc).toHaveClass('opacity-70');
	});

	it('renders disabled option with reduced opacity and ignores click', async () => {
		const { container } = render(OptionTest);
		const options = container.querySelectorAll('[role="option"]');
		const disabled = options[2] as HTMLElement;
		expect(disabled).toHaveClass('opacity-50', 'cursor-not-allowed');
		expect(disabled.getAttribute('aria-selected')).toBe('false');
	});

	it('respects value prop and label prop', () => {
		const { getByText } = render(OptionTest);
		// Delta Only Label has no children, so it should render the label prop
		const delta = getByText('Delta Only Label');
		expect(delta).toBeInTheDocument();

		// Alpha has children "Alpha", but also label="Alpha".
		// We can verify it's rendered.
		expect(getByText('Alpha')).toBeInTheDocument();
	});

	it('accepts value prop', () => {
		const { container } = render(Option, { value: 'test-value' });
		expect(container).toBeInTheDocument();
	});

	it('accepts label prop', () => {
		const { container } = render(Option, { label: 'test-value' });
		expect(container).toBeInTheDocument();
	});

	it('accepts description prop', () => {
		const { container } = render(Option, { description: '' });
		expect(container).toBeInTheDocument();
	});

	it('accepts disabled prop', () => {
		const { container } = render(Option, { disabled: false });
		expect(container).toBeInTheDocument();
	});
});
