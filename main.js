/*--------------------------------------------|
 | AUTHOR: IMON RAJ                           |
 | JADAVPUR UNIVERSITY                        |
 | COMPUTER SCIENCE DEPARTMENT                |
 |                                            |
 | << THIS IS AN APPLICATION                  |
 | TO DRAW BEZIER CURVES >>                   |
 |                                            |
 | LAST MODIFIED DATE: 4th DECEMBER, 2022     |
 |--------------------------------------------|*/





/*************************************
 * Initializing Canvas, its Cotext and 
 * related data values.
 ************************************/
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const dpi = window.devicePixelRatio;
canvas.width = 991 * dpi;
canvas.height = 511 * dpi;
let w = canvas.width;
let h = canvas.height;
let gap = 30 * dpi;
canvas.style.width = "991px";
canvas.style.height = "511px";


/************************************
 * The Point class for Point drawing
 * and related work On the Canvas
 ************************************/
class Point {
    constructor(x, y, z, ctx) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.ctx = ctx;
        // this.fillPix();
    }

    fillPix() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, canvas.height - this.y, 1.5, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    circOutsidePt() { // To visualize the Control Points
        ctx.save();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "blue";
        ctx.fillStyle = "blue";
        this.ctx.beginPath();
        this.ctx.arc(this.x, canvas.height - this.y, 3, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(this.x, canvas.height - this.y, 14, 0, 2 * Math.PI);
        this.ctx.stroke();
        ctx.restore();
    }
}

/* Array to store the Control Points */
let pointarr = [];


/***************************************
 * For resetting the Canvas
 * i.e -> an empty canvas with
 * a grid structure 
 **************************************/
function clearCanvas() {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "rgb(170,240,170)";

    for (let x = 0; x <= w; x += gap) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
    }
    for (let x = 0; x <= h; x += gap) {
        ctx.moveTo(0, x);
        ctx.lineTo(w, x);
        ctx.stroke();
    }
    pointarr = [];

    ctx.strokeStyle = "rgb(0,0,0)";

}





/*******************************************
 * All the necessary Bezier Curve functions
 ******************************************/
function nci(n, i) {
    let ans = 1;
    for (let k = 1; k <= i; k++) {
        ans *= n;
        n--;
    }
    for (let k = 1; k <= i; k++) {
        ans /= k;
    }
    return ans;
}

function bez(i, n, u) {
    return nci(n, i) * Math.pow(u, i) * Math.pow((1 - u), (n - i));
}

function polynom(u, c) {
    let n = pointarr.length - 1;
    let ans = 0;

    for (let i = 0; i <= n; i++) {
        ans += pointarr[i][c] * bez(i, n, u);
    }

    return ans;
}

function drawCurve() {
    let t;
    let i = 0;
    let thresh = 1.5 / 2;
    for (let u = 0; u <= 1; u += 0.001) {
        let x = polynom(u, "x");
        let y = polynom(u, "y");
        let z = polynom(u, "z");
        let p = new Point(x, y, z, ctx);
        if (u != 0 && (Math.abs(p.x - t.x) > thresh || Math.abs(p.y - t.y) > thresh)) {
            // console.log(i);
            // i++;
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.moveTo(p.x, canvas.height - p.y);
            ctx.lineTo(t.x, canvas.height - t.y);
            ctx.stroke();
            ctx.restore();
        } else {
            p.fillPix();
        }

        t = p;
    }
    pointarr = [];
}
/*************************************** */


/******* Handling mouse click events on the canvas ******/
function getCursorPosition(event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    let pt = new Point(x * dpi, canvas.height - y * dpi, 0, ctx)
    pt.circOutsidePt()
    pointarr.push(pt);
}

canvas.addEventListener('mousedown', function (e) {
    getCursorPosition(e)
})
/****************************************************** */


function howtouse() {
    swal("How to Use?", "Click on the Canvas to select the control points sequentially, then click on 'Draw' to draw the corresponding Bezier Curve");
}

clearCanvas();  // initially making the canvas grid