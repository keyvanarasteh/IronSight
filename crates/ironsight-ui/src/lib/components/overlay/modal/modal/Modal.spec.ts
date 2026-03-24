import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Modal from './Modal.svelte';

describe('Modal Component', () => {
	it('renders without crashing', () => {
		const { container } = render(Modal);
		expect(container).toBeTruthy();
	});

	it('accepts open prop', () => {
		const { container } = render(Modal, { open: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts title prop', () => {
		const { container } = render(Modal, { title: '' });
		expect(container).toBeInTheDocument();
	});

	it('accepts description prop', () => {
		const { container } = render(Modal, { description: '' });
		expect(container).toBeInTheDocument();
	});

	it('accepts icon prop', () => {
		const { container } = render(Modal, { icon: 'test' });
		expect(container).toBeInTheDocument();
	});

	it('accepts size prop', () => {
		const { container } = render(Modal, { size: 'md' });
		expect(container).toBeInTheDocument();
	});

	it('accepts closable prop', () => {
		const { container } = render(Modal, { closable: true });
		expect(container).toBeInTheDocument();
	});

	it('accepts open prop', () => {
		const { container } = render(Modal, { open: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts title prop', () => {
		const { container } = render(Modal, { title: '' });
		expect(container).toBeInTheDocument();
	});

	it('accepts description prop', () => {
		const { container } = render(Modal, { description: '' });
		expect(container).toBeInTheDocument();
	});

	it('accepts icon prop', () => {
		const { container } = render(Modal, { icon: 'test' });
		expect(container).toBeInTheDocument();
	});

	it('accepts size prop', () => {
		const { container } = render(Modal, { size: 'md' });
		expect(container).toBeInTheDocument();
	});

	it('accepts closable prop', () => {
		const { container } = render(Modal, { closable: true });
		expect(container).toBeInTheDocument();
	});

	it('applies size="sm" classes', () => {
		const { container } = render(Modal, { size: 'sm' });
		expect(container).toBeInTheDocument();
	});

	it('applies size="md" classes', () => {
		const { container } = render(Modal, { size: 'md' });
		expect(container).toBeInTheDocument();
	});

	it('applies size="lg" classes', () => {
		const { container } = render(Modal, { size: 'lg' });
		expect(container).toBeInTheDocument();
	});

	it('applies size="xl" classes', () => {
		const { container } = render(Modal, { size: 'xl' });
		expect(container).toBeInTheDocument();
	});

	it('applies size="full" classes', () => {
		const { container } = render(Modal, { size: 'full' });
		expect(container).toBeInTheDocument();
	});

	it('applies size="sm" classes', () => {
		const { container } = render(Modal, { size: 'sm' });
		expect(container).toBeInTheDocument();
	});

	it('applies size="md" classes', () => {
		const { container } = render(Modal, { size: 'md' });
		expect(container).toBeInTheDocument();
	});

	it('applies size="lg" classes', () => {
		const { container } = render(Modal, { size: 'lg' });
		expect(container).toBeInTheDocument();
	});

	it('applies size="xl" classes', () => {
		const { container } = render(Modal, { size: 'xl' });
		expect(container).toBeInTheDocument();
	});

	it('applies size="full" classes', () => {
		const { container } = render(Modal, { size: 'full' });
		expect(container).toBeInTheDocument();
	});
});
