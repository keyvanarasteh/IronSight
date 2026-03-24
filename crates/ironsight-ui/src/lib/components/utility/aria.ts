/**
 * Live region manager for screen reader announcements.
 * Creates and manages visually hidden ARIA live regions.
 */

let statusRegion: HTMLDivElement | null = null;
let alertRegion: HTMLDivElement | null = null;

function ensureRegion(id: string, ariaLive: 'polite' | 'assertive'): HTMLDivElement {
	if (typeof document === 'undefined') {
		return null as any;
	}
	let region = document.getElementById(id) as HTMLDivElement;
	if (!region) {
		region = document.createElement('div');
		region.id = id;
		region.setAttribute('aria-live', ariaLive);
		region.setAttribute('aria-atomic', 'true');
		Object.assign(region.style, {
			position: 'absolute',
			width: '1px',
			height: '1px',
			padding: '0',
			margin: '-1px',
			overflow: 'hidden',
			clip: 'rect(0,0,0,0)',
			whiteSpace: 'nowrap',
			border: '0'
		});
		document.body.appendChild(region);
	}
	return region;
}

/**
 * Announce a message to screen readers (polite priority).
 * Used for status updates that don't interrupt the user.
 */
export function status(message: string): void {
	if (!statusRegion) statusRegion = ensureRegion('qix-aria-status', 'polite');
	if (statusRegion) {
		statusRegion.textContent = '';
		requestAnimationFrame(() => {
			if (statusRegion) statusRegion.textContent = message;
		});
	}
}

/**
 * Announce a message to screen readers (assertive priority).
 * Used for urgent alerts that interrupt the user.
 */
export function alert(message: string): void {
	if (!alertRegion) alertRegion = ensureRegion('qix-aria-alert', 'assertive');
	if (alertRegion) {
		alertRegion.textContent = '';
		requestAnimationFrame(() => {
			if (alertRegion) alertRegion.textContent = message;
		});
	}
}

/**
 * Clear all live region content.
 */
export function clear(): void {
	if (statusRegion) statusRegion.textContent = '';
	if (alertRegion) alertRegion.textContent = '';
}
