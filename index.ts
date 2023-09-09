import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;
// Use bodyParser middleware to parse incoming JSON and url-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const app_key = process.env.APP_KEY;
const app_id = process.env.APP_ID;

const allowedOrigins = ['http://localhost:5173'];

// Configure CORS options
const corsOptions = {
  origin: allowedOrigins, // Replace with your Vue frontend's URL
  methods: 'GET', // You can adjust the allowed HTTP methods
  optionsSuccessStatus: 204, // No Content status for preflight requests
};

app.use(cors(corsOptions));

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

// Define a route for handling recipe searches
app.get('/search', async (req: Request, res: Response) => {
  try {
    const diet = req.query.diet as string;
    const cuisine = req.query.cuisine as string;
    const data = req.query;
    const apiUrl = 'https://api.edamam.com/api/recipes/v2';
    const requestUrl = `${apiUrl}?type=public&q=${encodeURIComponent(diet)}&app_id=${app_id}&app_key=${app_key}&cuisine=${cuisine}`;
    const response = await axios.get(requestUrl); // Make a GET request to the API.
    const recipes = response.data.hits.map((hit: any) => hit.recipe);
    return res.json(recipes); // Send the API response as JSON.
  } catch (error) {
    console.error('An error occurred:', error);
    return res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});