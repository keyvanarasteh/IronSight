class QrsNetworkState {
	isOffline = $state(false);
	lastError = $state<string | null>(null);

	setOffline(error: string) {
		this.isOffline = true;
		this.lastError = error;
	}

	reset() {
		this.isOffline = false;
		this.lastError = null;
	}
}
export const qrsNetworkState = new QrsNetworkState();
