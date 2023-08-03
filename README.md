The `Makefile` is self documented, to know what is available just do `make` or `make help`

# Pre requisites
- make
- docker with docker compose plugin

# Installation
- `make setup`

# Server (backend & frontend)
Once started, backend UI should be available as [SwaggerUI](http://backend.odds.localhost/docs) or [Redocs](http://backend.odds.localhost/redoc)

Proxy is available at http://proxy.odds.localhost

Application is available at http://app.odds.localhost/

## Start everything
- `make up`

## To stop running server
- `make stop`

# Using the cli

Due to the CLI being run inside a docker container, example mounted into `/data/examples`
Also, arguments should be given as args on the command line

Running example
```shell
make cli args="/data/examples/example1/millennium-falcon.json /data/examples/example1/empire.json"
```

Accessing the help of the CLI
```shell
make cli args="--help"
```

Incorrect one
```shell
make cli args="/data/examples/example1/empire.json /data/examples/example1/empire.json"
```

# Testing production images

To test production image, first build them using 
```shell
make build
```

Then you can test the backend locally by doing 
```shell
docker run -it --rm -p 8000:8000 -e CONFIG_PATH=/examples/example1/millennium-falcon.json -v ${PWD}/original/examples:/examples jedi-backend
```
and then go to http://localhost:8000/docs

Else you can just run

```shell
make up_prod
```
and go to the same url as for dev
- http://proxy.odds.localhost
- http://app.odds.localhost/
- http://backend.odds.localhost/docs

To change the configuration used, change the env variable `CONFIG_PATH` inside the docker-compose.

You can also run 
```shell
make cli_prod args="/examples/example1/millennium-falcon.json /examples/example1/empire.json"
```
