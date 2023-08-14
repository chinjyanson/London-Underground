import heapq

class Station:
    def __init__(self, name, coordinates):
        self.name = name
        self.coordinates = coordinates
        self.connections = {}  # Dictionary to store connected stations and their costs

    def add_connection(self, station, cost):
        self.connections[station] = cost

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

if __name__ == "__main__":
    # Create station objects with their coordinates
    stations = {
        "A": [0, 0],
        "B": [-20, -1],
        "C": [-1, -1],
        "D": [1, 0],
        # Add more stations here as needed
    }

    # Create Station objects and add connections
    station_objects = {}
    for name, coordinates in stations.items():
        station_objects[name] = Station(name, coordinates)

    station_objects["A"].add_connection(station_objects["B"], 5)
    station_objects["B"].add_connection(station_objects["C"], 5)
    station_objects["C"].add_connection(station_objects["D"], 5)
    station_objects["A"].add_connection(station_objects["D"], 100)

    # List of all stations
    all_stations = list(station_objects.values())
    
    # Find the shortest path between two stations
    start_station = station_objects["A"]
    goal_station = station_objects['D']
    print(start_station)

    shortest_path = astar(start_station, goal_station, all_stations)

    if shortest_path:
        print("Shortest path:")
        for station in shortest_path:
            print(station.name)
    else:
        print("No path found.")