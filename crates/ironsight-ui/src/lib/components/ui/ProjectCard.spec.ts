import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import ProjectCard from './ProjectCard.svelte';

describe('ProjectCard Component', () => {
	it('renders without crashing', () => {
		const { container } = render(ProjectCard);
		expect(container).toBeTruthy();
	});
});
