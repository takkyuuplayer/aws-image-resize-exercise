all: node_modules

node_modules:
	yarn install

up:
	docker-compose up -d

stop:
	docker-compose stop

build: dist/package.json dist/yarn.lock
	yarn build
	cd dist && yarn install --production

dist:
	mkdir -p dist

dist/package.json: dist
	ln -fs ../package.json dist/package.json

dist/yarn.lock: dist
	ln -fs ../yarn.lock dist/yarn.lock


deploy:
	$(MAKE) deploy -C deployment

localstack:
	aws --endpoint-url=http://localhost:4572 s3 mb s3://tp-image-resize
	aws --endpoint-url=http://localhost:4572 s3 sync ./test/data s3://tp-image-resize

test:
	yarn run test
	yarn run lint

.PHONY: node_modules test
