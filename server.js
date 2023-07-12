import express from "express"
import cookieParser from 'cookie-parser'
import { bugService } from "./services/bug.service.js"
import { userService } from './services/user.service.js'
import { loggerService } from './services/logger.service.js'
import { pdfService } from "./services/pdf.service.js"
import { utilService } from "./services/util.service.js"
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.static('public'))



// app.get('/', (req, res) => res.send('Hello there'))

//download PDf
app.get('/api/download', (req, res) => {
    bugService
      .query()
      .then((bugs) => {
        loggerService.info(`Downloaded Bugs`)
        const fileName = `bugs-${utilService.makeId()}`
        pdfService.buildBugsPDF(bugs, fileName).then(() => {
          const filePath = path.join(__dirname, 'pdf', `${fileName}.pdf`)
          res.sendFile(filePath)
        })
      })
      .catch((err) => {
        loggerService.error('Cannot download Bugs', err)
        res.status(400).send('Cannot download Bugs')
      })
  })

// Get Bugs (READ)
app.get('/api/bug', (req, res) => {
    const filterBy = {
        title: req.query.title || '',
        severity: req.query.severity || 0,
        labels: req.query.labels || null,
        pageIdx: req.query.pageIdx,
    }
    const sortBy ={
        type: req.query.type || '',
        dir: req.query.dir || 1
    }
    bugService.query(filterBy, sortBy)
        .then(bugs => {
            res.send(bugs)
        })
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

// Get Bug (READ)

// limit user to 3 bugs in 20 seconds
app.get('/api/bug/:bugId', (req, res) => {
    let visitedBugs = req.cookies.visitedBugs || []
    const bugId = req.params.bugId
    if(!visitedBugs.includes(bugId)) visitedBugs.push(bugId)
    
    if(visitedBugs.length === 4){
        console.log('too many visits, wait 20 seconds')
        res.status(401).send('Wait for a bit')
    }
    res.cookie('visitedBugs', visitedBugs, {maxAge: 20*1000})

    bugService.getById(bugId)
        .then(bug => {
            res.send(bug)
        })
        .catch((err) => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
  
    console.log('User visited at the following Bugs: ', visitedBugs)
    // res.send('hello')
})


// Save Bug (/UPDATE)
app.put('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')
    const { _id, title, severity, description, createdAt, labels } = req.body
    const bugToSave = { _id, title, severity, description, createdAt, labels}
    
    bugService.save(bugToSave, loggedinUser)
        .then(savedBug => {
            loggerService.info('Bug saved!', bugToSave)
            res.send(savedBug)
        })
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
    })
    
// Save Bug (CREATE)
app.post('/api/bug/', (req, res) => {
    
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    console.log("🚀 ~ file: server.js:114 ~ app.post ~ loggedinUser:", loggedinUser)
    if (!loggedinUser) return res.status(401).send('Cannot update bug')

    const { title, severity, description, createdAt, labels } = req.body
    const bugToSave = { title, severity, description, createdAt, labels }

    bugService.save(bugToSave, loggedinUser)
        .then(savedBug => {
            loggerService.info('Bug saved!', bugToSave)
            res.send(savedBug)
        })
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})






// Delete bug (DELETE)
app.delete('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot remove bug')
    const bugId = req.params.bugId
    bugService.remove(bugId, loggedinUser)
        .then(bug => {
            loggerService.info(`Bug ${bugId} removed`)
            res.send(`Bug ${bugId} Removed`)
            // res.redirect('/api/bug')
        })
        .catch((err) => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })
})

app.get('/api/user', (req, res) => {
    userService.query()
        .then((users) => {
            res.send(users)
        })
        .catch((err) => {
            console.log('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
        .catch(err => {
            console.log('Cannot login', err)
            res.status(400).send('Cannot login')
        })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials)
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            console.log('Cannot signup', err)
            res.status(400).send('Cannot signup')
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.end()
})





const port = 3030
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)
