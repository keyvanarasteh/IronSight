import { render, fireEvent } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import TreeItemTest from './TreeItem.spec.svelte';
import TreeItem from './TreeItem.svelte';

describe('TreeItem Component', () => {
	it('renders tree items with treeitem role', () => {
		const { container } = render(TreeItemTest);
		const items = container.querySelectorAll('[role="treeitem"]');
		expect(items.length).toBeGreaterThanOrEqual(2);
	});

	it('renders branch node with aria-expanded', () => {
		const { container } = render(TreeItemTest);
		const branch = container.querySelector('[aria-expanded]');
		expect(branch).not.toBeNull();
		expect(branch!.getAttribute('aria-expanded')).toBe('true');
	});

	it('renders leaf node text', () => {
		const { getByText } = render(TreeItemTest);
		expect(getByText('Parent Node')).not.toBeNull();
		expect(getByText('Leaf Node')).not.toBeNull();
		expect(getByText('Simple Leaf')).not.toBeNull();
	});

	it('renders nested items inside branch', () => {
		const { container } = render(TreeItemTest);
		const group = container.querySelector('[role="group"]');
		expect(group).not.toBeNull();
	});

	it('accepts branch prop', () => {
		const { container } = render(TreeItem, { branch: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts open prop', () => {
		const { container } = render(TreeItem, { open: false });
		expect(container).toBeInTheDocument();
	});

	it('renders iconBranch snippet', () => {
		const { container } = render(TreeItemTest);
		expect(container.querySelector('.icon-branch')).toBeInTheDocument();
	});

	it('renders iconBranchOpened snippet', () => {
		const { container } = render(TreeItemTest);
		expect(container.querySelector('.icon-branch-opened')).toBeInTheDocument();
	});

	it('renders iconLeaf snippet', () => {
		const { container } = render(TreeItemTest);
		expect(container.querySelector('.icon-leaf')).toBeInTheDocument();
	});

	it('renders description snippet', () => {
		const { container } = render(TreeItemTest);
		expect(container.querySelector('.tree-description')).toBeInTheDocument();
	});

	it('renders actions snippet', () => {
		const { container } = render(TreeItemTest);
		expect(container.querySelector('.tree-action')).toBeInTheDocument();
	});

	it('renders decoration snippet', () => {
		const { container } = render(TreeItemTest);
		expect(container.querySelector('.tree-decoration')).toBeInTheDocument();
	});
});
