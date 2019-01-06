all: node_modules

node_modules:
	yarn install

build:
	yarn build
	cd dist \
		&& npm init -f -y \
		&& npm install sharp --save \
		&& npm install --only=prod
	zip -FS -q -r lambda.zip dist

test:
	yarn run test
	yarn run lint

.PHONY: node_modules test
