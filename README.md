:question::warning::boom: ***work in progress*** :construction::zap::exclamation:

# What is this? Why?

The goal is to use [data](https://www.govtrack.us/developers/data) from
[govtrack.us](https://www.govtrack.us/) and some fancy [d3js](http://d3js.org/)
visualizations to create a multi-device, collaborative environment that allows
for exploration and discovery inside a large (publicly available) dataset.

This project tries to both explore new/novel data visualizations and
interactions as well as expose already available data to provide actionable
insights and increased transparency in government.

This work is currently in progress at the
[Information Interfaces Lab](http://www.cc.gatech.edu/gvu/ii/) in the
[GVU Center](http://www.gvu.gatech.edu/) at
[Georgia Tech](http://www.gatech.edu/).

## What are you using?

So far:
 - [Apache CouchDB](http://couchdb.apache.org/)
 - misc python scripts to pre-process and bulk import data into CouchDB

Eventually:
 - [d3js](http://d3js.org/) to do some neat visualizations
 - [ElasticSearch](https://www.elastic.co/products/elasticsearch) or
 [Solr](http://lucene.apache.org/solr/) to do some speedy and cool full-text
 search/analysis on bill text
 - probably [Firebase](https://www.firebase.com/) to facilitate easy real-time
 communications/collaboration between multiple devices
 - possibly some [nodejs](https://nodejs.org/en/) server with WebSockets instead

Not relevant:
 - [Atom](https://atom.io/) text editor (just not for the big files - it
 really struggles)
 - [cheap IKEA couch cushions](http://www.ikea.com/us/en/catalog/products/50267370/) to facilitate
 comfort :trollface:


## Getting Started

1. Download data from [GovTrack](https://www.govtrack.us/developers/data) into
the `data/` directory (see more details in the README there).

2. Download [CouchDB](http://couchdb.apache.org/), install, and "setup"
aka double-click and run

3. Create 2 new databases on CouchDB - one for Senate and one for House of
Representatives

4. Use `utils/toCouch.py` to import data into CouchDB (see documentation by
running `python utils/toCouch.py -h`)

5. Familiarize yourself with Couch&rsquo;s views and Map-Reduce functions and
copy the scripts in `views/` to the design documents (easiest to follow the
[tutorial](http://docs.couchdb.org/en/1.6.1/intro/tour.html#running-a-query-using-mapreduce)
and use Futon) to see some initial
"analysis" of the data

6. *???* :pray::sos::interrobang:

7. :heavy_dollar_sign:*Profit*:heavy_dollar_sign:
