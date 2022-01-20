import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

#setup
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

#add document data
data = {
    u'Category': u'Weather',
    u'DateCreated': datetime.now(),
    u'IsFake': False,
    u'NewsHeadline': u'Nor\'easter spurs rescues in New Jersey as areas brace for hurricane-force wind gusts',
    u'NewsSource': u'https://www.nbcnews.com/news/weather/nor-easter-sparks-rescues-new-jersey-areas-brace-hurricane-force-n1282387',
    u'QuestionDifficulty': u'Easy'
}

#push document to firestore
db.collection(u'NewsFeeds').document(u'pyTest').set(data)