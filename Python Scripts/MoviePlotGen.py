#Tutorial Source:
#https://juanitorduz.github.io/movie_plot_text_gen/

import numpy as np
import pandas as pd

movies_raw_df = pd.read_csv(r'C:\\Users\\nedf1\Desktop\school\Senior Design\wiki_movie_plots_deduped.csv')

movies_to_select = ((movies_raw_df['Genre'] == 'horror') & (movies_raw_df['Origin/Ethnicity'] == 'American') & (movies_raw_df['Release Year'] > 1999))

horror_df = movies_raw_df[movies_to_select]['Plot']
horror_str = horror_df.str.cat(sep=' ')

import spacy
nlp = spacy.load("en_core_web_sm", disable = ['parser', 'tagger', 'ner', 'lemmatizer'])

def get_tokens(doc_text):
    skip_pattern = '\r\n \n\n \n\n\n!"-#$%&()--.*+,-./:;<=>?@[\\]^_`{|}~\t\n\r '
    tokens = [token.text.lower() for token in nlp(doc_text) if token.text not in skip_pattern]
    return tokens

tokens = get_tokens(horror_str)

len_0 = 25
train_len = len_0 + 1
text_sequences = []

for i in range(train_len, len(tokens)):
    seq = tokens[i - train_len: i]
    text_sequences.append(seq)
    
' '.join(text_sequences[0])

for i in range(0, 5):
    print(' '.join(text_sequences[i]))
    print('-----')
    
from keras.preprocessing.text import Tokenizer
tokenizer = Tokenizer()
tokenizer.fit_on_texts(text_sequences)

sequences = tokenizer.texts_to_sequences(text_sequences)

vocabulary_size = len(tokenizer.word_counts)

sequences = np.array(sequences)

from tensorflow.keras.utils import to_categorical
X = sequences[:, :-1]
seq_len = X.shape[1]

y = sequences[:, -1]
y = to_categorical(y, num_classes = (vocabulary_size + 1))

from keras.models import Sequential
from keras.layers import Dense, LSTM, Embedding

def create_model(vocabulary_size, seq_len):
    model = Sequential()
    model.add(Embedding(input_dim=vocabulary_size, 
                        output_dim=seq_len, 
                        input_length=seq_len))
    model.add(LSTM(units=50, return_sequences=True))
    model.add(LSTM(units=50))
    model.add(Dense(units=50, activation='relu'))
    model.add(Dense(units=vocabulary_size, activation='softmax'))
    model.compile(loss='categorical_crossentropy', 
                  optimizer='adam', 
                  metrics=['accuracy'])
    model.summary()
    return model

model = create_model(vocabulary_size=(vocabulary_size + 1), seq_len=seq_len)
model.fit(x=X, y=y, batch_size=128, epochs=60, verbose=1)
loss, accuracy = model.evaluate(x=X, y=y)
print(f'Loss: {loss}\nAccuracy: {accuracy}')

from pickle import dump
dump(tokenizer, open('tokenizer', 'wb'))
model.save('model.h5')

from keras.models import load_model
model = load_model('model.h5')

from keras.preprocessing.sequence import pad_sequences

def generate_text(model, tokenizer, seq_len, seed_text, num_gen_words):
    output_text = []
    input_text = seed_text
    
    for i in range(num_gen_words):
        encoded_text = tokenizer.texts_to_sequences([input_text])[0]
        pad_encoded = pad_sequences([encoded_text], maxlen=seq_len, truncating='pre')
        # Do the prediction. Here we automatically choose the word with highest probability. 
        pred_word_ind = model.predict(pad_encoded, verbose = 0)
        print(pred_word_ind)
        classes_x=np.argmax(pred_word_ind,axis=1)[0]
        print(classes_x)
        pred_word = tokenizer.index_word[classes_x]
        input_text += ' ' + pred_word
        output_text.append(pred_word)
        
    return ' '.join(output_text)
    
sample_text = horror_df.iloc[100][:383]
print("sample horror story: ", sample_text)
seed_text = sample_text[:190]
print("seed text: ", seed_text)
generated_text = generate_text(model=model, 
                               tokenizer=tokenizer,
                               seq_len=seq_len, 
                               seed_text=seed_text, 
                               num_gen_words=40)
print(seed_text + ' ' + generated_text + '...')