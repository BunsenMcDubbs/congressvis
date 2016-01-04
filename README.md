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
  - [Elasticsearch](https://www.elastic.co/products/elasticsearch) for text search
  - [MySQL](https://www.mysql.com/) for everything else
  - [Node.js](https://nodejs.org/en/) and
      [Express.js](http://expressjs.com/en/index.html) framework
  - [Backbone.js](http://backbonejs.org/) for the client-side web
  - [d3js](http://d3js.org/) to do some neat visualizations
  - miscellaneous python scripts to pre-process and bulk import data

Eventually:
 - probably [Firebase](https://www.firebase.com/) to facilitate easy real-time
 communications/collaboration between multiple devices

## Getting Started
Note: The `brew` command refers to [homebrew](http://brew.sh/) a package manager
for Mac OS X. Either replace with the proper package manager for your operating
system (e.g. `apt-get` for Ubuntu) or install from official binaries.

1. Install [Node.js](https://nodejs.org/en/), [MySQL](https://www.mysql.com/)
  and [Elasticsearch](https://www.elastic.co/products/elasticsearch)
  ```shell
  brew install node
  brew install mysql # this takes a while
  brew install elasticsearch
  ```
  - Consider installing
    [MySQL Workbench](https://www.mysql.com/products/workbench/) as an
    alternative to using the command line interface for MySQL

2. Clone this repo
  ```shell
  git clone git@github.com:BunsenMcDubbs/congressvis.git
  cd congressvis
  ```

3. Setup datastores

  1. Download data from [GovTrack](https://www.govtrack.us/developers/data) into
    the `data/` directory (see more details in the README there).
    ```shell
    cd data
    rsync -avz --delete govtrack.us::govtrackdata/congress/113/ .
    rsync -avz --delete govtrack.us::govtrackdata/congress-legislators/* membership
    rsync -avz govtrack.us::govtrackdata/us/sessions.tsv .
    rsync -avz --delete govtrack.us::govtrackdata/us/liv111.xml subjects/
    rsync -avz --delete govtrack.us::govtrackdata/us/crsnet.xml subjects/
    ```

  2. Setup MySQL and import the schema from `data/utils/congressvis_schema.sql`

  3. Use `data/utils/mysql_import.py` to import data into MySQL (see documentation by
    running `python data/utils/mysql_import.py -h` and refer to README in data folder)
    ```shell
    # in a new (second) terminal window
    elasticsearch # start elasticsearch

    # back in the first one:
    cd .. # come back up to project root
    python data/utils/mysql_import.py -u <USERNAME> -p <PASSWORD> -db <DATABASE> --path data/

    # once the importing is finished you can stop elasticsearch with Ctrl-C
    # and close the second window
    ```

4. Install project dependencies
  ```shell
  # at the project root
  npm install

  npm install -g bower
  bower install
  ```
5. Copy `config-example.js` to `config.js` and fill in with the proper credentials
  ```shell
  cp config-example.js config.js
  # edit config.js
  ```

6. Start the server
  ```shell
  npm start # which runs the script bin/www - see package.json for more details
  ```

7. Now the server should be running on localhost:3000. Navigate to
  http://localhost:3000 in your favorite web browser to confirm.

  **Note:** MySQL and Elasticsearch must be running for all parts to work

8. *???*

9. *Congrats.* ![Cheers.](http://pixel.nymag.com/imgs/daily/vulture/2015/gifs/leo-toast-9.w529.h352.gif)

## API Documentation

**Todo:** write API, then document

## Project Layout/Filesystem Overview

**Note:** This project layout was initially generated with the
[`express-generator`](http://expressjs.com/en/starter/generator.html)
and mostly follows standard Express.js conventions.

### Directories

 - `data/` raw data from govtrack (see README there)
  - `data/utils/` python scripts to quickly import data files into MySQL
 - `api/` handlers and converters that talk with the database (ORM-esque)
 - `public/` (static) client-side resources
  - `public/style` -> stylesheets
  - `public/scripts` -> client-side javascript ex) Backbone application,
  d3js visualizations
 - `routes/` express routers (and a bit of database connection logic)
 - `views/` view templates (handlebars) that are (mostly) rendered server-side

### Files of Interest
 - `bin/www` node server startup script
  - can be called with either `npm start` (recommended) or `./bin/www` from
  project root
 - `config.js` deployment specific settings and sensitive information
 (credentials etc.)
 - `app.js`

### Database Schema

**Todo:** written documentation for database schema
![mysql database diagram](https://raw.githubusercontent.com/BunsenMcDubbs/congressvis/master/data/utils/schema_diagram.png)
