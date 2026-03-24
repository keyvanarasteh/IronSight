import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import FormContainerTest from './FormContainer.spec.svelte';

describe('FormContainer Component', () => {
	it('renders container', () => {
		const { getByText } = render(FormContainerTest);
		expect(getByText('Container Content')).not.toBeNull();
	});
});
