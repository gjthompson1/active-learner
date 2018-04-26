from elasticsearch import Elasticsearch
from elasticsearch import helpers

import pandas as pd

ELASTICSEARCH_HOST = 'elastic:changeme@localhost:9200'
es = Elasticsearch([ELASTICSEARCH_HOST], verify_certs=True)
es.info()

index_name = 'movie_index'
type_name = 'movie_doc'

CHUNK_SIZE = 10000
MAX_CHUNK_BYTES = 10000000

def convert_strings(val):
    return None if str(val).strip() in ['nan','None',''] else val

def convert_numbers(val):
    if str(val) in ['nan','None','']:
        res = None
    else:
        try:
            res = float(str(val))
        except:
            res = None
    return res

def _build_index_structure(index_name, type_name, data, _id):
    d = {
        '_index': index_name,
        '_type': type_name,
        '_id': str(_id),
        '_source': {
            'imdb_id': convert_strings(data.get('imdb_id')),
            'title': convert_strings(data.get('title')),
            'genres': convert_strings(data.get('genres')),
            'vote_average': convert_numbers(data.get('vote_average')),
            'vote_count': convert_numbers(data.get('vote_count')),
            'revenue': convert_numbers(data.get('revenue')),
            'runtime': convert_numbers(data.get('runtime')),
        }
    }
    return d

def _robust_index(es, data):

    COMPLETE = 0
    actions = []
    x = 1
    for row in data:
        action = _build_index_structure(index_name, type_name, row, x)
        actions.append(action)
        x+=1

        if len(actions)>=CHUNK_SIZE:
            print("PUSHING TO ELASTICSEARCH, COMPLETE",COMPLETE)
            helpers.bulk(es, actions,request_timeout=60)
            COMPLETE+=len(actions)
            actions = []

    print("PUSHING TO ELASTICSEARCH, COMPLETE",COMPLETE)
    helpers.bulk(es, actions,request_timeout=60)
    COMPLETE+=len(actions)
    actions = []

## START INDEX ##

df = pd.read_csv('data/AllMoviesDetailsCleaned.csv',delimiter=';')
data = df.to_dict('records')

_robust_index(es, data)
es.indices.put_settings(index=index_name,body= {"index" : {"max_result_window" : 5000}})

# es.indices.delete(index=index_name)

types = []
i = 0
for row in data:
    i+=1
    print(i, end='\r')
    if str(row['genres']) not in [None,'nan','']:
        types = types + row['genres'].split('|')

pd.Series(types).value_counts()
