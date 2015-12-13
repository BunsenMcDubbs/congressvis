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
 - [MySQL](https://www.mysql.com/)
 - miscellaneous python scripts to pre-process and bulk import data into MySQL

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


## Getting Started

1. Download data from [GovTrack](https://www.govtrack.us/developers/data) into
the `data/` directory (see more details in the README there).

2. Download and install [MySQL](https://www.mysql.com/) (and maybe
  [MySQL Workbench](https://www.mysql.com/products/workbench/))

3. Import the schema from `utils/congressviz_schema.sql`

4. Use `utils/mysql_import.py` to import data into MySQL (see documentation by
running `python utils/mysql_import.py -h` and refer to README in data folder)

5. *???*

6. *Profit.* ![Cheers](http://pixel.nymag.com/imgs/daily/vulture/2015/gifs/leo-toast-9.w529.h352.gif)

### Quick Overview

 - `data/` has the raw data from govtrack (see README there)
 - `utils/` has python scripts to quickly import `data` files into MySQL
 - The rest of this repo is cool front-end d3 stuff! yay!
