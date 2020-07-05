#!/bin/bash
if (! docker stats --no-stream ); then
  open /Applications/Docker.app
while (! docker stats --no-stream ); do
  echo "Waiting for Docker to launch..."
  sleep 1
done
fi