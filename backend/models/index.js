const {initUserModel} = require('./users');
const {initProductModel} = require('./products');


const initModels = async () => {
  await initUserModel();
  await initProductModel();
};

module.exports = {
  initModels
};