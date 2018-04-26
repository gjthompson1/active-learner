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

def clean_hits(hits):
    out = []
    for hit in hits:
        row = {}
        row['id'] = hit['_id']
        row['title'] = hit['_source']['title']
        row['genres'] = hit['_source']['genres']
        out.append(row)
    return out

def basic_search(query, search_filters, search_from):
    '''
        search_from=0
        search_filters=[
            {'field': 'country.keyword', 'value': 'United States'}
        ]
    '''
    print(query, file=sys.stderr)

    should_terms = [
        {
            "multi_match": {
                "query": "{}".format(query),
                "fields": ['title','genres'],
            }
        }
    ]

    search_filters_clean = [{'term':{x['field']:x['value']}} for x in search_filters]

    if search_filters_clean == []:
        must_terms = [{"bool": {"should": should_terms}}]
    else:
        must_terms = search_filters_clean + [{"bool": {"should": should_terms}}]

    bdy = {
        "from" : search_from,
        "size" : 10,
        "query": {
            "bool": {
                "must": must_terms
            }
        }
        # "aggs" : {
        #     "country" : {
        #         "terms" : {
        #             "field" : "country.keyword" ,
        #             "size": agg_counts.get('country',{}).get('count',5)
        #         }
        #     }
        # }
    }

    print(bdy, file=sys.stderr)
    ans = es.search(index=index_name, doc_type=type_name ,body=bdy, size=10)
    # print(ans, file=sys.stderr)
    hits = ans.get('hits',{}).get('hits',{})

    took = ans.get('took','')
    results = {}
    results['took'] = took
    results['results'] = clean_hits(hits)
    results['num_results'] = ans.get('hits',{}).get('total','')
    print(results, file=sys.stderr)
    # results['aggs'] = ans.get('aggregations',{})
    return results
