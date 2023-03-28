export { }
String.prototype.toKebabCase = function () {
	return (this || '')
		.trim()
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.replace(/[\s_'`^]+/g, '-')
		.toLowerCase()
}

String.prototype.toNumber = function () {
	return +(this || '')
}
