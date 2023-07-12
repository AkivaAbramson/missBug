'use strict'

import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const PAGE_SIZE = 5
const BUG_KEY = 'bugDB'

_createBugs()

export const bugService = {
    query,
    getById,
    remove,
    save,
    getEmptyBug,
    downloadPDF,
}

const BASE_URL = '/api/bug/'

function query(filterBy = {title: '', severity:0, labels: []}, sortBy = {type: '', dir: 1}) {
    return axios.get(BASE_URL, { params:{ ...filterBy, ...sortBy}}).then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId).then(res => res.data)

}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId).then(res => res.data)

}

function save(bug) {
    
    
    if (bug._id) {
        return axios.put(BASE_URL + bug._id, bug).then(res => res.data)
    } else {
        return axios.post(BASE_URL, bug).then(res => res.data)
    }
    
}

function getEmptyBug(title = '', severity = 1, description = "", createdAt = Date.now(), labels = ['critical', 'need-CR', 'dev-branch'] ) {
    return { _id: '', title, severity, description, createdAt, labels }
}

function _createBugs() {
    let bugs = utilService.loadFromStorage(BUG_KEY)
    if (!bugs || !bugs.length) {
        bugs = []
        bugs.push(_createBug('scary',1,'Button is missing'))
        bugs.push(_createBug('big', 2,'Error while watching'))
        bugs.push(_createBug('small',3,'Warning appears'))
        utilService.saveToStorage(BUG_KEY, bugs)
    }
}

function _createBug(title, severity, description, createdAt, labels) {
    const bug = getEmptyBug(title, severity, description, createdAt, labels)
    bug._id = utilService.makeId()
    return bug
}

function downloadPDF() {
    return axios.get('api/download').then((res) => res.data)
  }

