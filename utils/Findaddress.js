const zipcodeData = require('../lib/indianAddress.json');
exports.findAddressByPincode = (pincode) => {
   
  return zipcodeData[pincode] || null;
};