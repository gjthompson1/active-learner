# app/api/search.py
import sys
from flask import Blueprint, jsonify, request, make_response, render_template
from sqlalchemy import exc

from app import db
from app.lib import elastickit

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
