const { format } = require('timeago.js');

const helpers = {};

helpers.timeago = (timestamp) => {      // se le agraga un metodo al objeto 
    return format(timestamp);
}

module.exports = helpers