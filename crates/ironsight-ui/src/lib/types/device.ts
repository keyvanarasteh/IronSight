// ── Device Detection Types ──────────────────────────────

export interface BrowserInfo {
	name: string;
	version: string;
	engine?: string;
	engineVersion?: string;
}

export interface OSInfo {
	name: string;
	version: string;
	versionName?: string;
}

export interface DeviceInfo {
	type: string;
	vendor: string;
	model: string;
	isMobile: boolean;
	isTablet: boolean;
	isPhone: boolean;
	isDesktop: boolean;
	isSmartTV?: boolean;
	isConsole?: boolean;
	isWearable?: boolean;
	isTouchable?: boolean;
	mobileGrade?: string;
	isPhoneSized?: boolean;
}

export interface ScreenInfo {
	width: number;
	height: number;
	dpi: number;
	inchWidth: number;
	inchHeight: number;
	orientation: 'portrait' | 'landscape';
	type: string;
}

export interface EngineInfo {
	name: string;
	version: string;
}

export interface CPUInfo {
	architecture: string | undefined;
}

export interface CombinedDeviceInfo {
	uaParserResult: unknown;
	browser: BrowserInfo;
	os: OSInfo;
	device: DeviceInfo;
	screen: ScreenInfo;
	engine: EngineInfo;
	cpu: CPUInfo;
	userAgent: string;
	timestamp: string;
}

// ── Extended Interfaces (method-enriched) ────────────────

export interface ExtendedBrowserInfo extends BrowserInfo {
	major: string;
	type: string;
	isChrome: boolean;
	chromeVersion?: number;
	chromeVersionStr?: string;
	is(value: string): boolean;
	toString(): string;
	withClientHints(): Promise<ExtendedBrowserInfo> | ExtendedBrowserInfo;
	withFeatureCheck(): Promise<ExtendedBrowserInfo> | ExtendedBrowserInfo;
}

export interface ExtendedDeviceInfo extends DeviceInfo {
	uaParserResult: unknown;
	userAgents?: string[];
	platformVendor?: string;
	platformModel?: string;
	matchAndroid?: boolean;
	is(value: string): boolean;
	toString(): string;
	withClientHints(): Promise<ExtendedDeviceInfo> | ExtendedDeviceInfo;
	withFeatureCheck(): Promise<ExtendedDeviceInfo> | ExtendedDeviceInfo;
}

export interface ExtendedOSInfo extends OSInfo {
	is(value: string): boolean;
	toString(): string;
	withClientHints(): Promise<ExtendedOSInfo> | ExtendedOSInfo;
	withFeatureCheck(): Promise<ExtendedOSInfo> | ExtendedOSInfo;
}

export interface ExtendedCPUInfo extends CPUInfo {
	is(value: string): boolean;
	toString(): string;
	withClientHints(): Promise<ExtendedCPUInfo> | ExtendedCPUInfo;
	withFeatureCheck(): Promise<ExtendedCPUInfo> | ExtendedCPUInfo;
}

export interface ExtendedEngineInfo extends EngineInfo {
	is(value: string): boolean;
	toString(): string;
	withClientHints(): Promise<ExtendedEngineInfo> | ExtendedEngineInfo;
	withFeatureCheck(): Promise<ExtendedEngineInfo> | ExtendedEngineInfo;
}
