class Measure {
  constructor(svgNode, svgContainerNode) {
    this.svgNode = svgNode;
    this.svgContainerNode = svgContainerNode;
    this.scaleFactor = this._calcScaleFactor();
    this.showOtherAttrs = ["fill", "stroke", "rx", "ry", "fill-opacity"];
    this.showTextAttrs = ["fill", "font-size", "font-weight", "font-family"];
    this.dimRectSpec = {
      width: 100,
      height: 30,
      rx: 2,
      distance: 10,
      fill: "#18A0FB",
      text: {
        "text-anchor": "middle",
        "dominant-baseline": "middle",
        fill: "white",
        direction: "ltr",
        "font-family": "Dana-FaNum",
      },
    };
    this.diffLinesSpec = {
      color: "#F24822",
      rect: {
        width: 50,
        height: 30,
        rx: 2,
        distance: 10,
        fill: "#F24822",
        text: {
          "text-anchor": "middle",
          "dominant-baseline": "middle",
          fill: "white",
          direction: "ltr",
          "font-family": "Dana-FaNum",
        },
      },
    };
  }

  set selectedNode(node) {
    this._selectedNode = node;
    this._selectedNodeRect = this._extractCoordinates(node);
    this._drawNodeRect(this._selectedNodeRect, "selected-node", "red");
    this._drawNodeDimRect(this._selectedNodeRect);
    const attrs =
      this._selectedNode.tagName.toLowerCase() === "text"
        ? this.showTextAttrs
        : this.showOtherAttrs;
    console.log(this._getAttributes(this._selectedNode, attrs));
  }

  set hoveredNode(node) {
    this._hoveredNode = node;
    this._hoveredNodeRect = this._extractCoordinates(node);
    if (this._selectedNode !== this._hoveredNode) {
      this._drawNodeRect(this._hoveredNodeRect, "hovered-node", "#18A0FB");
      if (this._selectedNodeRect)
        this._drawDiffLines(this._selectedNodeRect, this._hoveredNodeRect);
    }
  }

  _calcScaleFactor() {
    const { svgContainerNode } = this;

    let width = svgContainerNode.getAttribute("width");
    let rect = svgContainerNode.getBoundingClientRect();

    return width / rect.width;
  }

  _drawNodeRect(nodeRect, id, color) {
    this._deleteIfExists(id);

    const nodeVertices = this._extractVertices(nodeRect);
    const node = this._drawHollowRect(nodeVertices, id, color);
    this.svgNode.appendChild(node);
  }

  _deleteIfExists(id) {
    if (document.contains(document.getElementById(id)))
      document.getElementById(id).remove();
  }

  _drawNodeDimRect(nodeRect) {
    const { dimRectSpec } = this;

    this._deleteIfExists("dim-rect");

    const rectCenter = this._calcRectCenter(nodeRect);

    const dimRectCenter = {
      x: rectCenter.x,
      y:
        rectCenter.y +
        nodeRect.height / 2 +
        dimRectSpec.distance +
        dimRectSpec.height / 2,
    };

    const dimRectAttrs = {
      class: "no-reaction",
      x: dimRectCenter.x - dimRectSpec.width / 2,
      y: dimRectCenter.y - dimRectSpec.height / 2,
      width: dimRectSpec.width,
      height: dimRectSpec.height,
      fill: dimRectSpec.fill,
      rx: dimRectSpec.rx,
    };

    const dimRectTextAttrs = {
      class: "no-reaction",
      x: dimRectCenter.x,
      y: dimRectCenter.y,
      ...dimRectSpec.text,
    };

    let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.textContent = `${Math.round(nodeRect.width)} * ${Math.round(
      nodeRect.height
    )}`;

    g.appendChild(rect);
    g.appendChild(text);

    this._setAttributes(g, { id: "dim-rect" });
    this._setAttributes(rect, dimRectAttrs);
    this._setAttributes(text, dimRectTextAttrs);

    this.svgNode.appendChild(g);
  }

