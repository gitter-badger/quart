<img src="./logo.png" width="200px"/>


Fastest, baddest and most experimental HTTP/2 framework for Node.js
----


## Installation

Install from npm, note that **funl** requires Node 8.4.0 and above with the `--expose-http2` for 8.x.x versions.

```
$ npm install funl --save
```

## Write a **funl** Http/2 server

```javascript
const Funl = require('funl');
const app = new Funl({
  cert: "", // SSL Cert
  key: "" // SSL Key
});

app.on('/', async (stream) => {
  stream.end("Hello World!");
});

app.listen(8080);
```
### A short bit on Multiplexing and Stream Objet
Http/2 has many differences from Http/1.1, perhaps the most notable difference is multiplexing. For this reason routing in **funl** is not mapped to a request but rather to a substream. This interface allows you to `push` handles from a specific path without redefining them.

## Write a middleware

Middlewares are special handles in **funl** that allow for interception of streams pre and post processing/flight. You can add a middleware `preflight` executing before all handles are consumed and `postflight` after the handles are done. A stream may or may not be open when postflight handles are called.

```javascript
app.preflight(async (stream) => {
  console.log({ method: stream.method });
});

app.postflight(async (stream) => {
  console.log({ headers: stream.headers });
});
```

*Middlewares can be called via internal requests (push) and don't map into an actual client-side request.*


## License
Who doesn't love a [MIT license](https://raw.githubusercontent.com/schahriar/funl/master/LICENSE)?