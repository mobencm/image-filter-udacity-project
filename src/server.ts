import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
const isImageURL = require('image-url-validator').default;

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());


  app.get('/filteredimage', async (req, res) => {

    const  url =req.query.image_url;
    const isValidURL = await isImageURL(url);
    if(!isValidURL) {
      return res.status(400).send("the URL of the image is not valid.")
    }
    const  filteredpath  = await filterImageFromURL(url);
    res.status(200).sendFile(filteredpath,(err) =>{
      if (err) {
        res.status(500).send('Error sending response.');
      }
      deleteLocalFiles([filteredpath]);
    });

  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
