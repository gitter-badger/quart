const portscanner = require('portscanner');

describe('Initial Setup Test Suite', function () {
  it('should listen on an open port', async () => {
    const port = await portscanner.findAPortNotInUse(8080, 10080);
    // Port scanner has a confusing mapping for Open and Closed
    expect(await portscanner.checkPortStatus(port)).to.be.equal("closed");
    await new Promise((resolve, reject) => app.listen(port, resolve));
    expect(await portscanner.checkPortStatus(port)).to.be.equal("open");
  });
});