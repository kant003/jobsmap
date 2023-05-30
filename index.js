import express from "express";
import * as dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import * as url from 'url';
import path from 'path';
import { getOffers, getLatLon, filterString } from "./services.js";

const __filename = url.fileURLToPath(import.meta.url);
    const __dirname = url.fileURLToPath(new URL('.', import.meta.url));


dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.use(express.static('public'))

app.use(morgan("tiny"));



app.get("/", (req, res) => {
  //res.status(200).send("Bienvenido al API de infobos JobsMap");
  const filePath = path.resolve(__dirname, 'map.html');
  res.sendFile(filePath);

});

app.get("/jobs", async (req, res) => {
    // obtenemos el query category
    const category = req.query.category;
    console.log('buscando:',category)

  //console.log(process.env.INFOJOBS_TOKEN)
  const offer = await getOffers(category);
  //console.log(offer)
  //   res.status(200).send(pos)
  let data = offer.items.map((item) => {
   
    item.city = filterString(item.city)
    item.province.value = filterString(item.province.value)
    
    console.    log(item.province.value, item.city)

    return {
      title: item.title,
      city: item.city,
      province: item.province.value,
      link: item.link,
      contract: item.contractType.value,
    };
  });

  for(let item of data){
      console.log(item.city, item.province)
    const pos = await getLatLon(`${item.city} ${item.province}`);
    //onst pos={lat: 10, lon: 11}
    item.lat=pos.lat
    item.lng=pos.lon
  }

  res.status(200).send(data);
});


async function main() {
  await app.listen(process.env.PORT);
  console.log("Servidor corriendo en el puerto " + process.env.PORT);
}
main().catch((error) => console.error("Fallo al arrancar el servidor" + error));
