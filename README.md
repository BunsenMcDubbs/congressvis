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
 - [Elasticsearch](https://www.elastic.co/products/elasticsearch)
 - [d3js](http://d3js.org/) to do some neat visualizations
 - miscellaneous python scripts to pre-process and bulk import data

Eventually:
 - probably [Firebase](https://www.firebase.com/) to facilitate easy real-time
 communications/collaboration between multiple devices
 - possibly some [nodejs](https://nodejs.org/en/) server with WebSockets instead

## Getting Started

1. Download data from [GovTrack](https://www.govtrack.us/developers/data) into
  the `data/` directory (see more details in the README there).

2. Install [MySQL](https://www.mysql.com/) (and maybe
  [MySQL Workbench](https://www.mysql.com/products/workbench/)) and
  [Elasticsearch](https://www.elastic.co/products/elasticsearch)
    - On Mac OS X: `brew install mysql elasticsearch`

3. Import the schema from `utils/congressvis_schema.sql`

4. Use `utils/mysql_import.py` to import data into MySQL (see documentation by
  running `python utils/mysql_import.py -h` and refer to README in data folder)

5. *???*

6. *Profit.* ![Cheers](http://pixel.nymag.com/imgs/daily/vulture/2015/gifs/leo-toast-9.w529.h352.gif)

### Quick Overview

 - `data/` has the raw data from govtrack (see README there)
 - `utils/` has python scripts to quickly import `data` files into MySQL
 - The rest of this repo is/will be nodejs stuff
