//const scrape = require('website-scraper');
const cheerio = require('cheerio');
const request = require('request');

// Variables to hold urls to hold food items
const base_url = 'http://foodnetwork.com/search/';
let food_items_urls = [];
let food_items = ['pizza', 'burger', 'sandwich', 'japanese-pancake'];

get_ingredients(food_items);

function get_ingredients(food_items)
{
	// Create food item array to search
	for (i = 0; i < food_items.length; i++)
	{
		food_items_urls.push(base_url.concat(food_items[i] + "-" ));
	}

	let real_urls = [];

	// Scrape site
	for (i = 0; i < food_items_urls.length; i++)
	{
		request({
			uri: food_items_urls[i],
		}, function(error, response, body) {
			let $ = cheerio.load(body);

			$("h3 > a").each(function() {
				let link = $(this);
				let text = link.text();
				let href = link.attr("href");
				real_urls.push(href);
				
				console.log(real_urls);
				console.log(real_urls.length);
			});
		});

		//console.log(food_items_urls);
		//console.log(food_items_urls[i]);
		let pattern = /^href: '\/\/www.foodnetwork.com\/recipes\/.*' },/gi;
		
		/*while (match = pattern.exec(str))
		{
			alert(match[1]);
		}*/
	}
}
