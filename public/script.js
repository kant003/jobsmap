async function refresh() {
    // cambia la url con la categoria seleecionada del select
   const select = document.getElementById("category");
    const category2 = select.value;
    console.log("refres:", category2);
   
    window.history.pushState({},"",`/map.html?category=${category2}` );
    window.location.reload();

  }
  async function start() {
    // mostrar loading
    document.getElementById("loading").style.display = "block";

    let category
        // leemos la categoria del localstorage
        // si no esta guardada se pone por defecto informatica-telecomunicaciones
    if(! window.location.search.split("=")[1]){
         category = localStorage.getItem("category") || "informatica-telecomunicaciones";
        console.log('no se pasa:', category)
        if(!localStorage.getItem("category")){
            localStorage.setItem("category", category);
            
        }
        window.history.pushState( {}, "",  `/map.html?category=${category}`  );
        //category = localStorage.getItem("category");
    }else{
        console.log('se pasa')
        localStorage.setItem("category", window.location.search.split("=")[1]);
        category = window.location.search.split("=")[1];
    }
       
    const select = document.getElementById("category");
        console.log(category)
        select.value = category;
       
      console.log("gettng", category);

      console.log();
      const response = await fetch('/jobs?category='+category)
      //const response = await fetch("test.json?category=" + category);
      const data = await response.json();
      //    return [
      //      {lat: 42.23282, lng:-8.72264, count: 50, sensorID:1},
      //        {lat: 42.43282, lng:-8.52264, count: 60, sensorID:2, test:true},
      //        {lat: 42.73282, lng:-8.72264, count: 80, sensorID:3, test:true},
      //        {lat: 42.63282, lng:-7.72264, count: 50, sensorID:4, test:true},
      //        {lat: 42.93282, lng:-5.72264, count: 30, sensorID:5, test:true},
      //    ]

    const zoom = localStorage.getItem("zoom") || 6;
    const lat = localStorage.getItem("lat") || 41.095912
    const lng = localStorage.getItem("lng") || -2.142334

   // const lat = 40.41831;
   // const lng = -3.70275;

    let map = L.map("map").setView([lat, lng], zoom);
    
   // map.setView(center);
    
    map.on('zoomend', function() {
        console.log('si')
        const zoomLevel = map.getZoom();
        localStorage.setItem("zoom", zoomLevel);
    });

    map.on('moveend', function() {
        const savedCenter = map.getCenter();
        localStorage.setItem("lat", savedCenter.lat);
        localStorage.setItem("lng", savedCenter.lng);
    });


    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 30,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    data.forEach(function (item) {
      marker = L.marker([item.lat, item.lng]).addTo(map);
      const msg = `
                 ${item.title}<br/>
                 Contrato: ${item.contract}<br/>
                 <a href='${item.link}' target='_blank'>Ver oferta</a>
                 `;

      marker.bindPopup(msg);
    });

   
   //si esta almacenado el zoom en el localstorage, lo establece. En caso contrario uso 6 por defecto
    
    // ocultar loading
    document.getElementById("loading").style.display = "none";

  }

  async function fillCombo() {
    fetch("categories.json")
      .then((response) => response.json())
      .then((data) => {
        // añadimso al select las categorias
        const select = document.getElementById("category");
        data.forEach((item) => {
          const option = document.createElement("option");

          option.value = item.key;
          option.innerText = item.value;
          if (item.key === window.location.search.split("=")[1]) {
            option.selected = true;
          }
          select.appendChild(option);
        });
      });
  }

  fillCombo();
  start();
