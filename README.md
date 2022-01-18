# Riot-Games-Played-Today
A website that displays time played across League of Legends and Teamfight Tactics using the Riot Games API.
The website should be available at http://playedtoday.ddns.net/, however the graph may not show on submit due to lack of a refreshed key.

## Technical Details:
- The server is running in a Docker container which was created via a Dockerfile and docker-compose
- The bind folder is bind mounted to the container
- The Riot Games personal use API key only lasts 24 hours, so it can be dynamically edited in bind/key.txt
- A dynamic DNS service (noip.com) was used to get the domain. The server is actually running on a GCP server
