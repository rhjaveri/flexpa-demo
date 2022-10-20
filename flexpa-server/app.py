from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from os import environ
import requests



app = Flask(__name__)
CORS(app, allow_headers='content_type', origins='*')

@app.route('/flexpa-access', methods=["POST"])
@cross_origin()
def access_token_exchange():
    input_json = request.get_json()
    public_token = input_json.get('public-token') if 'public-token' in input_json else None
    secret_key = environ.get('SECRET_KEY')
    if not public_token:
        return "missing public token in request", 400
    if not secret_key:
        return "missing secret key in environment", 500

    request_json = {'public_token':public_token, 'secret_key': secret_key}
    res = requests.post('https://api.flexpa.com/link/exchange', json=request_json)
    exchange_response = res.json()
    if res.status_code != 200:
        return exchange_response.get('message'), 500
    if "access_token" in exchange_response and "expires_in" in exchange_response:
        return jsonify({"access_token": exchange_response.get('access_token'), "expires_in": exchange_response.get('expires_in')})
    return "error getting access token", 500
