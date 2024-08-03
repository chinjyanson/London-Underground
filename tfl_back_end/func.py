from geopy.geocoders import Nominatim
import requests
import heapq
import json
import math

class Station:
    def __init__(self, name, coordinates):
        self.name = name
        self.coordinates = coordinates
        self.connections = {}  # Dictionary to store connected stations and their costs

    def add_connection(self, station, cost):
        self.connections[station] = cost

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

def tube_speed(line_name):
    tube_speeds = open('tube_speeds.json', 'r')
    tube_speeds = json.load(tube_speeds)
    if tube_speeds["stations"]["speed"][line_name]:
        line_speed = tube_speeds["stations"]["speed"][line_name]
        
    else:
        line_speed = 0
    return line_speed

def station_corresponding_line(station):
    response = requests.get('https://raw.githubusercontent.com/oobrien/vis/master/tubecreature/data/tfl_stations.json')
    data = response.text
    parse_json = json.loads(data)

    if response.status_code == 200:
        if station == "Hammersmith":
            line_list = ['Circle', 'Hammersmith & City', 'District', 'Piccadilly']
        elif station == "Paddington":
            line_list = ['Bakerloo', 'District', 'Circle', 'Hammersmith & City']
        elif station == "Edgware Road":
            line_list = ['Bakerloo', 'District', 'Circle', 'Hammersmith & City']
        elif station == "Shepherd's Bush":
            line_list = ['Central']
        elif station == "Euston":
            line_list = ['Hammersmith & City', 'Circle', 'Metropolitan', 'Northern', 'Victoria']
        else:
            count = -1
            count2 = -1

            line_list = []

            for line in parse_json['features']:
                count += 1
                for name in parse_json['features'][count]['properties']["lines"]:
                    if station == parse_json['features'][count]['properties']['name']:
                        count2 += 1
                        line_list.append(parse_json['features'][count]['properties']["lines"][count2]["name"])

    return line_list


def nametocoordinates(name):
    loc = Nominatim(user_agent="GetLoc")
    getLoc = loc.geocode(name)
    
    print(getLoc.address)
    return (getLoc.latitude, getLoc.longitude)

def coordinatestoname(coordinates):
    geoLoc = Nominatim(user_agent="GetLoc")
    
    # passing the coordinates
    locname = geoLoc.reverse(coordinates)
    
    # printing the address/location name
    print(locname.address)
    return locname.address


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
    
def get_nearest_coordinate(start_latitude, start_longitude):
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

    return curmin_coordinate

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
            

def heuristic(a, b):
    ax = a.coordinates[0]
    ay = a.coordinates[1]
    bx = b.coordinates[0]
    by = b.coordinates[1]
    # Euclidean distance is used as the heuristic to estimate the remaining cost from a to b
    return ((ax - bx) ** 2 + (ay - by) ** 2) ** 0.5

def astar(start, goal, stations):
    open_set = [] 
    closed_set = set()
    came_from = {}
    g_score = {station: float('inf') for station in stations}
    g_score[start] = 0
    f_score = {station: float('inf') for station in stations}
    f_score[start] = heuristic(start, goal)

    heapq.heappush(open_set, (f_score[start], start))

    while open_set: 
        current = heapq.heappop(open_set)[1]

        if current == goal:
            path = reconstruct_path(came_from, goal)
            total_cost = g_score[goal]
            print("Total time taken for the travel path:", round(total_cost), " minutes")
            return path

        closed_set.add(current)

        for neighbor, cost in current.connections.items():
            if neighbor in closed_set:
                continue

            tentative_g_score = g_score[current] + cost

            if tentative_g_score < g_score[neighbor]:
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g_score
                f_score[neighbor] = g_score[neighbor] + heuristic(neighbor, goal)

                if neighbor not in [station[1] for station in open_set]:
                    heapq.heappush(open_set, (f_score[neighbor], neighbor))

    return None  # If there's no path found

def reconstruct_path(came_from, current):
    path = [current]

    while current in came_from:
        current = came_from[current]
        path.append(current)

    return list(reversed(path))

def time_taken(coordinate1, coordinate2, line_name):
    tube_speeds = open('tube_speeds.json', 'r')
    tube_speeds = json.load(tube_speeds)
    if tube_speeds["stations"]["speed"][line_name]:
        line_speed = tube_speeds["stations"]["speed"][line_name]
    else:
        line_speed = 0

    lat1 = coordinate1[0]
    lon1 = coordinate1[1]
    lat2 = coordinate2[0]
    lon2 = coordinate2[1]

    # Convert latitude and longitude from degrees to radians
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)

    # Haversine formula
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    # Earth's radius in kilometers (mean radius)
    earth_radius_km = 6371.0

    # Calculate the distance
    distance_km = earth_radius_km * c
    # print(distance_km)
    # print(line_speed)

    time_taken = distance_km / line_speed

    time_taken = time_taken * 60

    return time_taken