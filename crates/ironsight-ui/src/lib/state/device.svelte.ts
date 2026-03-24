// ── Device Store (Svelte 5 Runes) ────────────────────────
// Reactive class pattern per svelte-reactivity.md
// Lazy-loads all detection libs on first use per svelte.lazy.loading.md

import { browser } from '$app/environment';
import type {
	CombinedDeviceInfo,
	ExtendedBrowserInfo,
	ExtendedCPUInfo,
	ExtendedDeviceInfo,
	ExtendedEngineInfo,
	ExtendedOSInfo,
	ScreenInfo
} from '$lib/types/device';


class DeviceStore {
	// #detector = $state<DeviceScreenDetector | null>(null);
	#browser = $state<ExtendedBrowserInfo | null>(null);
	#os = $state<ExtendedOSInfo | null>(null);
	#device = $state<ExtendedDeviceInfo | null>(null);
	#cpu = $state<ExtendedCPUInfo | null>(null);
	#engine = $state<ExtendedEngineInfo | null>(null);
	#screen = $state<ScreenInfo | null>(null);
	#userAgent = $state('');
	#ready = $state(false);

	constructor() {
		if (browser) {
			this.init();
		}
	}

	private async init() {
		this.#userAgent = navigator.userAgent;
		this.#browser = { name: 'Browser', version: '1.0' } as any;
		this.#os = { name: 'OS', version: '1.0' } as any;
		this.#device = { type: 'desktop', vendor: 'unknown', model: 'unknown', isMobile: false, isTablet: false, isPhone: false, isDesktop: true, isTouchable: navigator.maxTouchPoints > 0 } as any;
		this.#cpu = { architecture: 'amd64' } as any;
		this.#engine = { name: 'Engine', version: '1.0' } as any;
		this.#screen = { width: window.innerWidth, height: window.innerHeight, dpi: 96, inchWidth: 0, inchHeight: 0, orientation: 'landscape', type: 'desktop' };
		this.#ready = true;

		// Throttled resize listener
		let ticking = false;
		window.addEventListener(
			'resize',
			() => {
				if (!ticking) {
					requestAnimationFrame(() => {
						this.#screen = { width: window.innerWidth, height: window.innerHeight, dpi: 96, inchWidth: 0, inchHeight: 0, orientation: 'landscape', type: 'desktop' };
						ticking = false;
					});
					ticking = true;
				}
			},
			{ passive: true }
		);
	}

	public refresh() {
		this.#screen = { width: window.innerWidth, height: window.innerHeight, dpi: 96, inchWidth: 0, inchHeight: 0, orientation: 'landscape', type: 'desktop' };
	}

	/** Serialize current state for session device capture */
	public getSnapshot(): CombinedDeviceInfo | null {
		if (!this.#ready) return null;
		return {
			uaParserResult: (this.#device as ExtendedDeviceInfo)?.uaParserResult ?? null,
			browser: this.#browser ?? { name: 'unknown', version: 'unknown' },
			os: this.#os ?? { name: 'unknown', version: 'unknown' },
			device: this.#device ?? {
				type: 'unknown',
				vendor: 'unknown',
				model: 'unknown',
				isMobile: false,
				isTablet: false,
				isPhone: false,
				isDesktop: true
			},
			screen: this.#screen ?? {
				width: 0,
				height: 0,
				dpi: 0,
				inchWidth: 0,
				inchHeight: 0,
				orientation: 'portrait',
				type: 'unknown'
			},
			engine: this.#engine ?? { name: 'unknown', version: 'unknown' },
			cpu: this.#cpu ?? { architecture: undefined },
			userAgent: this.#userAgent,
			timestamp: new Date().toISOString()
		};
	}

	// ── Getters ──────────────────────────────────────────
	get browserInfo() {
		return this.#browser;
	}
	get os() {
		return this.#os;
	}
	get device() {
		return this.#device;
	}
	get cpu() {
		return this.#cpu;
	}
	get engine() {
		return this.#engine;
	}
	get screen() {
		return this.#screen;
	}
	get userAgent() {
		return this.#userAgent;
	}
	get ready() {
		return this.#ready;
	}

	// ── Derived Conveniences ─────────────────────────────
	get isMobile() {
		return this.#device?.isMobile ?? false;
	}
	get isDesktop() {
		return this.#device?.isDesktop ?? true;
	}
	get isTablet() {
		return this.#device?.isTablet ?? false;
	}
	get isTouchable() {
		return this.#device?.isTouchable ?? false;
	}
	get screenType() {
		return this.#screen?.type ?? 'unknown';
	}
	get orientation() {
		return this.#screen?.orientation ?? 'landscape';
	}
}

export const deviceStore = new DeviceStore();
