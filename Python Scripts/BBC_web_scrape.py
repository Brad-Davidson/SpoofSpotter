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


root_URL = "https://www.bbc.com/news"
page = requests.get(root_URL)

soup = BeautifulSoup(page.content, "html.parser")
results = soup.find(id="news-top-stories-container") #grab top stories

#get all article URLs
articleUrlList = []
article_elements = results.find_all("div", class_ = "gs-c-promo nw-c-promo gs-o-faux-block-link gs-u-pb gs-u-pb+@m nw-p-default gs-c-promo--inline gs-c-promo--stacked@m nw-u-w-auto gs-c-promo--flex")
for article_element in article_elements:
    article_a = article_element.find("a", class_ = "gs-c-promo-heading gs-o-faux-block-link__overlay-link gel-pica-bold nw-o-link-split__anchor")
    article_url = article_a['href']
    article_url = "https://www.bbc.com" + article_url
    articleUrlList.append(article_url)

#scrape each URL
for article in articleUrlList:
    page = requests.get(article)

    soup = BeautifulSoup(page.content, "html.parser")
    NewsHeadline = soup.find(id="main-heading").text.strip()

    numbers = re.findall('[0-9]+', article) #retrieve a list of numbers from URL
    index = article.find(numbers[0]) #find the index of the first number in URL
    category = article[25:index-1:1] #substring the URL beginning after news/ and ending at the first number -1
    category = category.replace("-", " & ")
    category = category.title()

    push_to_firebase(NewsHeadline, article, category)
