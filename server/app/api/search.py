# app/api/search.py
import sys
from flask import Blueprint, jsonify, request, make_response, render_template
from sqlalchemy import exc

from app import db
from app.lib import elastickit
from app.lib import mlkit

search_blueprint = Blueprint('search', __name__, template_folder='./templates')

@search_blueprint.route('/ping', methods=['POST'])
def ping_pong():
    post_data = request.get_json()
    print(post_data, file=sys.stderr)
    return jsonify({
        'status': 'success',
        'message': 'pong!!'
    })

@search_blueprint.route('/search/index_count', methods=['GET'])
def index_count():
    res = elastickit.get_job_count()
    print(res, file=sys.stderr)
    return jsonify(res)

@search_blueprint.route('/search/basic', methods=['POST'])
def basic_search():
    post_data = request.get_json()
    query = post_data.get('query')
    print(post_data, file=sys.stderr)
    res = elastickit.basic_search(query, [], 0)
    print(res, file=sys.stderr)
    return jsonify(res)

@search_blueprint.route('/search/train', methods=['POST'])
def train_model():
    post_data = request.get_json()
    goods = post_data.get('thumbUps')
    bads = post_data.get('thumbDowns')
    if len(goods)>1 and len(bads)>1:
        res = mlkit.train_model(goods,bads)
    else:
        res = {}
    return jsonify(res)
