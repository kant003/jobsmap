async function refresh() {
  const category = document.getElementById('category').value
  window.history.pushState({}, '', `/map.html?category=${category}`)
  window.location.reload()
}
async function start() {
  const queryParamCategory = window.location.search.split('=')[1]
  
  if(queryParamCategory){
    localStorage.setItem('category', queryParamCategory)
  }else{
    const category = localStorage.getItem('category') || 'informatica-telecomunicaciones'
    localStorage.setItem('category', category)
    window.history.pushState({}, '', `/map.html?category=${category}`)
  }
  

  const select = document.getElementById('category')
  select.value = category
  


  // mostrar loading
  document.getElementById('loading').style.display = 'block'

  console.log(localStorage.getItem('category'))
  const response = await fetch('/jobs?category='+localStorage.getItem('category'))
  //const response = await fetch('test.json?category=' + localStorage.getItem('category'))
  const data = await response.json()
  
  const zoom = localStorage.getItem('zoom') || 6
  const lat = localStorage.getItem('lat') || 41.095912
  const lng = localStorage.getItem('lng') || -2.142334

  let map = L.map('map').setView([lat, lng], zoom)


  map.on('zoomend', function () {
    console.log('si')
    const zoomLevel = map.getZoom()
    localStorage.setItem('zoom', zoomLevel)
  })

  map.on('moveend', function () {
    const savedCenter = map.getCenter()
    localStorage.setItem('lat', savedCenter.lat)
    localStorage.setItem('lng', savedCenter.lng)
  })

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 30,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map)

  data.forEach(function (item) {
    const marker = L.marker([item.lat, item.lng]).addTo(map)
    const msg = `
                 ${item.title}<br/>
                 Contrato: ${item.contract}<br/>
                 Experiencia min.: ${item.experienceMin}<br/>
                 Estudios: ${item.study}<br/>
                 Tipo Jornada: ${item.workDay}<br/>
                 Teletrabajo: ${item.teleworking}<br/>
                 <a href='${item.link}' target='_blank'>Ver oferta</a>
                 `

    marker.bindPopup(msg)
  })


  // ocultar loading
  document.getElementById('loading').style.display = 'none'
}

async function fillComboCategories() {
  fetch('categories.json')
    .then((response) => response.json())
    .then((data) => {
      // añadimso al select las categorias
      const select = document.getElementById('category')
      data.forEach((item) => {
        const option = document.createElement('option')

        option.value = item.key
        option.innerText = item.value
        if (item.key === window.location.search.split('=')[1]) {
          option.selected = true
        }
        select.appendChild(option)
      })
    })
}

const c = document.getElementById('category')
c.addEventListener('change', refresh)

fillComboCategories()
start()
