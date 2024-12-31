module.exports = {
    shape(cx, cy, sideLength) {
        return this.area(cx, cy, sideLength, [1, 1, 1, 1, 1, 1]);
    },
    area(cx, cy, sideLength, scores) {
        return this.xy(cx, cy, sideLength, scores).map(point => point.join(",")).join(" ");
    },
    xy(cx, cy, sideLength, scores) {
        const points = [];
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 180) * (60 * i);
            const x = cx + (sideLength * scores[i]) * Math.cos(angle);
            const y = cy + (sideLength * scores[i]) * Math.sin(angle);
            points.push([x,y]);
        }
        return points;
    }
}