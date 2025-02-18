
import express from 'express';
const app = express();

import multer from 'multer'; // Import multer

import { getAiResponse } from '../backend/services/lang_chain.js';

import cors from 'cors';

import axios from 'axios'; // Import axios for making HTTP requests
import cheerio from 'cheerio'; // Import cheerio for web scraping


app.use(cors());


app.use(express.urlencoded({extended: false}));

// initialising multer-----------------

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueName = Date.now() + '-' + file.originalname
      cb(null, uniqueName)
    }
  })


const upload = multer({ storage: storage })
//   ------------------------------
app.listen(5000);



async function getFirstImageURL(query) {
  const searchURL = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}`;


  const { data } = await axios.get(searchURL);

  const $ = cheerio.load(data);
  const firstImageElement = $('.mimg').first();
  const firstImageURL = firstImageElement.attr('src');

  if (!firstImageElement.length || !firstImageURL) {
      throw new Error('No image found or missing src attribute.');
  }

  if (firstImageURL.startsWith('/')) {
      return `https://www.bing.com${firstImageURL}`;
  }
  return firstImageURL;
}


app.get('/fetch-image', async (req, res) => {
  const { query } = req.query; // Get the query parameter from the URL

  try {
      const imageURL = await getFirstImageURL(query);
      res.send({ imageURL }); // Send the image URL as a JSON response
  } catch (error) {
      res.status(500).send({ error: error.message });
  }
});

app.get('/', (req,res)=>{
res.send("working");
})

app.post('/', upload.single('file'), async (req,res)=>{
    let {country} = req.body;

    //optimising
    if(country.length > 0){
      country= "Give Ayurvedic Suggestions for " + country;
    }

    try{
        var response =  await getAiResponse(country);
        console.log("server_res" , response);
        res.status(201).json(response);
    }
    catch(err){
        res.send(err);
    }
})
