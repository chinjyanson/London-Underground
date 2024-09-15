from geopy.geocoders import Nominatim
import requests
import json
import math
from create_stations import global_stations

def name_to_coordinates(name):
    loc = Nominatim(user_agent="GetLoc")
    getLoc = loc.geocode(name)
    
    print(getLoc.address)
    return (getLoc.latitude, getLoc.longitude)

def coordinates_to_name(coordinates):
    geoLoc = Nominatim(user_agent="GetLoc")
    
    # passing the coordinates
    locname = geoLoc.reverse(coordinates)
    
    # printing the address/location name
    print(locname.address)
    return locname.address

def get_distance(coord1, coord2):
    return math.sqrt((coord1[0] - coord2[0]) ** 2 + (coord1[1] - coord2[1]) ** 2)

def get_nearest_station(cur_coordinate):
    stations_json = json.loads(global_stations)
    curmin_distance = float('inf')
    closest_station = ''

    for station_name, station_details in stations_json.items():
        if curmin_distance > get_distance(station_details['coordinates'], cur_coordinate):
            curmin_distance = get_distance(station_details['coordinates'], cur_coordinate)
            # min_coordinates = station['coordinates']
            closest_station = station_name
    
    return closest_station
    
if __name__ == "__main__":
    print(get_nearest_station((51.494536, -0.100606)))