all: node_modules

node_modules:
	yarn install

build:
	yarn tsc

test:
	yarn run test
	yarn run lint

.PHONY: node_modules test
