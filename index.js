import express from 'express'
import * as dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import { getOffers, getLatLon, filterString } from './services.js'

dotenv.config()
const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use(express.static('public'))
app.use(morgan('tiny'))

app.get('/hello', (req, res) => {
  res.status(200).send('Bienvenido al API de infobos JobsMap')
})

app.get('/', (req, res) => {
  res.redirect('/map.html')
})

app.get('/jobs', async (req, res) => {
  const category = req.query.category || 'informatica-telecomunicaciones'
  console.log('buscando:', category)

  const offer = await getOffers(category)
  const data = offer.items.map((item) => {
    item.city = filterString(item.city)
    item.province.value = filterString(item.province.value)

    return {
      title: item.title,
      city: item.city,
      province: item.province.value,
      link: item.link,
      contract: item.contractType?.value,
      experienceMin: item.experienceMin?.value,
      study: item.study?.value,
      workDay: item.workDay?.value,
      teleworking: item.teleworking?.value
    }
  })

  for (const item of data) {
    const pos = await getLatLon(`${item.city}`)
    // const pos={lat: 10, lon: 11}
    item.lat = pos.lat
    item.lng = pos.lon
  }

  res.status(200).send(data)
})

async function main() {
  await app.listen(process.env.PORT)
  console.log('Servidor corriendo en el puerto ' + process.env.PORT)
}
main().catch((error) => console.error('Fallo al arrancar el servidor' + error))
