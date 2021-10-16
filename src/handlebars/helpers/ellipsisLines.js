// ellipsisLines Helper
// Putting Ellipsis onto Lines if Exceeded Our Limit

function ellipsisLines(lines, maxLines, options) {
  if (lines.length <= maxLines) return lines;
  const output = lines.slice(0, maxLines);
  output[maxLines - 1] += " ...";
  return output;
}

module.exports = ellipsisLines;
