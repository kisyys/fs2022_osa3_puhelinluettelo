const express = require('express')
const app = express()

const morgan = require('morgan')

morgan.token('body', req => {
  if (req.method === "POST") {  
    return JSON.stringify(req.body)
  } else {
    return " "
  } 
})

//app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.json())

const cors = require('cors')

app.use(cors())

app.use(express.static('build'))

let persons = [
    {
        id: 1,
        name: 'Arto Hellas222', 
        number: '040-123456'
    },
    {
        id: 2,
        name: 'Ada Lovelace', 
        number: '39-44-5323523'
    },
    {
        id: 3,
        name: 'Dan Abramov', 
        number: '12-43-234345' 
    },
    {
        id: 4,
        name: 'Mary Poppendieck', 
        number: '39-23-6423122'
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/info', (req, res) => {
  res.json(`Phonebook has info for ${persons.length} persons ${new Date()}`)

})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})


const generateId = () => {
  return Math.floor(Math.random() * 1000)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  if(persons.find(element => element.name === body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number  
  }

  persons = persons.concat(person)
  response.json(person)

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})