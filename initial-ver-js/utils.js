// to prevent fetch on every key press we should implement delay and sent request only after user finished typing
const debounce = (callback, delay = 1000) => {
	// Debouncing input
	let timeoutId;
	return (...args) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => {
			//'.apply' - method for tracking input arguments for function
			callback.apply(null, args);
		}, delay);
	};
};
