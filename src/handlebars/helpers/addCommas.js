// addCommas Helper
// Add Commas to Numbers

function addCommas(num) {
  return num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
};

module.exports = addCommas;