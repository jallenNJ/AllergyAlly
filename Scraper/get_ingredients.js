//const scrape = require('website-scraper');
const $ = require('cheerio');
const rp = require('request-promise');

// Variables to hold urls to hold food items
const base_url = "http://foodnetwork.com/search/";
let food_items_urls = [];
let food_items = ["pizza", "burger", "sandwich"];

get_ingredients(food_items);

function get_ingredients(food_items)
{
	// Create food item array to search
	for (i = 0; i < food_items.length; i++)
	{
		food_items_urls.push(base_url.concat(food_items[i]));
		console.log(food_items[i]);
		console.log(food_items_urls);
	}

	// Scrape site
	rp(base_url)
		.then(function(html)
			{
				//success
				console.log(html);
			})
		.catch(function(err)
			{
				//handle error
				console.error();
			});
}
