import requests
import json 
import math


def get_coordinates_list():
    coordinates_response = requests.get('https://raw.githubusercontent.com/oobrien/vis/master/tubecreature/data/tfl_stations.json')
    coordinates_data = coordinates_response.text
    count = 0
    coordinate_list = []

    if coordinates_response.status_code == 200:
        parse_json = json.loads(coordinates_data)

        for coordinate in parse_json['features']:
            data = parse_json["features"][count]['geometry']['coordinates']
            count +=1
            coordinate_list.append(data) 
            #print(data)
        #print(coordinate_list[1][1])
        
        return coordinate_list
    

#get_coordinates_list()


def get_nearest_coordinate(start_latitude, start_longitude):

    # print(start_latitude)
    # print(start_longitude)
    coordinate_list = get_coordinates_list()
    curmin = 10000

    for coordinate in coordinate_list:
        station_latitude = coordinate[1]
        station_longitude = coordinate[0]

        lat = start_latitude-station_latitude
        lon = start_longitude-station_longitude

        station_distance = math.sqrt(lat**2 + lon**2)

        if station_distance < curmin:
            curmin_coordinate = coordinate
            curmin = station_distance
            # print()
            # print(curmin)
            # print(curmin_coordinate)
            # print()

    return curmin_coordinate

#nearest = get_nearest_coordinate(-0.172900093155076, 51.494037101038543)
#print(nearest)

def get_nearest_station(mincoordinate):
    response = requests.get('https://raw.githubusercontent.com/oobrien/vis/master/tubecreature/data/tfl_stations.json')
    data = response.text
    count = 0

    if response.status_code == 200: 
        parse_json = json.loads(data)

        for coordinates in parse_json['features']:
            count +=1
            if mincoordinate == parse_json['features'][count]['geometry']['coordinates']:
                #print(parse_json['features'][count]['properties']['name'])
                return parse_json['features'][count]['properties']['name']

# get_nearest_station(nearest)
