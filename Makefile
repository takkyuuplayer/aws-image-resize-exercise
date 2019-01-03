all: node_modules

node_modules:
	yarn install

test:
	yarn run test
	yarn run lint

.PHONY: node_modules
