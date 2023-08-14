import math
import json
from geopy.geocoders import Nominatim
 

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

if __name__ == '__main__':
    hi = time_taken([-0.172900093155076, 51.49403710103854], [-0.134358188788237, 51.520514996770316], "Circle")
    print(hi)