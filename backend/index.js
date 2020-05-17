require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const postsRouter = require('./api/recursos/posts/posts.routes');
const usuariosRouter = require('./api/recursos/usuarios/usuarios.routes');
const amistadesRouter = require('./api/recursos/amistades/amistades.routes');
const comentariosRouter = require('./api/recursos/comentarios/comentarios.routes');
const likesRouter = require('./api/recursos/likes/likes.routes');
const logger = require('./utils/logger');
const authJWT = require('./api/libs/auth');
const config = require('./config');
const errorHandler = require('./api/libs/errorHandler');
const passport = require('passport');
passport.use(authJWT);


mongoose.connect(process.env.MONGODB_URI, {

  //Quitar warnings de mongoose
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
});

mongoose.connection.on('error', () => {
  logger.error('Falló la conexión a mongodb');
  process.exit(1);
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.raw({ type: 'image/*', limit: '16mb' }));
app.use(
  morgan('short', {
    stream: {
      write: message => logger.info(message.trim())
    }
  })
);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use(express.static('public'));


app.use('/imagenes', express.static('public/imagenes_seed'));

app.use(passport.initialize());

app.use('/api/usuarios', usuariosRouter);
app.use('/api/posts', [postsRouter, comentariosRouter, likesRouter]);
app.use('/api/amistades', amistadesRouter);

app.use(errorHandler.procesarErroresDeDB);
app.use(errorHandler.procesarErroresDeTamañoDeBody);

if (config.ambiente === 'prod') {
  app.use(errorHandler.erroresEnProducción);
} else {
  app.use(errorHandler.erroresEnDesarrollo);
}

let server;

if (process.env.NODE_ENV === 'development') {
  server = app.listen(config.puerto, () => {
    logger.info(`Escuchando en el puerto ${config.puerto}.`);
  });
} else {
  app.listen();
}

module.exports = {
  app,
  server
};
