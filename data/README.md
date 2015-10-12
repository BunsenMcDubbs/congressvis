[data](https://www.govtrack.us/developers/data) (not included) from
[GovTrack](https://www.govtrack.us) goes here.

(It doesn&rsquo;t really matter exactly how or where the data goes but,) the
data it is rsync&rsquo;d from GovTrack with the per-congress directories being
stored at this level.

```
data/
└── 113
    ├── amendments
    │   ├── hamdt
    │   └── samdt
    ├── bills
    │   ├── hconres
    │   ├── hjres
    │   ├── hr
    │   ├── hres
    │   ├── s
    │   ├── sconres
    │   ├── sjres
    │   └── sres
    └── votes
        ├── 2013
        └── 2014
```
