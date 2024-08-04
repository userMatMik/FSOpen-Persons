const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))


let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// const requestLogger = (request, response, next) => {
//     console.log('Method:', request.method)
//     console.log('Path:  ', request.path)
//     console.log('Body:  ', request.body)
//     console.log('---')
//     next()
// }

// app.use(morgan(':method :host :status :param[id] :res[content-length] - :response-time ms'));




app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

morgan.token('content', (req, res) => {
    return JSON.stringify(req.body)
});

const randomId = () => {
    const random = Math.random();
    const s = random.toString(16);
    const id = s.slice(2);

    return id;
}

app.get('/', (request, response) => {
    response.send('<h1>Persons API</h1>')
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    const newPersonName = body.name
    const newPersonNumber = body.number

    const newPerson = {
        id: randomId(),
        name: newPersonName,
        number: newPersonNumber,
    }

    const isNameDuplicated = persons.some(el => el.name.toLowerCase() === newPersonName.toLowerCase())

    console.log(isNameDuplicated)

    if (!newPersonName || !newPersonNumber) {
        console.log('400')
        return response.status(400).json({
            error: 'missing content'
        })
    } 
    if (isNameDuplicated) {
        console.log('409')
        return response.status(409).json({
            error: 'name must be unique'
        })
    }
    persons = [...persons, newPerson]
    console.log('added to persons')
    response.json(newPerson)
    
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(el => el.id !== id)
    
    response.status(204).end()
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(el => el.id === id)
    
    if (person) {
       response.json(person);
    } else {
        console.log("person not found")
        response.status(404).end();
    }
})

app.get('/info', (request, response) => {
    const d = Date.now()
    const dateNow =  new Date(d)
    const dateHeader = request.headers['date'] || dateNow.toString()
  
    console.log(`Date header: ${dateHeader}`);
    response.send(`<p>Phonebook has info for ${persons.length} people</p><br/><p>${dateHeader}</p>`)
}) 

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})