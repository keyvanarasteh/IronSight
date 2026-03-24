import { render, fireEvent } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import TabSubTest from './TabSub.spec.svelte';

describe('TabHeader and TabPanel Components', () => {
	it('renders tab headers with tab role', () => {
		const { container } = render(TabSubTest);
		const tabs = container.querySelectorAll('[role="tab"]');
		expect(tabs.length).toBe(2);
	});

	it('renders first tab as selected by default', () => {
		const { container } = render(TabSubTest);
		const tabs = container.querySelectorAll('[role="tab"]');
		expect(tabs[0]!.getAttribute('aria-selected')).toBe('true');
		expect(tabs[1]!.getAttribute('aria-selected')).toBe('false');
	});

	it('renders first panel content by default', () => {
		const { getByText, queryByText } = render(TabSubTest);
		expect(getByText('Panel One Content')).not.toBeNull();
		expect(queryByText('Panel Two Content')).toBeNull();
	});

	it('switches panels when clicking another tab', async () => {
		const { container, getByText, queryByText } = render(TabSubTest);
		const tabs = container.querySelectorAll('[role="tab"]');

		await fireEvent.click(tabs[1]!);

		expect(queryByText('Panel One Content')).toBeNull();
		expect(getByText('Panel Two Content')).not.toBeNull();
		expect(tabs[1]!.getAttribute('aria-selected')).toBe('true');
	});

	it('renders tabpanel with tabpanel role', () => {
		const { container } = render(TabSubTest);
		const panel = container.querySelector('[role="tabpanel"]');
		expect(panel).not.toBeNull();
	});

	it('renders tab header text', () => {
		const { getByText } = render(TabSubTest);
		expect(getByText('Tab One')).not.toBeNull();
		expect(getByText('Tab Two')).not.toBeNull();
	});
});
