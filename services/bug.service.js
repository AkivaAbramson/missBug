import fs from 'fs'
import { utilService } from './util.service.js'

export const bugService = {
    query,
    getById,
    remove,
    save
}

const PAGE_SIZE = 4
const bugs = utilService.readJsonFile('data/bugs.json')

function query(filterBy, sortBy) {
    const regex = new RegExp(filterBy.title, 'i')

    let filteredBugs
    filteredBugs = bugs.filter(bug => regex.test(bug.title))
    if(+filterBy.severity >= 1 && +filterBy.severity <= 3){

        filteredBugs = filteredBugs.filter(bug => bug.severity === +filterBy.severity)
    }
    if(filterBy.labels && filterBy.labels.length){
        filteredBugs = filteredBugs.filter((bug) => filterBy.labels.every((label) => bug.labels?.includes(label)))
    }

    if (sortBy.type) {
        const diff = sortBy.dir
        switch (sortBy.type) {
          case 'title':
            filteredBugs.sort((bugA, bugB) => bugA.title.localeCompare(bugB.title) * diff)
            break
          case 'severity':
            filteredBugs.sort((bugA, bugB) => (bugA.severity - bugB.severity) * diff)
            break
          case 'createdAt':
            filteredBugs.sort((bugA, bugB) => (bugA.createdAt - bugB.createdAt) * diff)
            break
        }
      }

    
    if(filterBy.pageIdx !== undefined) {
        const startPageIdx = filterBy.pageIdx * PAGE_SIZE
        filteredBugs = filteredBugs.slice(startPageIdx, startPageIdx + PAGE_SIZE)
    }
    return Promise.resolve(filteredBugs)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId, loggedinUser) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject('No Such Bug')
    const bug = bugs[idx]
    if (!loggedinUser.isAdmin &&
        bug.owner._id !== loggedinUser._id) return Promise.reject('Not your Bug')
    bugs.splice(idx, 1)
    return _saveBugsToFile()
}

function save(bug, loggedinUser) {
    if (bug._id) {
        const idx = bugs.findIndex(currBug => currBug._id === bug._id)
        if (idx === -1) throw new Error('No such bug')
        if (!loggedinUser.isAdmin 
            && bugs[idx].owner._id !== loggedinUser._id) return Promise.reject('Not your Bug')

        bugs[idx].title = bug.title
        bugs[idx].severity = bug.severity
        bugs[idx].description = bug.description
        bugs[idx].createdAt = bug.createdAt
        bugs[idx].labels = bug.labels
    } else {
        bug._id = utilService.makeId()
        bug.owner = loggedinUser
        bugs.unshift(bug)
    }

    return _saveBugsToFile().then(() => bug)
}


function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bugs.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}
