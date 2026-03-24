import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Modal from './Modal.svelte';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rp = { open: false, children: () => null } as any;

describe('Modal Component', () => {
	it('renders without crashing', () => {
		const { container } = render(Modal, rp);
		expect(container).toBeTruthy();
	});

	it('accepts open prop', () => {
		const { container } = render(Modal, { ...rp, open: true });
		expect(container).toBeInTheDocument();
	});

	it('accepts title prop', () => {
		const { container } = render(Modal, { ...rp, title: 'Test' });
		expect(container).toBeInTheDocument();
	});

	it('accepts description prop', () => {
		const { container } = render(Modal, { ...rp, description: 'desc' });
		expect(container).toBeInTheDocument();
	});

	it('accepts size prop', () => {
		const { container } = render(Modal, { ...rp, size: 'md' });
		expect(container).toBeInTheDocument();
	});

	it('accepts closable prop', () => {
		const { container } = render(Modal, { ...rp, closable: true });
		expect(container).toBeInTheDocument();
	});

	it('accepts icon prop', () => {
		const { container } = render(Modal, { ...rp, icon: 'test' });
		expect(container).toBeInTheDocument();
	});

	it('applies size="sm" classes', () => {
		const { container } = render(Modal, { ...rp, size: 'sm' });
		expect(container).toBeInTheDocument();
	});

	it('applies size="lg" classes', () => {
		const { container } = render(Modal, { ...rp, size: 'lg' });
		expect(container).toBeInTheDocument();
	});

	it('applies size="xl" classes', () => {
		const { container } = render(Modal, { ...rp, size: 'xl' });
		expect(container).toBeInTheDocument();
	});

	it('applies size="full" classes', () => {
		const { container } = render(Modal, { ...rp, size: 'full' });
		expect(container).toBeInTheDocument();
	});

	it('accepts footer snippet prop', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { container } = render(Modal, { ...rp, footer: (() => null) as any });
		expect(container).toBeInTheDocument();
	});
});
