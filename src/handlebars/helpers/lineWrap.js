// lineWrap Helper
// Wrapping Words into Lines

function lineWrap(string, maxChar, options) {
  let tokens = string.split(" "); 
  let lines = []; 
  let i = 0; 
  let L = 0;
  while(true) { 
    let tokenLength = tokens[i].replace(/‌/g, '').length; 
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
