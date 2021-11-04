import requests
from bs4 import BeautifulSoup
import re
import firebase_admin
from firebase_admin import credentials, firestore
import datetime

#Setup firebase credentials
accountKeyPath = r'C:\\Users\\nedf1\Desktop\serviceAccountKey.json'
cred = credentials.Certificate(accountKeyPath)
firebase_admin.initialize_app(cred)
db = firestore.client()

def push_to_firebase(headline, URL, category):
    today = datetime.date.today()
    today = datetime.date.strftime(today, "%m/%d/%Y")

    #create UID for document
    newsfeed_ref = db.collection(u'NewsFeeds').document()
    UID = newsfeed_ref.id


    document_data = {
        u'HeadlineID': UID,
        u'Category': category,
        u'DateCreated': today,
        u'IsFake': False,
        u'NewsHeadline': headline,
        u'NewsSource': URL,
        u'QuestionDifficulty': u'Easy'
        #image?
    }
    db.collection(u'NewsFeeds').document(UID).set(document_data)

root_URL = "https://www.foxnews.com"
page = requests.get(root_URL)

soup = BeautifulSoup(page.content, "html.parser")
results = soup.find(class_="main-content")

#get all article URLs
articleUrlList = []

#get spotlight article
article = results.find(class_="collection collection-spotlight has-hero")
article_url = article.find("a")
article_url = article_url['href']
articleUrlList.append(article_url)

#get rest of articles
listOfArticles = results.find("div", class_="collection collection-spotlight")
article_elements = listOfArticles.find_all("article")
for article_element in article_elements:
    article_url = article_element.find("a")
    article_url = article_url['href']
    articleUrlList.append(article_url)

#scrape each URL
for article in articleUrlList:
    page = requests.get(article)

    soup = BeautifulSoup(page.content, "html.parser")

    headline = soup.find(class_="headline").text.strip()

    temp = article[24:len(article):1] #get category after .com/ to / after category
    slashes = re.findall('/', temp) #find the slash after category
    index = temp.find(slashes[0]) #get location of slash
    category = temp[0:index:1] #pin down category
    category = category.title()
    category = category.replace("Us", "US")

    push_to_firebase(headline, article, category)