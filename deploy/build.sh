#!/usr/bin/env bash

build_component() {
  local component=$1
  echo "Building $component..."
  podman build --pull=newer -t peptitools_"$component":"$date" -t peptitools_"$component":latest ../"$component"/
}

component="${1:-all}"
date=$(date '+%Y%m%d')

case "$component" in
  all)
    build_component "backend"
    build_component "frontend"
    ;;
  backend)
    build_component "backend"
    ;;
  frontend)
    build_component "frontend"
    ;;
  *)
    echo "Uso: $0 [all|frontend|backend]"
    exit 1
    ;;
esac
