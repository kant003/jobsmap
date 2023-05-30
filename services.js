import fetch from 'node-fetch'

async function getLatLon(location) {
  const url = 'https://weatherapi-com.p.rapidapi.com/current.json?q=' + location
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': `${process.env.RAPID_API}`,
      'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
    }
  }

  try {
    const response = await fetch(url, options)
    const result = await response.json()
    return { lat: result.location.lat, lon: result.location.lon }
  } catch (error) {
    return { lat: 0, lon: 0 }
  }
}

async function getOffers(category) {
  const response = await fetch(
    'https://api.infojobs.net/api/9/offer?category=' + category,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${process.env.INFOJOBS_TOKEN}`
      }
    }
  )

  const data = await response.json()
  return data
}

function filterString(text) {
  if (text.includes('/')) {
    text = text.split('/')[0]
  }
  text = text.toLowerCase()

  text = text.replace('à', 'a')
  text = text.replace('é', 'e')
  text = text.replace('ì', 'i')
  text = text.replace('ò', 'o')
  text = text.replace('ù', 'u')

  return text
}

export { getOffers, getLatLon, filterString }
