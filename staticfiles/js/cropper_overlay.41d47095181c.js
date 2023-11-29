rect = document.querySelector('#rect');
image = document.querySelector('#loaded-image')

console.log(rect)
let isDown = false
touchdown = {x:null, y:null}

let coord = [0, 0, 0, 0, 0];

image.addEventListener('pointerdown', function(ev){  
    console.log('hello') ;
    isDown = true;
    touchdown.x = ev.clientX;
    touchdown.y = ev.clientY;
    rect.style.left = ev.clientX + 'px'
    rect.style.top = ev.clientY + window.scrollY + 'px'
    rect.style.width = 0;
    rect.style.height = 0;
    x = ev.layerX;
    y = ev.layerY;
    coord[0] = x;
    coord[1] = y;
})
image.addEventListener('pointermove', function(ev){
    console.log('helllo 1')
    if (isDown){
        w = Math.abs(ev.layerX - x) + 'px';
        h = Math.abs(ev.layerY - y) + 'px';
        if (Math.abs(x - ev.layerX) > image.width || Math.abs(y - ev.layerY) > image.height) return;
        
        if (ev.layerX < x && !(ev.layerY < y)){
            rect.style.transform = 'scaleX(-1)'
            rect.style.transformOrigin = 'left'
        }
        else if ((ev.layerY < y) && !(ev.layerX < x)){
            rect.style.transform = 'scaleY(-1)'
            rect.style.transformOrigin = 'top'
        }
        else if (ev.layerX < x && ev.layerY < y){
            rect.style.transform = 'scale(-1, -1)'
            rect.style.transformOrigin = 'left top'
        }
        else rect.style.transformOrigin = '';
        rect.style.width = w;
        rect.style.height = h;
        nx = ev.clientX;
        ny = ev.clientY;
    }
})
document.onpointerup = ()=>{
    isDown = false;
    let imrect = image.getBoundingClientRect();
    let rrect = rect.getBoundingClientRect();
    //Coordinates relative to the displayed image's size.
    let relY = - imrect.top + rrect.top;
    let relX = rrect.left - imrect.left;
    let relX2 = relX + rrect.width;
    let relY2 = relY + rrect.height;
    console.log('P: ', relX, relY, relX2, relY2);
    //Actual coordinates relative to the actual image's size.
    let realX = linInterpol(imrect.width, relX, image.naturalWidth);
    let realY = linInterpol(imrect.height, relY, image.naturalHeight);
    let realX2 = linInterpol(imrect.width, relX2, image.naturalWidth);
    let realY2 = linInterpol(imrect.height, relY2, image.naturalHeight);
    if (rrect.width > 4 && rrect.height > 4) coord = [realX, realY, realX2, realY2, 1];
    else coord = [realX, realY, realX2, realY2, 0];
    console.log('Q: ', coord)
}

function linInterpol(x1, val, x2){
    /* Interpolate between the displayed size and the actual loaded image's size */
    return  val * x2 / x1;
}
