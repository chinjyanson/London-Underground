import math, json, requests
from queue import PriorityQueue
from create_stations import global_stations

station_data = global_stations

stations = json.loads(station_data)

# Helper function to calculate Euclidean distance between two coordinates
def euclidean_distance(coord1, coord2):
    return math.sqrt((coord1[0] - coord2[0]) ** 2 + (coord1[1] - coord2[1]) ** 2)

# A* search algorithm
def a_star_search(start, goal):
    open_set = PriorityQueue()  # To store (f(n), station_name)
    open_set.put((0, start))
    
    came_from = {}  # To reconstruct the path
    g_score = {station: float('inf') for station in stations}
    g_score[start] = 0
    
    f_score = {station: float('inf') for station in stations}
    f_score[start] = euclidean_distance(stations[start]['coordinates'], stations[goal]['coordinates'])

    while not open_set.empty():
        current_f_score, current_station = open_set.get()

        # Goal check
        if current_station == goal:
            return reconstruct_path_json(came_from, current_station, goal)

        for neighbor_name, neighbor_info in stations[current_station]['neighbours'].items():
            tentative_g_score = g_score[current_station] + euclidean_distance(
                stations[current_station]['coordinates'], neighbor_info['coordinates'])

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
                f_score[neighbor_name] = tentative_g_score + euclidean_distance(
                    neighbor_info['coordinates'], stations[goal]['coordinates'])
                open_set.put((f_score[neighbor_name], neighbor_name))

    return None  # No path found

# Helper function to reconstruct the path as JSON
def reconstruct_path_json(came_from, current, goal):
    path = []
    while current in came_from:
        previous_station, line = came_from[current]
        path.insert(0, {
            "station": current,
            "line": line,
            "coordinates": stations[current]['coordinates']
        })
        current = previous_station

    # Add the starting station
    path.insert(0, {
        "station": current,
        "line": None,  # Starting point doesn't have a previous line
        "coordinates": stations[current]['coordinates']
    })
    
    return json.dumps({"start": current, "goal": goal, "path": path})

# Example usage
start_station = "Elephant & Castle Underground Station"
goal_station = "Waterloo Underground Station"

path_json = a_star_search(start_station, goal_station)
print(f"Path from {start_station} to {goal_station}:\n{path_json}")