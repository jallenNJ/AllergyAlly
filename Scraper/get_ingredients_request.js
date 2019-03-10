//const scrape = require('website-scraper');
const cheerio = require('cheerio');
const request = require('request');

// Variables to hold urls to hold food items
const base_url = 'http://foodnetwork.com/search/';
let food_items_urls = [];
let food_items = ['pizza', 'burger', 'sandwich', 'japanese-pancake'];

start_scraper(food_items);

// Start web scraping
function start_scraper()
{
	get_recipe_links(food_items);
}

// Creates a JSON object containing name of food item as key and a list of recipe urls as the key
function get_recipe_links(food_items)
{
	// Regex for filtering urls for recipes only
	const regex = /^\/\/www.foodnetwork.com\/recipes\/.*/;
	
	// Create food item array to search
	for (i = 0; i < food_items.length; i++)
	{
		food_items_urls.push(base_url.concat(food_items[i] + "-" ));
	}

	let recipe_obj = {};
	let k = 0;

	// Scrape site
	for (i = 0; i < food_items_urls.length; i++)
	{
		let j = i;
		let real_urls = [];
		request({
			uri: food_items_urls[i],
		}, function(error, response, body) {
			let $ = cheerio.load(body);

			$('h3 > a').each(function() {
				let link = $(this);
				let href = link.attr('href');
				real_urls.push(href);
				real_urls
			});

		let valid_urls = [];
		// Filter urls to match only recipes
		for (url of real_urls)
		{
			//console.log(url);
			if (regex.test(url))
			{
				valid_urls.push('https' + url);
			}
		}
		recipe_obj[food_items[j]] = valid_urls;
		k++;
		if (k == food_items_urls.length)
			{
				get_ingredients(recipe_obj);
			}
		
		});

	}
	
}

// Get ingredients for each food items and return as JSON object
function get_ingredients(recipe_obj)
{
	console.log(recipe_obj);
	/*for (let food in recipe_obj)
	{
		console.log(food + " -> " + recipe_obj[food]);
	}*/

	Object.keys(recipe_obj).forEach(function(key){
		console.log('key : ' + key + ', value : ' + recipe_obj[key])
	})

	//return
}
