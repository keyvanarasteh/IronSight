/**
 * A permissive icon component type that accepts both Svelte 4 class constructors
 * (lucide-svelte) and Svelte 5 functional Components.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import type { ComponentType, SvelteComponent, Component } from 'svelte';
export type IconProps = {
	size?: number | string;
	color?: string;
	class?: string;
	strokeWidth?: number | string;
	absoluteStrokeWidth?: boolean;
	[key: string]: unknown;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IconComponent = ComponentType<SvelteComponent> | Component<any>;

export interface FileItem {
	name: string;
	icon: IconComponent;
	lang: string;
}

export interface ActivityItem {
	id: string;
	icon: IconComponent;
	tooltip: string;
}
