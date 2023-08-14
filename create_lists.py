import requests
import json

class Station:
    def __init__(self, name, coordinates):
        self.name = name
        self.coordinates = coordinates
        self.connections = {}  # Dictionary to store connected stations and their costs

    def add_connection(self, station, cost):
        self.connections[station] = cost

# Fetch data from the API URL
def create_station_list():
    url = "https://raw.githubusercontent.com/oobrien/vis/master/tubecreature/data/tfl_stations.json"
    response = requests.get(url)
    data = response.text

    if response.status_code == 200:
        parse_json = json.loads(data)
        count = 0

        # Create Station objects and add connections
        stations = []
        for item in parse_json["features"]:
            station_name = parse_json['features'][count]['properties']['name']
            count += 1
            stations.append(station_name)

        return stations
    else:
        print("Failed to fetch data from the API.")
        return []


def create_coordinates_list():
    url = "https://raw.githubusercontent.com/oobrien/vis/master/tubecreature/data/tfl_stations.json"
    response = requests.get(url)
    data = response.text

    if response.status_code == 200:
        parse_json = json.loads(data)
        count = 0

        # Create Station objects and add connections
        coordinates = []
        for item in parse_json["features"]:
            station_coor = [parse_json["features"][count]['geometry']['coordinates'][0], parse_json["features"][count]['geometry']['coordinates'][1]]
            count += 1
            coordinates.append(station_coor)

        return coordinates
    else:
        print("Failed to fetch data from the API.")
        return []
    

if __name__ == "__main__":
    stations = create_station_list()
    print(stations)
        
    coordinates = create_coordinates_list()
    print(coordinates)
