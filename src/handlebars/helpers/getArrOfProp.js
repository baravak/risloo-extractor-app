// getArrOfProp Helper
// Used to get one specific property of object in an array (as an array itself)

function getArrOfProp(arr, prop) {
  return arr.map(elem => elem[prop])
}

module.exports = getArrOfProp;
