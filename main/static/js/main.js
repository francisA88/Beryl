// 
const form = document.forms[0];
const input = document.querySelector('input[type=file]');
const loadedImage = document.querySelector('#loaded-image');
const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
const resultDisplay = document.querySelector('#image-text');
const urlResults = document.querySelector('.url-results');
const submitBtn = document.querySelector('input[type=submit]')

input.addEventListener('change', function(e){
    console.log(e.target.files);
    loadedImage.src = URL.createObjectURL(e.target.files[0]);
    loadedImage.onload = function() {
        URL.revokeObjectURL(loadedImage.src) // free memory
        
      }
    
})
form.addEventListener('submit', function(e){
    e.preventDefault();
    submitBtn.value = 'SEARCHING...'
    let base64_representation = getBase64Image(loadedImage);
    sendImageToBackend(base64_representation, coord).catch((err)=>{
        //Do something better here later
        notify();
        return;
    }).then((jsonRes)=>{
        console.log(jsonRes);
        if (jsonRes.status !== 200){
            notify('Something went wrong.')
            return;
        }
        resultDisplay.innerHTML = `Searching For "${jsonRes.result.slice(0, 14)}..."`
        let websearch = searchWebForMatches(jsonRes.result);
        websearch.then(result=>{
            console.log('rEs: ', result)
            submitBtn.value = 'SEARCH'
            if (result.status !== 200) return notify('Oops, something went wrong');
            resultDisplay.style.display = 'none';
            urlResults.innerHTML = '';
            for (res of result.result){
                li = document.createElement('li');
                li.innerHTML = `<li><b>-</b><a href='${res.link}' target='_blank'> ${res.text}</a></li>`
                urlResults.appendChild(li);
            }
        }).catch(err=> submitBtn.value = 'SEARCH')
    }).catch(err=> submitBtn.value = 'SEARCH')
})

function notify(msg){
    notification = document.querySelector('.notification')
    notification.classList.remove('hidden');
    if (msg){
        notification.innerText = msg;
    }
    setTimeout(()=>notification.classList.add('hidden'), 2000);
}

document.querySelectorAll('.notification .delete').forEach(el=>{
    el.addEventListener('click', function(ev){
        el.parentElement.classList.add('hidden');
    })
})
async function searchWebForMatches(string){
    let request = await fetch(`fetch-results/`, {
        method: 'POST',
        headers:{
            'content-type': 'application/text',
            'X-CSRFToken': csrftoken
        },
        body: string
    });
    let response = await request.json();
    return response;
}
async function sendImageToBackend(b64string, box_coords){
    let request = await fetch('process-image/', {
        method: 'POST',
        mode: 'same-origin',
        headers:{
            'content-type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            image: b64string,
            bbox: box_coords
        })
    });
    let response = await request.json();
    console.log(response);
    return response;
}


//From StackOverflow https://stackoverflow.com/questions/22172604/convert-image-from-url-to-base64
function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/?[A-z]*;base64,/, '');
  }