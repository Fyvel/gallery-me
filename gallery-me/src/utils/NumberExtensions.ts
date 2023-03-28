export { }
Number.prototype.toDuration = function () {
	const hours = Math.floor(+this / 60)
	const minutes = +this % 60
	return hours
		? `${hours}h ${minutes}m`
		: `${minutes}m`
}
