import requests
import json

line_stations = {
    "Circle": [],
    'District': [],
    'Bakerloo': [],
    'Jubilee': [],
    'Metropolitan': [],
    'Hammersmith & City': [],
    'Northern': [],
    'Victoria': [],
    'Waterloo & City': [],  
    'Piccadilly': [],
    'Central': []
}

def get_stations_by_line(line_id):
    sequences_response = requests.get(f'https://api.tfl.gov.uk/Line/{line_id}/Route/Sequence/outbound')
    if sequences_response.status_code == 200:
        sequences_data = sequences_response.json()
        return [[station["name"] for station in sequence["stopPoint"]] for sequence in sequences_data["stopPointSequences"]]
    return []

routes_response = requests.get('https://api.tfl.gov.uk/Line/Mode/tube')
if routes_response.status_code == 200:
    routes_data = routes_response.json()

    for route in routes_data:
        line_id = route["id"]
        line_name = route["name"]
        stations = get_stations_by_line(line_id)

        if line_name in line_stations:
            line_stations[line_name].extend(stations)

# Now line_stations is a dictionary of lists where each line contains a list of stations for each route

# Create a dictionary to store all the line routes
lines_data = {}
for line_name, stations in line_stations.items():
    lines_data[line_name] = stations

# Write the data to the JSON file
with open('routes.json', 'w') as routes_json:
    json.dump(lines_data, routes_json, indent=2, ensure_ascii=False)

print("Data has been written to 'routes.json' file.")

    

# n = 0
# u = 0
# circle_routes[n][u] = station_class({circle_routes[n][u]}, 60.521, 52.321, 50)
# n = 0
# u = 1
# circle_routes[n][u] = station_class({circle_routes[n][u]}, 61.521, 53.321, 5)

#print ((circle_routes[0][0]).longitude)

