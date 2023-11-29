rect = document.querySelector('.rect');
console.log(rect)
let isDown = false
x = rect.clientLeft;
y = rect.clientTop;

document.body.addEventListener('mousedown', function(ev){    
    isDown = true;
    rect.style.left = ev.clientX + 'px'
    rect.style.top = ev.clientY + 'px'
    rect.style.width = 0
    rect.style.height = 0
    x = ev.clientX;
    y = ev.clientY;
})
document.addEventListener('mousemove', function(ev){
    if (isDown){
        w = Math.abs(ev.clientX - x) + 'px';
        h = Math.abs(ev.clientY - y) + 'px';
        console.log(x, y, w, h)
        rect.style.width = w;
        rect.style.height = h;
    }
})
document.body.onmouseup = ()=>isDown = false;