  _drawDiffLines(selectedNodeRect, hoveredNodeRect) {
    const { diffLinesSpec } = this;

    this._deleteIfExists("diff-lines");

    const selectedRectCenter = this._calcRectCenter(selectedNodeRect);

    const hPoints = [
      {
        x: selectedNodeRect.left,
        y: selectedRectCenter.y,
      },
      {
        x: selectedNodeRect.right,
        y: selectedRectCenter.y,
      },
      {
        x: hoveredNodeRect.left,
        y: selectedRectCenter.y,
      },
      {
        x: hoveredNodeRect.right,
        y: selectedRectCenter.y,
      },
    ];

    const vPoints = [
      {
        x: selectedRectCenter.x,
        y: selectedNodeRect.bottom,
      },
      {
        x: selectedRectCenter.x,
        y: selectedNodeRect.top,
      },
      {
        x: selectedRectCenter.x,
        y: hoveredNodeRect.bottom,
      },
      {
        x: selectedRectCenter.x,
        y: hoveredNodeRect.top,
      },
    ];

    const hLine = this._findLeastDist(hPoints, "x");

    const vLine = this._findLeastDist(vPoints, "y");

    let g = document.createElementNS("http://www.w3.org/2000/svg", "g");

    const line1 = this._drawLine(hLine.pt1, hLine.pt2, {
      class: "no-reaction",
      stroke: diffLinesSpec.color,
    });
    const line2 = this._drawLine(vLine.pt1, vLine.pt2, {
      class: "no-reaction",
      stroke: diffLinesSpec.color,
    });

    const hLineMiddle = this._calcMiddle(hLine.pt1, hLine.pt2);
    const vLineMiddle = this._calcMiddle(vLine.pt1, vLine.pt2);

    const hLineRectCenter = {
      x: hLineMiddle.x,
      y:
        hLineMiddle.y -
        (diffLinesSpec.rect.distance + diffLinesSpec.rect.height / 2),
    };
    const vLineRectCenter = {
      x:
        vLineMiddle.x -
        (diffLinesSpec.rect.distance + diffLinesSpec.rect.width / 2),
      y: vLineMiddle.y,
    };

    const diffRectAttrs = {
      class: "no-reaction",
      width: diffLinesSpec.rect.width,
      height: diffLinesSpec.rect.height,
      fill: diffLinesSpec.rect.fill,
      rx: diffLinesSpec.rect.rx,
    };

    const rect1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    const rect2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );

    this._setAttributes(rect1, {
      ...diffRectAttrs,
      x: hLineRectCenter.x - diffLinesSpec.rect.width / 2,
      y: hLineRectCenter.y - diffLinesSpec.rect.height / 2,
    });
    this._setAttributes(rect2, {
      ...diffRectAttrs,
      x: vLineRectCenter.x - diffLinesSpec.rect.width / 2,
      y: vLineRectCenter.y - diffLinesSpec.rect.height / 2,
    });

    const diffRectTextAttrs = {
      class: "no-reaction",
      ...diffLinesSpec.rect.text,
    };

    let text1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    let text2 = document.createElementNS("http://www.w3.org/2000/svg", "text");

    text1.textContent = this._calcDistance(hLine.pt1, hLine.pt2);
    text2.textContent = this._calcDistance(vLine.pt1, vLine.pt2);

    this._setAttributes(text1, { ...diffRectTextAttrs, ...hLineRectCenter });
    this._setAttributes(text2, { ...diffRectTextAttrs, ...vLineRectCenter });

    g.appendChild(line1);
    g.appendChild(line2);
    g.appendChild(rect1);
    g.appendChild(rect2);
    g.appendChild(text1);
    g.appendChild(text2);

    this._setAttributes(g, { id: "diff-lines" });

