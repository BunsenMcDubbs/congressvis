# Some Assembly Required

![upside down house](http://i.imgur.com/8kG3g2S.jpg)
("irrelevant" upside-down house, interpret as you will)

(It doesn&rsquo;t really matter exactly how or where the data goes but,) the
rsync&rsquo;d [data from GovTrack](https://www.govtrack.us/developers/data) goes
here with the per-congress directories being stored at this level.

**Note:** this is relatively temporary because it is imported into the database
and thats where the magic happens. This is just a local/"master" copy of the
data to refer back to or pre-process before importing into MySQL.

~~So far (as of commit ca0413b419969379bc186dc5f3715907dffce75c) we only use the
data in `<congress>/bills/hr/` and `<congress>/bills/s/` aka bills, not
resolutions.~~ (no longer true as of commit
f5908f59aea080b76932f532ea4d5486ad4345ce, now all bills and resolutions are used)

Import scripts are in `data/utils`

Example with the 113rd Congress (2013-14):
```
data
├── 113
│   ├── amendments
│   │   ├── hamdt
│   │   └── samdt
│   ├── bills
│   │   ├── hconres
│   │   ├── hjres
│   │   ├── hr
│   │   ├── hres
│   │   ├── s
│   │   ├── sconres
│   │   ├── sjres
│   │   └── sres
│   └── votes
│       ├── 2013
│       └── 2014
├── README.md
├── membership
│   ├── committee-membership-current.yaml
│   ├── legislators-current.yaml
│   └── legislators-historical.yaml
├── sessions.tsv
└── subjects
    ├── crsnet.xml
    └── liv111.xml
```
