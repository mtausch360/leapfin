const path = require('path');
const jsonfile = require('jsonfile')
const phone = require('libphonenumber-js')
const get_ip = require('ipware')().get_ip;
const { fromPairs } = require('lodash');

const file = './server/db/form.json'

module.exports = function(app, express) {

  const router = express.Router();

  router.get('/form', (req, res) => {
    const ip = get_ip(req).clientIp
    jsonfile.readFile(file, (err, store = {}) => {
      if(err) {
        console.error(err);
        res.send(err);
      } else {
        const payload = {
          form: store[ip],
          ip: ip
        };
        res.send(payload);
      }
    });
  });

  router.put('/form', (req, res) => {
    const ip = get_ip(req).clientIp;
    const form = req.body.form;
    const errors = [];
    // validate phone number
    if(form.phone_number && !phone.isValidNumber({ phone: form.phone_number, country: 'US' })) {
      errors.push(["phone_number", "Not a valid phone number"]);
    }
    // validate zip code
    if(form.zip && !/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(form.zip)){
      errors.push(["zip", "Not a valid zip code"]);
    }

    if(errors.length) {
      res.status(400).send(fromPairs(errors));
      return;
    }
    jsonfile.readFile(file, (err, store = {}) => {
      if(err) console.error(err);
      store[ip] = req.body.form;
      jsonfile.writeFile(file, store, (err) => {
        if(err){
          console.error(err);
          res.status(500).send(err);
        } else {
          res.sendStatus(200);
        }
      })
    })
  })

  app.use('/api/v0', router);

};

