from geopy.geocoders import Nominatim

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

def londoncheck(coordinates):
    geoLoc = Nominatim(user_agent="GetLoc")

    # passing the coordinates
    locname = geoLoc.reverse(coordinates)

    # printing the address/location name
    print(locname.address)

    # Extract city name from the reverse geocoding result
    city_name = locname.raw.get("address", {}).get("city", "")

    return city_name