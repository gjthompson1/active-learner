# project/api/search.py
import sys
from flask import Blueprint, jsonify, request, make_response, render_template
from sqlalchemy import exc

from app import db
# from project.api.lib import elastickit

search_blueprint = Blueprint('search', __name__, template_folder='./templates')

@search_blueprint.route('/ping', methods=['GET'])
def ping_pong():
    return jsonify({
        'status': 'success',
        'message': 'pong!!'
    })
