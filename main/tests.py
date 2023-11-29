import requests
from bs4 import BeautifulSoup

response = requests.get('https://www.google.com/search', params={'q':'beans'})

soup = BeautifulSoup(response.content, 'html.parser')
h3 = soup.find_all('h3')
print(dir(h3[0]))
print(h3[0].parent.parent.parent.attrs)
print(h3.source)
print(*((h.text, h.parent.parent.parent) for h in h3), sep='\n')
