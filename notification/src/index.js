const nz = require('./nz');
const aus = require('./aus');

(async () => {
    await nz.checkStatus();
    await aus.checkStatus();
})();