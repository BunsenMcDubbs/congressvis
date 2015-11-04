:question::warning::boom: ***work in progress*** :construction::zap::exclamation:

# What is this? Why?

The goal is to use [data](https://www.govtrack.us/developers/data) from
[govtrack.us](https://www.govtrack.us/) and some fancy [d3js](http://d3js.org/)
visualizations to create a multi-device, collaborative environment that allows
for exploration and discovery inside a large (publicly available) dataset.

This project tries to both explore new/novel data visualizations and
interactions as well as expose already available data to provide actionable
insights and increased transparency in government.

This work is ***currently in progress*** at the
[Information Interfaces Lab](http://www.cc.gatech.edu/gvu/ii/) in the
[GVU Center](http://www.gvu.gatech.edu/) at
[Georgia Tech](http://www.gatech.edu/).

## What are you using?

So far:
 - [Apache CouchDB](http://couchdb.apache.org/)
 - miscellaneous python scripts to pre-process and bulk import data into CouchDB

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

4. Use `utils/import.py` to import data into CouchDB (see documentation by
running `python utils/import.py -h`)

5. Familiarize yourself with Couch&rsquo;s views and Map-Reduce functions and
copy the scripts in `views/` to the design documents (easiest to follow the
[tutorial](http://docs.couchdb.org/en/1.6.1/intro/tour.html#running-a-query-using-mapreduce)
and use Futon) to see some initial
"analysis" of the data

6. *???*

7. *Profit.* ![Cheers](http://pixel.nymag.com/imgs/daily/vulture/2015/gifs/leo-toast-9.w529.h352.gif)

### Quick Overview

 - `data/` has the raw data from govtrack (see README there)
 - `utils/` has python scripts to quickly import `data` files into CouchDB
 - `views/` holds a copy of the important parts of the design documents that are used in CouchDB
 - The rest of this repo is cool front-end d3 stuff! yay!

# Below docs generated from couchapp tool (integration in process)

## Generated CouchApp

This is meant to be an example CouchApp and to ship with most of the CouchApp goodies.

Clone with git:

   git clone git://github.com/couchapp/example.git
   cd example

Install with

   couchapp push . http://localhost:5984/example

or (if you have security turned on)

   couchapp push . http://adminname:adminpass@localhost:5984/example

You can also create this app by running

   couchapp generate example && cd example
   couchapp push . http://localhost:5984/example

Deprecated: *couchapp generate proto && cd proto*


## Todo

* factor CouchApp Commonjs to jquery.couch.require.js
* use $.couch.app in app.js

## License

Apache 2.0
