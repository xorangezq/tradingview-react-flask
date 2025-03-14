from flask import Flask, jsonify, request
from flask_cors import CORS

from datetime import datetime, timedelta
import random

from api import *

from loguru import logger

server = Flask(__name__)
CORS(server)

logger.info('Start listening...')

@server.route('/stock')
def stock_info():
    code = request.args.get('code')
    return jsonify({"data": api_stock_info(code)})

@server.route('/known_stocks')
def known_stocks():
    return jsonify({"data": api_known_stocks()})

@server.route('/data', methods=['POST'])
def data():
    logger.info(request.json['code'])
    code = request.json['code']
    code = str(code)
    data = api_code_data(code)
    # logger.debug(data)
    return jsonify({"data": data})

@server.route('/transactions', methods=['POST'])
def transactions():
    code = request.json['code']
    code = str(code)
    data = api_code_transactions(code)
    # logger.debug(data)
    return jsonify({"data": data})


@server.route('/', methods=['POST'])
def dispatch():
    req = request.json

    status = 'FAILED'
    msg = ''
    try:
        msg = services[req['service']](req['payload'])
    except KeyError:
        msg = 'expect request json with \'service\' and \'payload\'\n'
        msg += 'supported services: ' + '\n'.join(list(services.keys())) + '\n'
    result = status + ' ' + msg
    return {'result' : result}

if __name__ == '__main__':
    server.run(debug=True, port=3000)
