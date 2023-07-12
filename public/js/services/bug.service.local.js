import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const BUG_KEY = 'bugDB'

var gFilterBy = { title: '' }

_createBugs()

export const bugService = {
	query,
	get,
	getEmptyBug,
	save,
	remove,
	setFilterBy,
	getFilterBy,
}

window.bugService = bugService

function query() {
	return storageService.query(BUG_KEY)
}

function get(bugId) {
	return storageService.get(BUG_KEY, bugId)
}

function remove(bugId) {
	return storageService.remove(BUG_KEY, bugId)
}

function save(bug) {
	if (bug.id) {
		return storageService.put(BUG_KEY, bug)
	}
	return storageService.post(BUG_KEY, bug)
}

function getEmptyBug(title = '', severity = '') {
	return {
		id: '',
		title,
		severity,
	}
}

function setFilterBy(filterBy = {}) {
	if (filterBy.title !== undefined) gFilterBy.title = filterBy.title
	return gFilterBy
}

function getFilterBy() {
	return { ...gFilterBy }
}

function _createBugs() {
	let bugs = utilService.loadFromStorage(BUG_KEY)
	if (!bugs || !bugs.length) {
		bugs = []
		bugs.push(_createBug('Button is missing', 1))
		bugs.push(_createBug('Error while watching', 2))
		bugs.push(_createBug('Warning appears', 3))
		utilService.saveToStorage(BUG_KEY, bugs)
	}
}

function _createBug(title, severity) {
	const bug = getEmptyBug(title, severity)
	bug.id = utilService.makeId()
	return bug
}
