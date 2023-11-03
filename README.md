# tesseract-wasm for web learning


## running 

* build docker image

```code
docker-compose build
```

* running

```code
docker-compose  up -d
```

* test web site 

```code
http://localhost:3000
```

* test ocr  api

```code
curl  -X POST \
  'http://localhost:3000/ocr' \
  --header 'Accept: */*' \
  --header 'User-Agent: Thunder Client (https://www.thunderclient.com)' \
  --form 'file=@/Users/dalong/Downloads/WX20231103-175518@2x.png'
```