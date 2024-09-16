import math, json
from queue import PriorityQueue
from create_stations import global_stations

station_data = global_stations
stations = json.loads(station_data)

# Adjusted velocities for different lines (in km/h)
line_velocities = {
    "circle": 28.6,
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

line_colors = {
    "circle": "#FFD700",
    "district": "#006633",
    "bakerloo": "#B36305",
    "jubilee": "#A0A5A9",
    "metropolitan": "#751056",
    "hammersmith-city": "#F3A9BB",
    "northern": "#000000",
    "victoria": "#0098D8",
    "waterloo-city": "#95CDBA",
    "piccadilly": "#0019A8",
    "central": "#E32017"
}

# Constants
MIN_TRAVEL_TIME = 2  # Minimum travel time between two stations (minutes)
STOP_TIME_PER_STATION = 1.5  # Flat stop time at each station (minutes)
LINE_CHANGE_PENALTY = 5  # Time penalty for changing lines (minutes)
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

# Helper function to calculate travel time in minutes between two stations for a given line
def travel_time(coord1, coord2, line):
    distance = haversine_distance(coord1, coord2)
    velocity = line_velocities.get(line, 25)  # Default velocity if line not found
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

        print(f"\nExploring station: {current_station} with f_score: {current_f_score}")

        # Print current station lines for debugging
        current_lines = stations[current_station].get('line', [])
        print(f"Current station lines: {current_lines}")

        # Goal check
        if current_station == goal:
            return reconstruct_path_json(came_from, current_station, goal)

        for neighbor_name, neighbor_info in stations[current_station]['neighbours'].items():
            neighbor_lines = neighbor_info.get('line', [])
            print(f"Neighbor station: {neighbor_name}, Neighbor lines: {neighbor_lines}")

            # Ensure valid lines exist for both current and neighbor stations
            if not neighbor_lines or not current_lines:
                print(f"Skipping neighbor {neighbor_name} (No valid lines between stations).")
                continue

            # Find the best possible time between stations
            best_time = float('inf')
            best_line = None
            for current_line in current_lines:
                for neighbor_line in neighbor_lines:
                    time_to_neighbor = travel_time(
                        stations[current_station]['coordinates'],
                        neighbor_info['coordinates'],
                        neighbor_line
                    )

                    # Add line change penalty if switching lines
                    if current_line != neighbor_line:
                        time_to_neighbor += LINE_CHANGE_PENALTY

                    if time_to_neighbor < best_time:
                        best_time = time_to_neighbor
                        best_line = neighbor_line

            tentative_g_score = g_score[current_station] + best_time

            print(f"Checking neighbor {neighbor_name}: g_score = {tentative_g_score}, best_line = {best_line}")

            if tentative_g_score < g_score[neighbor_name]:
                # This is a better path
                print(f"Updating path to {neighbor_name} via line {best_line}")
                came_from[neighbor_name] = (current_station, best_line)
                g_score[neighbor_name] = tentative_g_score
                f_score[neighbor_name] = tentative_g_score + travel_time(
                    neighbor_info['coordinates'], stations[goal]['coordinates'], best_line)
                open_set.put((f_score[neighbor_name], neighbor_name))

    print("No path found.")
    return None  # No path found

# Helper function to reconstruct the path as JSON and calculate total time in minutes
def reconstruct_path_json(came_from, current, goal):
    path = []
    total_time = 0  # Total time in minutes
    first_station = current  # Capture the starting station

    while current in came_from:
        previous_station, line = came_from[current]
        time_taken = travel_time(stations[previous_station]['coordinates'], stations[current]['coordinates'], line)
        total_time += time_taken
        path.insert(0, {
            "station": current,
            "line": line,
            "color": line_colors.get(line, "#000000"),  # Default color if line not found
            "coordinates": stations[current]['coordinates'],
            "time_taken": round(time_taken, 2)  # Time in minutes (rounded to 2 decimal places)
        })
        current = previous_station

    # Set the correct line for the starting station
    if path:
        first_line = path[0]['line']
    else:
        first_line = None

    # Add the starting station with the correct line from the first step
    path.insert(0, {
        "station": current,
        "line": first_line,  # Use the first line for the starting station
        "coordinates": stations[current]['coordinates'],
        "time_taken": 0
    })

    return json.dumps({
        "start": first_station,
        "goal": goal,
        "path": path,
        "total_time_in_minutes": round(total_time, 2)  # Total time in minutes (rounded to 2 decimal places)
    })

if __name__ == "__main__":
    # Example usage
    start_station = "South Kensington Underground Station"
    goal_station = "Walthamstow Central Underground Station"

    path_json = a_star_search(start_station, goal_station)
    print(f"Path from {start_station} to {goal_station}:\n{path_json}")
