all: node_modules

node_modules:
	yarn install

build:
	yarn build
	cd dist \
		&& npm init -f -y \
		&& npm install sharp --save \
		&& npm install --only=prod
deploy:
	zip -FS -q -r dist/viewerRequest.zip dist/viewerRequest.js
	zip -FS -q -r dist/originResponse.zip dist/originResponse.js dist/node_modules
	aws s3 cp ./dist/viewerRequest.zip s3://tp-lambda.us-east-1/viewerRequest.zip
	aws s3 cp ./dist/originResponse.zip s3://tp-lambda.us-east-1/originResponse.zip
	$(MAKE) deploy -C deployment

test:
	yarn run test
	yarn run lint

.PHONY: node_modules test
