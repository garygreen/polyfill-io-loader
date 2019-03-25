var loaderUtils = require('loader-utils');

const polyfillLibrary = require('polyfill-library');
const fs = require('fs');
const path = require('path');

async function getPolyfillDetector(polyfill) {
    const meta = await polyfillLibrary.describePolyfill(polyfill);
    if (meta) {
        if (meta.detectSource) {
            return meta.detectSource;
        }
        throw new Error(`[polyfill-loader] The polyfill "${polyfill}" does not have a detector! Consider sending a PR with a suitable detect.js file to polyfill-library.`);
    }
    throw new Error(`[polyfill-loader] The polyfill "${polyfill}" does not exist!`);
}

async function getDetectionsEntries(polyfillNames) {
    var detections = Promise.all(polyfillNames.map(function(name) {
        return getPolyfillDetector(name).then(function(src) {
            return [name, src];
        });
    }));

    return await detections;
}

function getBundleCode(options)
{
    const strDetectionEntries = options.detectionEntries.map(function(o) {
        return '[' + JSON.stringify(o[0]) + ',' + o[1] + ']';
    }).join(",\n");
    
    var code = fs.readFileSync(path.resolve(__dirname, 'bundle.js')).toString();
    
    code = code.replace(/__DETECTION_ENTRIES__/, strDetectionEntries)
               .replace(/__URL__/, options.url);

    return code;
}

module.exports = function(source, map) {
    var that = this;
    this.cacheable();
    this.async();

    var query = loaderUtils.parseQuery(this.resourceQuery);
    
    const requiredPolyfillNames = Object.entries(query)
        .filter((entry) => entry[1] === true)
        .map((entry) => entry[0])
    
    getDetectionsEntries(requiredPolyfillNames).then(function(detectionEntries) {
        that.callback(
            null,
            getBundleCode({
                detectionEntries: detectionEntries,
                url: query.url || 'https://polyfill.io/v3/polyfill.min.js'
            }),
            map
        );
    });
};