function _deepObjectOperation(
	target,
	callback,
	depthFirst,
	pathSoFar = []
) {
	function traverseDepth(target, callback, depthFirst, pathSoFar) {
		for (const [key, value] of Object.entries(target)) {
			const isObject = _isObject(value);
			if (isObject) {
				const path = [...pathSoFar, key];
				_deepObjectOperation(value, callback, depthFirst, path);
			}
		}
	}
	function traverseBreadth(target, callback, pathSoFar) {
		for (const [key, value] of Object.entries(target)) {
			const isObject = _isObject(value);
			const path = [...pathSoFar, key];
			callback(value, key, path, target, isObject);
		}
	}
	if (depthFirst) {
		traverseDepth(target, callback, depthFirst, pathSoFar);
		traverseBreadth(target, callback, pathSoFar);
	} else {
		traverseBreadth(target, callback, pathSoFar);
		traverseDepth(target, callback, depthFirst, pathSoFar);
	}
}

function _isObject(value) {
	return (
		value !== null && typeof value === 'object' && value.constructor === Object
	);
}

function _deepObjectTraverse(target, path, create = true) {
	path = [...path];
	let step;
	while ((step = path.shift())) {
		if (!_isObject(target[step])) {
			if (create) target[step] = {};
			else return undefined;
		} else if (isPrototypePolluted(step)) continue;
		target = target[step];
	}
	return target;
}

function isPrototypePolluted(key) {
    return ['__proto__', 'constructor', 'prototype'].includes(key);
}

module.exports = {
  _deepObjectOperation,
  _isObject,
  _deepObjectTraverse
}
