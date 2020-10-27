const { format } = require('moment');

const helpers = {};

helpers.moment = (timestamp)=>{
    return format(timestamp)
};

module.exports = helpers;