    this.svgNode.appendChild(g);
  }

  _extractVertices(nodeRect) {
    const A = {
      x: nodeRect.left,
      y: nodeRect.top,
    };
    const B = {
      x: A.x + nodeRect.width,
      y: A.y,
    };
    const C = {
      x: B.x,
      y: B.y + nodeRect.height,
    };
    const D = {
      x: A.x,
      y: C.y,
    };

    return [A, B, C, D];
  }

  _extractCoordinates(node) {
    const { scaleFactor, svgContainerNode: container } = this;

    const nodeRect = node.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const width = nodeRect.width * scaleFactor;
    const height = nodeRect.height * scaleFactor;
    const left = (nodeRect.left - containerRect.left) * scaleFactor;
    const top = (nodeRect.top - containerRect.top) * scaleFactor;

    return {
      top: roundTo2(top),
      right: roundTo2(left + width),
      bottom: roundTo2(top + height),
      left: roundTo2(left),
      width: roundTo2(width),
      height: roundTo2(height),
    };
  }

  _calcRectCenter(nodeRect) {
    return {
      x: nodeRect.left + nodeRect.width / 2,
      y: nodeRect.top + nodeRect.height / 2,
    };
  }

  _drawLine(pt1, pt2, attrs = {}) {
    let line = document.createElementNS("http://www.w3.org/2000/svg", "line");

    this._setAttributes(line, {
      x1: pt1.x,
      y1: pt1.y,
      x2: pt2.x,
      y2: pt2.y,
      ...attrs,
    });

    return line;
  }

  _drawHollowRect(nodeVertices, id, color) {
    let n = nodeVertices.length;
    let i;
    let g = document.createElementNS("http://www.w3.org/2000/svg", "g");

    for (i = 0; i < n; i++) {
      g.appendChild(
        this._drawLine(nodeVertices[i % n], nodeVertices[(i + 1) % n], {
          class: "no-reaction",
        })
      );
    }

    this._setAttributes(g, {
      id,
      stroke: color,
    });

    return g;
  }

  _calcMiddle(pt1, pt2) {
    return {
      x: (pt1.x + pt2.x) / 2,
      y: (pt1.y + pt2.y) / 2,
    };
  }

  _calcDistance(pt1, pt2) {
    return Math.round(
      Math.sqrt(Math.pow(pt2.y - pt1.y, 2) + Math.pow(pt2.x - pt1.x, 2))
    );
  }

  _setAttributes(elem, attrs) {
    for (let key in attrs) {
      elem.setAttribute(key, attrs[key]);
    }
  }

  _getAttributes(elem, attrs) {
    const attrsObj = {};
    let value;
    for (let attr of attrs) {
      value = window.getComputedStyle(elem)[attr];
      if (value !== "none" && value !== "auto") {
        if (attr === "fill" || attr === "stroke") {
          attrsObj[attr] = this._rgba2hex(value);
          continue;
        }
        attrsObj[attr] = value;
      }
    }

    return attrsObj;
  }

  _rgba2hex(rgba) {
    return `#${rgba
      .match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/)
      .slice(1)
      .map((n, i) =>
        (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n))
          .toString(16)
          .padStart(2, "0")
          .replace("NaN", "")
          .toUpperCase()
      )
      .join("")}`;
  }

  _findLeastDist(points, dir) {
    let min = {
      value: Math.abs(points[2][dir] - points[0][dir]),
      indices: [0, 2],
    };
    let n = points.length;
    let i;
    let j;
    let diff;

    for (i = 0; i < n; i++) {
      for (j = i + 1; j < n; j++) {
        if ((i === 0 && j === 1) || (i === 2 && j === 3)) continue;
        diff = Math.abs(points[j][dir] - points[i][dir]);
        if (diff < min.value) {
          min = { value: diff, indices: [i, j] };
        }
      }
    }

    return {
      pt1: points[min.indices[0]],
      pt2: points[min.indices[1]],
    };
  }
}

function roundTo2(num) {
  return +num.toFixed(2);
}

document.addEventListener("DOMContentLoaded", () => {
  const mainSvgElem = document.getElementsByTagName("svg")[0];
  const svgContainer = document.getElementById("svg-container");
  const measure = new Measure(mainSvgElem, svgContainer);

  document.addEventListener("click", (event) => {
    const clickedObjNode = event.target;
    if (clickedObjNode.getAttribute("class") !== "no-reaction")
      measure.selectedNode = clickedObjNode;
  });

  document.addEventListener("mouseover", (event) => {
    const hoveredObjNode = event.target;
    if (hoveredObjNode.getAttribute("class") !== "no-reaction")
      measure.hoveredNode = hoveredObjNode;
  });
});
