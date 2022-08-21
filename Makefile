all: deps build
build:
	npm run build:${CI_COMMIT_REF_NAME}
test:
	npm run test:unit
clean:
	rm -rf dist
deps:
	npm ci
upgrade:
	npm update
