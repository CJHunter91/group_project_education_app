const express = require('express');
const app = express();
const path = require('path');
const parser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const createRouter = require('./helpers/create_router.js');

const publicPath = path.join(__dirname, '../client/public');
app.use(express.static(publicPath));

app.use(parser.json());

const mongoDBURI = process.env.MONGODB_URI ? process.env.MONGODB_URI : 'mongodb://localhost:27017';
const port = process.env.PORT ? process.env.PORT : 3000

MongoClient.connect(mongoDBURI)
  .then((client) => {
    const db = client.db('card_game');
    const cardCollection = db.collection('cards');
    const cardsRouter = createRouter(cardCollection)
    app.use('/api/card-pack', cardsRouter);
  })
  .catch(console.error);

app.listen(port, function () {
  console.log(`Listening on port ${ this.address().port }`);
});
