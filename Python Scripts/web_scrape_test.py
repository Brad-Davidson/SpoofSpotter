import requests
import re
from bs4 import BeautifulSoup

#URL = "https://realpython.github.io/fake-jobs/"
#page = requests.get(URL)
#print(page.text)

#soup = BeautifulSoup(page.content, "html.parser")

#results = soup.find(id="ResultsContainer")
#print(results.prettify())

#job_elements = results.find_all("div", class_ = "card-content")
#for job_element in job_elements:
#    title_element = job_element.find("h2", class_="title")
#    company_element = job_element.find("h3", class_="company")
#    location_element = job_element.find("p", class_="location")
#    print(title_element.text.strip())
#    print(company_element.text.strip())
#    print(location_element.text.strip())
#    print()

#BBC example
#for finding individual articles from bbc.com/news maybe find the <href> value
#and add to an array and then iterate through it doing below method

URL = "https://www.bbc.com/news/science-environment-59049770"
page = requests.get(URL)

soup = BeautifulSoup(page.content, "html.parser")
NewsHeadline = soup.find(id="main-heading").text.strip()

numbers = re.findall('[0-9]+', URL)
index = URL.find(numbers[0])
category = URL[25:index-1:1]
category = category.replace("-", " & ")
category = category.title()
print("Source: ", URL)
print("Headline: ", NewsHeadline)
print("Category: ", category)

#other news sites: fox news, cnn, nbc, usa today??, onion