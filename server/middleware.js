const path = require('path');
const bodyParser = require('body-parser')

module.exports = function(app, express) {

  app.use('/build', express.static( __dirname + '/../build'));

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}));

  app.get('/', (req, res) => {
    res.sendFile(path.join( `${__dirname}/index.html` ))
  })

};
