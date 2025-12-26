// lineWrap Helper
// Wrapping Words into Lines

function lineWrap(str, maxChar) {
  let tokens = str.split(" ");
  let lines = [];
  let i = 0;
  let L = 0;

  while (true) {
    if (!tokens[i]) break;

    let token = tokens[i];
    let tokenLength = token.replace(/‌/g, "").length;

    if (tokenLength > maxChar) {
      if (i > 0) {
        lines.push(tokens.slice(0, i).join(" ").trim());
        tokens = tokens.slice(i);
        i = 0;
        L = 0;
        continue;
      }

      lines.push(token.slice(0, maxChar));
      tokens[0] = token.slice(maxChar);
      i = 0;
      L = 0;
      continue;
    }

    L += tokenLength + 1;

    if (L - 1 > maxChar) {
      lines.push(tokens.slice(0, i).join(" ").trim());
      tokens = tokens.slice(i);
      i = 0;
      L = 0;
      continue;
    } else if (i >= tokens.length - 1) {
      lines.push(tokens.slice(0, i + 1).join(" "));
      break;
    }

    i++;
  }

  return lines;
}

module.exports = lineWrap;
