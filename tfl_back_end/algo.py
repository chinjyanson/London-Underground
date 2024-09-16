import math, json
from queue import PriorityQueue
from create_stations import global_stations

station_data = global_stations
stations = json.loads(station_data)
print(stations)

# Adjusted velocities for different lines (in km/h)
line_velocities = {
    "circle" :  28.6,
    "district": 30.8,
    "bakerloo": 29.0,
    "jubilee": 38.6,
    "metropolitan": 41.5,
    "hammersmith-city": 27.6,
    "northern": 35.6,
    "victoria": 42.7,
    "waterloo-city": 33.3,  
    "piccadilly": 33.9,
    "central": 39.0
}

# Constants
MIN_TRAVEL_TIME = 2  # Minimum travel time between two stations (minutes)
STOP_TIME_PER_STATION = 1.5  # Flat stop time at each station (minutes)
EARTH_RADIUS_KM = 6371.0  # Radius of Earth in kilometers

# Helper function to calculate Haversine distance between two geographic coordinates
def haversine_distance(coord1, coord2):
    lat1, lon1 = math.radians(coord1[0]), math.radians(coord1[1])
    lat2, lon2 = math.radians(coord2[0]), math.radians(coord2[1])
    
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    
    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return EARTH_RADIUS_KM * c  # Distance in kilometers

# Helper function to calculate travel time in minutes between two stations
def travel_time(coord1, coord2, line):
    distance = haversine_distance(coord1, coord2)
    # print(line)
    if line:
        velocity = line_velocities.get(max(line), 25)  # Default velocity if line not found
    else:
        velocity = 25
    time_in_hours = distance / velocity
    time_in_minutes = time_in_hours * 60
    # Add stop time and ensure minimum travel time
    return max(time_in_minutes + STOP_TIME_PER_STATION, MIN_TRAVEL_TIME)

# A* search algorithm using time instead of distance
def a_star_search(start, goal):
    open_set = PriorityQueue()  # To store (f(n), station_name)
    open_set.put((0, start))
    
    came_from = {}  # To reconstruct the path
    g_score = {station: float('inf') for station in stations}
    g_score[start] = 0
    
    f_score = {station: float('inf') for station in stations}
    f_score[start] = travel_time(stations[start]['coordinates'], stations[goal]['coordinates'], None)

    while not open_set.empty():
        current_f_score, current_station = open_set.get()

        # Goal check
        if current_station == goal:
            return reconstruct_path_json(came_from, current_station, goal)

        for neighbor_name, neighbor_info in stations[current_station]['neighbours'].items():
            print(neighbor_info)
            print(neighbor_info.get('line'), neighbor_info['line'])
            line = neighbor_info.get('line')
            tentative_g_score = g_score[current_station] + travel_time(
                stations[current_station]['coordinates'], neighbor_info['coordinates'], line)

            # Add higher cost for line changes
            if 'line' in neighbor_info and 'line' in stations[current_station]['neighbours'].get(neighbor_name, {}):
                current_line = stations[current_station]['neighbours'][neighbor_name].get('line')
                neighbor_line = neighbor_info.get('line')
                if current_line != neighbor_line:
                    tentative_g_score += 5  # Higher cost for changing lines

            if tentative_g_score < g_score[neighbor_name]:
                # This is a better path
                came_from[neighbor_name] = (current_station, neighbor_info.get('line'))
                g_score[neighbor_name] = tentative_g_score
                f_score[neighbor_name] = tentative_g_score + travel_time(
                    neighbor_info['coordinates'], stations[goal]['coordinates'], line)
                open_set.put((f_score[neighbor_name], neighbor_name))

    return None  # No path found

# Helper function to reconstruct the path as JSON and calculate total time in minutes
def reconstruct_path_json(came_from, current, goal):
    path = []
    total_time = 0  # Total time in minutes
    while current in came_from:
        previous_station, line = came_from[current]
        time_taken = travel_time(stations[previous_station]['coordinates'], stations[current]['coordinates'], line)
        total_time += time_taken
        path.insert(0, {
            "station": current,
            "line": line,
            "coordinates": stations[current]['coordinates'],
            "time_taken": round(time_taken, 2)  # Time in minutes (rounded to 2 decimal places)
        })
        current = previous_station

    # Add the starting station
    path.insert(0, {
        "station": current,
        "line": None,  # Starting point doesn't have a previous line
        "coordinates": stations[current]['coordinates'],
        "time_taken": 0
    })
    
    return json.dumps({
        "start": current,
        "goal": goal,
        "path": path,
        "total_time_in_minutes": round(total_time, 2)  # Total time in minutes (rounded to 2 decimal places)
    })

if __name__ == "__main__":
    # Example usage
    start_station = "South Kensington Underground Station"
    goal_station = "Aldgate East Underground Station"

    path_json = a_star_search(start_station, goal_station)
    print(f"Path from {start_station} to {goal_station}:\n{path_json}")