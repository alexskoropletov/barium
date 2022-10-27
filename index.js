const express = require('express');
const { promises: { readFile, writeFile } } = require("fs");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3456;

const defaultPlayer = {
  name: 'Player',
  gold: 0,
  boobarium: 0
};

const options = { 
  encoding: 'utf8',
  flag: 'w+'
};

app.get('/', async (req, res) => {
  const player = await getFile(req.query.id);  
  res.send(player);
});

app.post('/', async (req, res) => {
  await setFile(req.query.id, req.body);
  res.send(true);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const getFile = async (id) => {
  let player;
  try {
    player = await readFile(getFileName(id), { ...options, flag: 'r' });
  } catch (e) {
    console.log(e);
    player = await setFile(id, defaultPlayer);
  }

  return player;
}

const setFile = async (id, player) => {
  await writeFile(getFileName(id), JSON.stringify(player), options);

  return player;
};

const getFileName = (id) => `./player/${id ? id : '_'}.json`;