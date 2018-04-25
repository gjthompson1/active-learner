# Elasticsearch

## Build

    docker-compose up --build -d elasticsearch

## Configure in Mac OSX

    screen ~/Library/Containers/com.docker.docker/Data/com.docker.driver.amd64-linux/tty

    sysctl -w vm.max_map_count=262144

Exit by Control-A Control-\.

## Configure on Ubuntu

    docker-machine ssh cm-dev

    sudo sysctl -w vm.max_map_count=262144
