#purpose of this script is to remove old headlines in order to keep news "fresh"
#might also be used if we need certain entries to be modified for standardization changes

import firebase_admin
from firebase_admin import credentials, firestore
import datetime
from datetime import timedelta

#Setup
accountKeyPath = "Account Key Path"
cred = credentials.Certificate(accountKeyPath)
firebase_admin.initialize_app(cred)
db = firestore.client()

#Date from two weeks ago/14 days
today = datetime.datetime.today()
date14DaysAgo = datetime.datetime.today() - timedelta(days=14)

#Read from Firestore into array
news_ref = db.collection(u'NewsFeeds')
docs = news_ref.stream()

for doc in docs:
    newsFeed = doc.to_dict()
    newsFeedID = newsFeed["HeadlineID"]
    addedDate = newsFeed["DateCreated"]
    addedDate = datetime.datetime.strptime(addedDate, '%m/%d/%Y')
    if date14DaysAgo > addedDate:
        db.collection(u'NewsFeeds').document(newsFeedID).delete()