BIN_NAME=serv
export GOPATH=$(realpath $(dir $(realpath $(lastword $(MAKEFILE_LIST)))).. )
export GOROOT=$(realpath $(shell which go)/../..)


$(BIN_NAME): main.go
	go build -i -o $(BIN_NAME)

clean:
	rm $(BIN_NAME)

env:
	env | sort

run: $(BIN_NAME)
	echo 'launching server'
	./$(BIN_NAME)

../apitest/node_modules:
	(cd ../apitest; npm install)

test: $(BIN_NAME) ../apitest/node_modules
	(cd ../apitest; ./node_modules/.bin/cucumberjs)
