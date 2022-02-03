# Riot-Games-Played-Today
A website that displays time played across League of Legends and Teamfight Tactics using the Riot Games API.
The website should be available at https://playedtoday.ddns.net/

## Technical Details:
- The server is running in a Docker container which was created via a Dockerfile and docker-compose
- The bind folder is bind mounted to the container
- The Riot Games API key can be dynamically edited at bind/key.txt
- A dynamic DNS service (noip.com) was used to get the domain. The server is actually running on a GCP server
- The SSL certificate was created using Let's Encrypt and auto-renewel is set up using Certbot's standalone plugin
- Log entries are saved in bind/log.txt
