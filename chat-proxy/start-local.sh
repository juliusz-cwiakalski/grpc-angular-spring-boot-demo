#!/bin/bash

DIR=$( dirname `realpath $0` )
CONTAINER_NAME=local-proxy

docker stop $CONTAINER_NAME
docker rm $CONTAINER_NAME
docker run -it \
    --name $CONTAINER_NAME \
    --network host \
    -v ${DIR}/envoy-local.yaml:/etc/envoy/envoy.yaml \
    -e NODE_ENV=development \
    -d envoyproxy/envoy-alpine
