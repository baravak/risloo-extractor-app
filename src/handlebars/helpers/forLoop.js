// forLoop Helper
// Implement For Loop in Handlebars

function forLoop(from, to, incr, block) {
  let accum = "";
  for (let i = from; i < to; i += incr) {
    block.data.i = i;
    block.data.first = i === 0;
    block.data.last = i === to - 1;
    accum += block.fn({i});
  }
  return accum;
}

module.exports = forLoop;
