export const formInputExamples = [
	{ name: 'Basic', description: 'Plain text input', props: { placeholder: 'Enter your name...' } },
	{
		name: 'With label',
		description: 'Labeled input',
		props: { label: 'Email', placeholder: 'email@example.com', type: 'email' }
	},
	{
		name: 'With icon',
		description: 'Leading icon input',
		props: { label: 'Search', placeholder: 'Search...', leadingIcon: 'Search' }
	},
	{
		name: 'Error state',
		description: 'Validation error',
		props: { label: 'Username', value: 'ab', error: 'Must be at least 3 characters' }
	},
	{
		name: 'With hint',
		description: 'Helper text below',
		props: {
			label: 'Password',
			type: 'password',
			placeholder: '••••••••',
			hint: 'At least 8 characters'
		}
	},
	{
		name: 'Small',
		description: 'Compact size',
		props: { size: 'sm', placeholder: 'Small input...' }
	},
	{
		name: 'Large',
		description: 'Prominent size',
		props: { size: 'lg', label: 'Full Name', placeholder: 'John Doe' }
	},
	{
		name: 'Disabled',
		description: 'Non-interactive',
		props: { label: 'Locked', value: 'Cannot edit', disabled: true }
	}
];
