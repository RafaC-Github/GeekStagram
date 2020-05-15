const { Seeder } = require('mongo-seeding');
const path = require('path');

const config = {
  database: 'mongodb://127.0.0.1:27017/Geekstagram',
  dropDatabase: true
};

const seeder = new Seeder(config);

const collections = seeder.readCollectionsFromPath(
  path.resolve(__dirname, './data/')
);

(async function() {
  try {
    await seeder.import(collections);
    console.log('Data importada a la base de datos "Geekstagram" exitosamente');
  } catch (err) {
    console.log('Hubo un error llenando la base de datos:', err);
  }
})();

