#!/bin/bash
set -e

# Stop and remove the containers. The named 'pgdata' Podman volume is NOT
# removed, so database data persists between runs.
podman-compose down
