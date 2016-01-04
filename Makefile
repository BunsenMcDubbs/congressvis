REPORTER = dot

# short test summary
test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--recursive

# test and watch
test-w:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--recursive \
		--watch

# long-form test with details
test-d:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--recursive

docs:
	@echo "clearing docs directory..." && \
	rm -rf docs/api docs/source && \
	echo "generating source documentation" && \
	./node_modules/.bin/jsdoc \
		--recurse \
		--readme README.md \
		--destination docs/source \
		--configure jsdoc-config.json \
		api/ && \
	echo "generating api documentation" && \
	./node_modules/.bin/bootprint swagger \
		api/swagger/swagger.yaml \
		docs/api

.PHONY: test test-w test-d docs
