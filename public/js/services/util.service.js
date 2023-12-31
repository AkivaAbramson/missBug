export const utilService = {
	makeId,
	makeLorem,
	getRandomIntInclusive,
	loadFromStorage,
	saveToStorage,
	padNum,
	getDayName,
	getMonthName,
	animateCSS,
	debounce,
}

function makeId(length = 6) {
	var txt = ''
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

	for (var i = 0; i < length; i++) {
		txt += possible.charAt(Math.floor(Math.random() * possible.length))
	}

	return txt
}

function makeLorem(size = 100) {
	var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
	var txt = ''
	while (size > 0) {
		size--
		txt += words[Math.floor(Math.random() * words.length)] + ' '
	}
	return txt
}

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
}

function saveToStorage(key, value) {
	localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
	const data = localStorage.getItem(key)
	return data ? JSON.parse(data) : undefined
}

function padNum(num) {
	return num > 9 ? num + '' : '0' + num
}

function getDayName(date, locale) {
	date = new Date(date)
	return date.toLocaleDateString(locale, { weekday: 'long' })
}

function getMonthName(date) {
	const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	return monthNames[date.getMonth()]
}

function animateCSS(el, animation) {
	return new Promise((resolve) => {
		const animationName = `animate__${animation}`
		el.classList.add(`animate__animated`, animationName)
		el.addEventListener('animationend', handleAnimationEnd, { once: true })

		// When the animation ends, we clean the classes and resolve the Promise
		function handleAnimationEnd(event) {
			event.stopPropagation()
			el.classList.remove(`${prefix}animated`, animationName)
			resolve('Animation ended')
		}
	})
}

// debounce calls a function when a user has not carried
// out an event in a specific amount of time
function debounce(fn, wait) {
    let timer
    return function (...args) {
        if (timer) {
            clearTimeout(timer) // clear any pre-existing timer
        }
        const context = this // get the current context
        timer = setTimeout(() => {
            fn.apply(context, args) // call the function if time expires
        }, wait)
    }
}
