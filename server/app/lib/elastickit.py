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

        row['imdb_id'] = hit['_source'].get('imdb_id')
        row['title'] = hit['_source'].get('title')
        row['genres'] = hit['_source'].get('genres')
        row['overview'] = hit['_source'].get('overview')
        row['status'] = hit['_source'].get('status')
        row['spoken_languages'] = hit['_source'].get('release_date')
        row['release_date'] = hit['_source'].get('release_date')

        row['vote_average'] = hit['_source'].get('vote_average')
        row['vote_count'] = hit['_source'].get('vote_count')
        row['revenue'] = hit['_source'].get('revenue')
        row['runtime'] = hit['_source'].get('runtime')
        row['budget'] = hit['_source'].get('budget')
        row['popularity'] = hit['_source'].get('popularity')
        row['release_year'] = hit['_source'].get('release_year')
        row['spoken_languages_number'] = hit['_source'].get('spoken_languages_number')
        row['production_countries_number'] = hit['_source'].get('production_countries_number')

        row['original_language'] = hit['_source'].get('original_language')
        row['original_title'] = hit['_source'].get('original_title')
        row['production_companies'] = hit['_source'].get('production_companies')
        row['tagline'] = hit['_source'].get('tagline')

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
