globalThis.addEventListener('visibilitychange', () => {
	console.log(new Date().toLocaleString(), document.visibilityState)
})
