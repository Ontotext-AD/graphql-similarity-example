#!/bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

docker network create platform_network

docker-compose up



npm run

docker-compose down
