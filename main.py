#import write_routes_js
import func 
import json
import geocoder
import math

routes = open('routes.json', 'r')
routes = json.load(routes)

name_dict = {
    'Hammersmith (H&C Line)': 'Hammersmith',
    'Paddington (H' : 'Paddington',
    'Edgware Road (Circle Line)': 'Edgware Road',
    'Hammersmith (Dist&Picc Line)': 'Hammersmith',
    'Edgware Road (Bakerloo)': 'Edgware Road',
    "Shepherd's Bush (Central)" : "Shepherd's Bush",
}

class Station:
    def __init__(self, name, coordinates):
        self.name = name
        self.coordinates = coordinates
        self.connections = {}  # Dictionary to store connected stations and their costs

    def add_connection(self, station, cost):
        self.connections[station] = cost

    def __str__(self):
        return f"Station(name='{self.name}', coordinates='{self.coordinates}')"

station_names = func.create_station_list()
coordinates_list = func.create_coordinates_list()

stations_dict = {}
for i, name in enumerate(station_names):
    coordinates = coordinates_list[i]
    stations_dict[name] = Station(name, coordinates)

#create all the connections
count = -1
for x in routes:
    count +=1
    for y in range(len(routes[x])):
        for z in range(len(routes[x][y])-1):
            routes[x][y][z] = routes[x][y][z][:-20]
            tmpplusone = routes[x][y][z+1][:-20]
            try: 
                routes[x][y][z] = name_dict[routes[x][y][z]]
            except:
                waste = False
            try: 
                tmpplusone = name_dict[tmpplusone]
            except: 
                waste = False
           
            curline = list(routes.keys())[count]

            #print("station connection created for: ", stations_dict[routes[x][y][z]].name, " and ", stations_dict[tmpplusone].name)
            time = func.time_taken(stations_dict[routes[x][y][z]].coordinates, stations_dict[tmpplusone].coordinates, curline)
            stations_dict[routes[x][y][z]].add_connection(stations_dict[tmpplusone], time+2)
            stations_dict[tmpplusone].add_connection(stations_dict[routes[x][y][z]], time+2)
#print(routes.keys())
all_stations = list(set(stations_dict.values()))

# entering the location name
start_address = input("Please enter your location address: ")
getLoc = func.nametocoordinates(start_address)
start_coordinate = func.get_nearest_coordinate(getLoc[0], getLoc[1])
start = stations_dict[func.get_nearest_station(start_coordinate)]

stop_address = input("Please enter your destination address: ")
getLoc = func.nametocoordinates(stop_address)
stop_coordinate = func.get_nearest_coordinate(getLoc[0], getLoc[1])
stop = stations_dict[func.get_nearest_station(stop_coordinate)]

shortest_path = func.astar(start, stop, all_stations)
#print("We are currently on the ", curline, " line")

if shortest_path:
    print("Shortest path:")
    for station_names in shortest_path:
        print(station_names)
else:
    print("No path found.")
















