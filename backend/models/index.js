const {initUserModel} = require('./users');
const {initProductModel} = require('./products');
const {initFilesModels} = require('./files');


const initModels = async () => {
  await initUserModel();
  await initProductModel();
  await initFilesModels();
};

module.exports = {
  initModels
};