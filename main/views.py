import os
import pathlib
import json

from django.shortcuts import render
from django.http import JsonResponse

import ocrspace
from dotenv import load_dotenv

from .functions import crop_b64_image, cropped_img_basepath, search_for_results

env_file = pathlib.Path(__file__).parent / 'vars.env'
print(env_file)

load_dotenv(env_file)


def index(request):
    return render(request, 'index.html')

def process_image_from_frontend(request):
    try:
        ocr = ocrspace.API(
            api_key=os.getenv('APIKEY'),
            OCREngine=2,
            isTable=True
        )
    except Exception as e:
        print(e)
        print(e.args)
        return JsonResponse({'result': '', 'status': 500, 'err_msg': e.args[0]})
    
    if not request.method == 'POST':
        return JsonResponse({'result': '', 'status': 405, 'err_msg': 'Unsupported Request'})
    
    data = json.loads(request.body)
    b64_image_data:str = data.get('image')
    bounding_box:list[int] = data.get('bbox')
    print(bounding_box)
    # print(b64_image_data)
    b64_croppped_img_string = crop_b64_image(b64_image_data, bounding_box)

    prefix = 'data:image/png;base64,'
    fp = open(cropped_img_basepath / 'cropped2.png', 'rb')
    try:
        extracted_text_from_image2 = ocr.ocr_file(fp)
        print(extracted_text_from_image2)
    except Exception as e:
        print(e)
        return JsonResponse({'result': '', 'status': 500, 'err_msg': e.args[0]})
    
    return JsonResponse({'result': extracted_text_from_image2, 'status': 200, 'err_msg': ''})

def fetch_results(request):
    query_string = request.body
    print('Query beans: ', query_string)
    query_results = search_for_results(query_string)
    if query_results == 500:
        return JsonResponse({'result': '', 'status': 500, 'err_msg': 'Something went wrong'})
    
    return JsonResponse({'result': query_results, 'status': 200, 'err_msg': ''})