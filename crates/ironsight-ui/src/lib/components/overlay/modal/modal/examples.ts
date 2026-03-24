export const modalExamples = [
	{
		name: 'Small',
		description: 'Compact dialog',
		props: { title: 'Confirm Delete', description: 'Are you sure?', size: 'sm' },
		slot: 'This action cannot be undone.'
	},
	{
		name: 'Medium (default)',
		description: 'Standard modal',
		props: { title: 'Edit Profile', size: 'md', icon: 'Settings' },
		slot: 'Form content goes here.'
	},
	{
		name: 'Large',
		description: 'Wide content modal',
		props: { title: 'Data Preview', size: 'lg', icon: 'Eye' },
		slot: 'Table or complex content here.'
	},
	{
		name: 'Extra large',
		description: 'Dashboard-width modal',
		props: { title: 'Analytics', size: 'xl' },
		slot: 'Charts, grids, etc.'
	},
	{
		name: 'Fullscreen',
		description: 'Edge-to-edge overlay',
		props: { title: 'Full Editor', size: 'full', icon: 'Settings' },
		slot: 'Full editor view.'
	},
	{
		name: 'No close button',
		description: 'Forced interaction',
		props: { title: 'License Agreement', closable: false },
		slot: 'You must accept to continue.'
	}
];
