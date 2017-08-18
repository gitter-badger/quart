const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const Quart = require('../Quart');

const make_certs = spawn('bash', [path.resolve(__dirname, './make-certs.sh')], {
  cwd: path.resolve(__dirname, './certs')
});

make_certs.stdout.pipe(process.stdout);
make_certs.stderr.pipe(process.stderr);

// Require globals
global.libraryPath = path.resolve(__dirname, '../lib/');
global.requireFromLibrary = (file) => require(path.resolve(libraryPath, file));

describe("Cert Generation", function () {
  it("should generate certs", (done) => {
    make_certs.on('close', () => {
      const cert = fs.readFileSync(path.resolve(__dirname, './certs/all/my-private-root-ca.cert.pem'), 'utf8');
      const key = fs.readFileSync(path.resolve(__dirname, './certs/all/my-private-root-ca.privkey.pem'), 'utf8');

      // Assign test globals
      global.expect = require('chai').expect;
      global.app = new Quart({ key, cert });
      global.cert = cert;
      global.key = key;

      done();
    });
  });
});

// Unit tests
require('./unit/MapList_unit.js');
require('./unit/WeakList_unit.js');
require('./unit/Router_unit.js');
require('./unit/SubStream_unit');
// Integration tests
require('./integration/init_integration.js');