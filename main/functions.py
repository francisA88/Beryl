import base64 as b64
import io
import pathlib
from copy import deepcopy

import PIL.Image as Image
import bs4
import requests

def search_for_results(query):
    known_sites = [
        None,
        'chegg.com',
        'byjus.com',
        'khanacademy.org',
        'testbook.com',
    ]
    all_results = []
    for site in known_sites:
        try:
            url = f'https://www.google.com/search?q={query}+site={site}' if site else f'https://www.google.com/search?q={query}'
            session = requests.Session()
            response = session.get(url)
            soup = bs4.BeautifulSoup(response.text, 'html.parser')
            results = soup.find_all('h3')
            results = [{'text': res.text, 
                        'link': 'https://www.google.com' + res.parent.parent.parent.attrs['href']
                        }
                        for res in results
                        ]
            
            all_results.extend(results)
        except:
            return 500
    return all_results


cropped_img_basepath = pathlib.Path(__file__).parent

def crop_b64_image(b64_image_string:str, coords:list[int]) -> bytes:
    '''Crops a given base64 image with the supplied coordinates [left:int, top:int, right:int, bottom:int].
    Returns a base64 image representation of the cropped image.'''

    img_buffer = io.BytesIO(
        b64.b64decode(b64_image_string))

    image = Image.open(img_buffer)
    needs_cropping = bool(coords[-1])
    if needs_cropping:
        print(coords[:-1])
        image = image.crop(coords[:-1])
        # cropped_image.save(cropped_img_basepath / 'cropped2.png')
    image.save(cropped_img_basepath / 'cropped2.png')
    
    return b64.b64encode(image.tobytes())

def image_to_base64(imagepath:str) -> str:
    with open(imagepath,'rb') as image:
        b64bytes = b64.b64encode(image.read())
        return 'data:image/png;base64,' + b64bytes.decode('utf-8')