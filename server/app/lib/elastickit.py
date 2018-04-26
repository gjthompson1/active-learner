import sys
sys.path.append('../..')

from elasticsearch import Elasticsearch

import csv
import time
import os

ELASTICSEARCH_HOST = 'elastic:changeme@docker.for.mac.localhost:9200'
print(ELASTICSEARCH_HOST, file=sys.stderr)
es = Elasticsearch([ELASTICSEARCH_HOST])

index_name = 'movie_index'
type_name = 'movie_doc'

def get_job_count():
    res = es.indices.stats(index_name, metric='docs')
    count = res['_all']['total']['docs']['count']
    results = {}
    results['count'] = count
    return results
