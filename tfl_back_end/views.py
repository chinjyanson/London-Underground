from flask import Flask, jsonify, request
from algo import *
from utils import name_to_coordinates, get_nearest_station
from create_stations import create_stations
from cache_client import station_cache
import json
from flask_cors import CORS


# Flask constructor takes the name of 
# current module (__name__) as argument.
app = Flask("TFL_Back_End")
CORS(app)  # Enable CORS for all routes

# The route() function of the Flask class is a decorator, 
# which tells the application which URL should call 
# the associated function.
@app.route('/find_optimal_path', methods=['GET'])
def find_optimal_path():
    # Get 'start' and 'end' from query parameters
    start_lng = request.args.get('start_lng')
    start_lat = request.args.get('start_lat')
    end_lng = request.args.get('end_lng')
    end_lat = request.args.get('end_lat')

    start_lng = float(start_lng)
    start_lat = float(start_lat)
    end_lng = float(end_lng)
    end_lat = float(end_lat)
    
    if not start_lng or not end_lng:
        return jsonify({"error": "Please provide both start and end locations."}), 400

    # Find nearest station to start location
    # start_loc = name_to_coordinates(start)
    start_station = get_nearest_station((start_lat, start_lng))

    # Find nearest station to end location
    # end_loc = name_to_coordinates(end)
    end_station = get_nearest_station((end_lat, end_lng))
    
    # Find shortest path using A* search
    shortest_path = a_star_search(start_station, end_station)
    # print(shortest_path)

    return shortest_path  # Return JSON response

if __name__ == '__main__':
    # run() method of Flask class runs the application
    # on the local development server.
    app.run()