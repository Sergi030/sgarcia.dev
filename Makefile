.PHONY: dev build preview install

install:
	npm install

dev:
	npx astro dev --host 0.0.0.0

build:
	npm run build

preview:
	npx astro preview --host 0.0.0.0
