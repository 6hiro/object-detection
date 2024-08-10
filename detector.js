class Detector {
    constructor(parent) {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        parent.appendChild(this.canvas);

    }

    detect(imgData) {
        const points = [];
        for (let i = 0; i < imgData.data.length; i+=4) {
            const r = imgData.data[i];
            const g = imgData.data[i+1];
            const b = imgData.data[i+2];

            const yellowgreenness = this.#calculateYellowgreenness(r, g, b);

            if (yellowgreenness > 1 && yellowgreenness < 1.2) {
                const pIndex = i /4;
                const y = Math.floor( pIndex / imgData.width );
                const x = pIndex % imgData.width;

                points.push({x, y, yellowgreenness});
            }
        }

        this.canvas.width = imgData.width;
        this.canvas.height = imgData.height;
        
        if (points.length == 0) return null;
        
        const centeroid = this.#averagePoints(points);
        const size = this.#calculateSize(points);
        const radius = size / 2;
        
        // this.ctx.fillStyle = "rgb(87, 153, 58)";

        // for (const point of points) {
        //     this.ctx.globalAlpha = point.yellowgreenness*255;
        //     this.ctx.fillRect(point.x, point.y, 1, 1);
        // }

        // this.ctx.beginPath();
        // this.ctx.strokeStyle = "rgb(87, 153, 58)";
        // this.ctx.arc(centeroid.x, centeroid.y, radius, 0, Math.PI*2);
        // this.ctx.stroke();
        
        return centeroid;
    }

    #averagePoints(points) {
        const center ={x: 0, y: 0};
        for (let i = 0; i < points.length; i++) {
            center.x += points[i].x;
            center.y += points[i].y;
        }
        center.x /= points.length;
        center.y /= points.length;
        return center;
    }

    #calculateSize(points) {
        let minX = points[0].x;
        let maxX = points[0].x;
      
        points.forEach(point => {
          minX = Math.min(minX, point.x);
          maxX = Math.max(maxX, point.x);
        });
      
        const width = maxX - minX;
        return width;
    }


    #calculateYellowgreenness(r, g, b) {
        return (Math.abs(r-75) + Math.abs(g-140) + Math.abs(b-50) ) /255 + 1;
    }
}