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
	@echo "- clearing docs directory" && \
	rm -rf docs/api docs/source && \
	echo "- generating source documentation" && \
	./node_modules/.bin/jsdoc \
		--recurse \
		--readme README.md \
		--destination docs/source \
		--configure jsdoc-config.json \
		api/ && \
	echo "- generating api documentation" && \
	./node_modules/.bin/bootprint swagger \
		api/swagger/swagger.yaml \
		docs/api

docs-push:
	@echo "- generating and pushing documentation" && \
	make docs && \
	echo "- cloning congressvis documentation branch into temporary dir" && \
	git clone git@github.com:bunsenmcdubbs/congressvis.git --branch gh-pages __gh-pages-tmp__ && \
	echo "- copying /doc content into temporary dir" && \
	rsync -a --delete docs/ __gh-pages-tmp__/ --exclude=".git/" && \
	cd __gh-pages-tmp__ && \
	echo "- committing changes in gh-pages branch" && \
	git add --all . && \
	git commit -m "Auto-generated documentation commit" && \
	echo "- pushing gh-pages branch" && \
	git push origin gh-pages -f && \
	cd .. && \
	echo "- removing temporary dir" && \
	rm -rf __gh-pages-tmp__

.PHONY: test test-w test-d docs docs-d
