var simplecrawler = require('simplecrawler');
var dealmoonParser = require('../parsers/dealmoon-parser');

var size = require('../utils/hashmap').size;

var dealmoonCrawler = simplecrawler('http://www.dealmoon.com');

dealmoonCrawler.interval = 100;
dealmoonCrawler.maxConcurrency = 3;
dealmoonCrawler.maxDepth = 1;

// Add fetch conditions
var conditionIdFileType = dealmoonCrawler.addFetchCondition(function(parsedURL) {
    return !parsedURL.path.match(/(\.pdf$|\.png$|\.jpg$|\.js$|\.css$|\.ico$)/i);
});

var conditionIdPathType = dealmoonCrawler.addFetchCondition(function(parsedURL) {
    return !parsedURL.path.match(/(\/assets\/|\/comments|\/deal-alert|\/Online-Stores)/i);
});

// Crawler event handlers
dealmoonCrawler.on('fetchcomplete', function(queueItem, responseBuffer, response) {
    console.log('I just received %s (%d bytes)', queueItem.url, responseBuffer.length);
    console.log('It was a resource of type %s', response.headers['content-type']);

    var products = dealmoonParser(responseBuffer);
    console.log("Total products crawled: " + size(products));
    console.log(products);
});

dealmoonCrawler.on('crawlstart', function() {
    console.log('Starting crawling dealmoon...');
});

dealmoonCrawler.on('complete', function() {
    console.log('Finished!');
});

dealmoonCrawler.start();
