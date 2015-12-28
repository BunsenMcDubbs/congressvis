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

.PHONY: test test-w
