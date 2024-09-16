import requests
import json, jsonify
from cache_client import station_cache

def get_stations_by_line(stations, line_id):
    print(line_id)
    print("")
    
    sequences_response = requests.get(f'https://api.tfl.gov.uk/Line/{line_id}/Route/Sequence/outbound')
    if sequences_response.status_code == 200:
        sequences_data = sequences_response.json()
        for sequence in sequences_data["stopPointSequences"]:
            stop_points = sequence["stopPoint"]

            # Iterate through each station in the sequence by index
            for i, station in enumerate(stop_points):
                station_name = station["name"]
                station_coords = (station["lat"], station["lon"])

                # If the station doesn't exist in the stations dict, add it
                if station_name not in stations:
                    stations[station_name] = {
                        "name": station_name,
                        "line": [line_id],
                        "coordinates": station_coords,
                        "neighbours": {}
                    }
                else:
                    # If the station already exists, update the line
                    if line_id not in stations[station_name]["line"]:
                        stations[station_name]["line"].append(line_id)

                # Handle the previous neighbor (station before current station)
                if i > 0:
                    prev_station = stop_points[i - 1]
                    prev_station_name = prev_station["name"]
                    if prev_station_name not in stations[station_name]["neighbours"]:
                        stations[station_name]["neighbours"][prev_station_name] = {
                            "name": prev_station_name,
                            "line": [line_id],  # Ensure this is a list
                            "coordinates": (prev_station["lat"], prev_station["lon"]),
                        }
                    else:
                        if line_id not in stations[station_name]["neighbours"][prev_station_name]["line"]:
                            stations[station_name]["neighbours"][prev_station_name]["line"].append(line_id)

                # Handle the next neighbor (station after current station)
                if i < len(stop_points) - 1:
                    next_station = stop_points[i + 1]
                    next_station_name = next_station["name"]
                    if next_station_name not in stations[station_name]["neighbours"]:
                        stations[station_name]["neighbours"][next_station_name] = {
                            "name": next_station_name,
                            "line": [line_id],  # Ensure this is a list
                            "coordinates": (next_station["lat"], next_station["lon"]),
                        }
                    else:
                        if line_id not in stations[station_name]["neighbours"][next_station_name]["line"]:
                            stations[station_name]["neighbours"][next_station_name]["line"].append(line_id)

    return stations

# def naptan_name_pairs():
#     # cache = naptan_cache.get("naptan_cache")
#     # if cache:
#     #     return jsonify(json.loads(cache))
#     # else:
#         naptan_hash = {}
#         for line_id in get_all_available_lines():
#             response = requests.get(f"https://api.tfl.gov.uk/line/{line_id}/stoppoints")
#             if response.status_code == 200:
#                 data = response.json()
#                 for station in data:
#                     naptan_hash[station["commonName"]] = station["naptanId"]
#         # naptan_cache.put('naptan_cache', naptan_hash)
#         return naptan_hash

# def find_naptan_pairs(commonName: str):
#     return naptan_name_pairs()[commonName]

def get_all_available_lines():
    routes_response = requests.get('https://api.tfl.gov.uk/Line/Mode/tube')
    if routes_response.status_code == 200:
        routes_data = routes_response.json()
        return [route["id"] if route["disruptions"] == [] else None for route in routes_data]
    return []

def create_stations():
    try:
        cache_data = station_cache.get("station_cache")

        if cache_data:
            return cache_data
    except:
        pass
    
    stations = {}
    for line in get_all_available_lines():
        stations = get_stations_by_line(stations, line)
        # print(stations)
        # print("")
    try:
        station_cache.put('station_cache', json.dumps(stations))
    except:
        pass
    return json.dumps(stations)

global_stations = create_stations()

if __name__ == "__main__":
    # stations={}
    # print(get_stations_by_line(stations, "circle"))
    # print("")
    # print(get_stations_by_line(stations, "district"))
    print(global_stations)
# stations = {'Elephant & Castle Underground Station': {'name': 'Elephant & Castle Underground Station', 'coordinates': (51.494536, -0.100606), 'naptanID': None, 'neighbours': {}}}
# print(get_stations_by_line(stations, "bakerloo"))