#!/usr/bin/env bash

date=$(date '+%Y%m%d')

podman build --pull=newer -t peptitools_backend:"$date" -t peptitools_backend:latest ../backend/
podman build --pull=newer -t peptitools_frontend:"$date" -t peptitools_frontend:latest ../frontend/
