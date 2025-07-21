/* eslint-disable space-before-function-paren */
/* eslint-disable no-multi-spaces */
// creamos sv de rest api

const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto')   // nativo de express, para crear ids
const z = require('zod') // para validar

// const cors = require('cors')
// app.use(cors()) middleware que permite el CORS pero ojo, que pone todo con '*' y permite el acceso de cualquier url

const app = express()
app.disable('x-powered-by')
app.use(express.json())       // middleware para el post

app.get('/movies', (req, res) => {            // todos los recursos que sean MOVIES se identifican con /movies
  res.header('Access-Control-Allow-Origin', '*')  // permite el acceso desde el html (CORS)

  const { genre } = req.query                 // consigue el genero de la query ('?genre=' en la url)
  if (genre) {
    const filteredMovies = movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())  // comparamos los géneros de la película y el filtro, todo en minúscula
    )
    return res.json(filteredMovies)
  }
  res.json(movies)                            // endpoint
})

app.get('/movies/:id', (req, res) => {    // path-to-regex. Segmento dinámico porque la id cambia.
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)

  res.status(404).json({ message: 'Movie not found' })
})

app.post('/movies', (req, res) => {
  const movieSchema = z.object({      // validación
    title: z.string({
      invalid_type_error: 'Movie must be a string.',
      required_error: 'Movie title is required.'
    }),
    year: z.number().int().min(1900).max(2026),   // validación en cadena: numero->entero->min max
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(0),
    poster: z.url(),
    genre: z.array(
      z.enum(['Action', 'Drama', 'Crime', 'Sci-fi', 'Comedy', 'Adventure', 'Romance', 'Thriller']),
      {
        required_error: 'Genre required',
        invalid_type_error: 'Genres must be an array of enum Genre'
      }
    )
  })      // esto debería hacerlo en un modulo aparte, que se llame schemas y tenga todos ahi. Pero por pedagógico lo dejo aca.

  function validateMovie(object) {
    return movieSchema.safeParse(object)
  }

  const result = validateMovie(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })    // 400 bad request, el cliente puso mal algo.
  }

  const newMovie = {
    id: crypto.randomUUID(),   // express te crea una id random, UUID universal unique identifier
    ...result.data             // copia los datos ya validados
  }

  movies.push(newMovie)           // esto no seria REST porque estamos guardando el estado de la app en memoria.
  res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)   // validación

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {     // -1 es que no lo encontramos
    return res.status(404).json({ message: 'movie not found' })
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updateMovie

  return res.json(updateMovie)
})

const PORT = process.env.PORT || 1234

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`)
})

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie must be a string.',
    required_error: 'Movie title is required.'
  }),
  year: z.number().int().min(1900).max(2026),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(0),
  poster: z.url(),
  genre: z.array(
    z.enum(['Action', 'Drama', 'Crime', 'Sci-fi', 'Comedy', 'Adventure', 'Romance', 'Thriller']),
    {
      required_error: 'Genre required',
      invalid_type_error: 'Genres must be an array of enum Genre'
    }
  )
})

function validatePartialMovie(object) {
  return movieSchema.partial().safeParse(object)      // .partial hace opcionales que estén todas las propiedades de la validación, si están, las valida
}
