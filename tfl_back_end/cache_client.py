from pyignite import Client

try:
    # Connect to the local Apache Ignite server (default: localhost:10800)
    ignite_client = Client()
    ignite_client.connect('127.0.0.1', 10800)

    # Create or access a cache in Ignite
    station_cache = ignite_client.get_or_create_cache('station_cache')
except:
    station_cache = None
    pass