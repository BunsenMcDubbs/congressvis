# Generated documentation goes here

```shell
# move to project root
cd ..

# install development dependencies
npm install --dev

# generate documentation
make docs
# or (equivalent command)
npm run docs
```

 - `/docs/api/` has generated api documentation from `bootprint swagger` and
 `/api/swagger/swagger.yaml`
 - `/docs/source` has generated source documentation from `jsdoc`

```
docs/
├── README.md <-- you are here
├── api
│   ├── index.html
│   ├── main.css
│   └── main.css.map
└── source
    ├── fonts
    ├── scripts
    ├── styles
    ...
    └── index.html
```

See `Makefile` for more details
