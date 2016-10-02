var cheerio = require('cheerio');
var dotty = require('dotty');
var endsWith = require('../utils/string');
var getKeys = require('../utils/hashmap').getKeys;
var getValues = require('../utils/hashmap').getValues;
var size = require('../utils/hashmap').size;

var testCheerio = function () {
    var $ = cheerio.load("<h2 class='title'>Hello world</h2>");

    $('h2.title').text('Hello there!');
    $('h2').addClass('welcome');

    console.log($.html());
};
// testCheerio();

var getAllProductLinks = function ($) {
    console.log('All links: ' + $('a').length);

    // filter to get all links ending with .html
    var htmlLinks = $('a')
        .filter(function (i, e) {
            var link = e.attribs.href;
            return link !== undefined && endsWith(link, '.html');
        });

    // map the map object to an array of links
    var links = getValues(htmlLinks)
        .filter(function (e) {
            return dotty.get(e, 'attribs.href') !== undefined;
        })
        .map(function (e) {
            return e.attribs.href;
        });

    // deduplicate
    var uniqueHtmlLinks = [];
    uniqueHtmlLinks = links.filter(function(item, pos) {
        return links.indexOf(item) == pos;
    });
    return uniqueHtmlLinks;
};

var getProductLinksWithTitles = function ($) {
    var productsMap = {};

    // type 1
    $('.downContent').find('a').each(function (i, e) {
        var link = e.attribs.href;
        e.children.forEach(function (child) {
            if (dotty.get(child, 'attribs.class') === 'text_wrap') {
                productsMap[link] = child.children[0].data;
            }
        })
    });

    // type 2
    $('.mpic').find('a').each(function (i, e) {
        var link = e.attribs.href;
        e.children.forEach(function (child) {
            if (dotty.get(child, 'name') === 'img') {
                productsMap[link] = child.attribs.alt;
            }
        })
    })

    return productsMap;
};

var compare = function (productLinks, productLinksWithTitles) {
    var unmatchedLinks = [];
    productLinks.forEach(function (link) {
        if (!(link in productLinksWithTitles)) {
            unmatchedLinks.push(link);
        }
    })
    return unmatchedLinks;
}

var dealmoonParser = function (responsebuffer) {
    var $ = cheerio.load(responsebuffer);

    // get all product links
    productLinks = getAllProductLinks($);
    console.log('All product links: ' + productLinks.length);

    // get all product links with titles
    productLinksWithTitles = getProductLinksWithTitles($);
    console.log('Product links with titles: ' + size(productLinksWithTitles));

    var unmatchedLinks = compare(productLinks, productLinksWithTitles);
    console.log("unmatched links: " + unmatchedLinks.length);
    // TODO: handle unmatched links

    return productLinksWithTitles;
}

module.exports = dealmoonParser;
