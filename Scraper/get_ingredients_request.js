var exports = module.exports = {};
exports.Scrape = function(items, callback) {
	start_scraper(items, callback);
}

// Required packages
const cheerio = require('cheerio');
const request = require('request');
const rpromise = require('request-promise');

//let bob = ['pizza', 'burger', 'sandwich', 'japanese-pancake'];
//let bob = ['japanese pancake']

//start_scraper(bob, (a) => { console.log(a) });

var endCallback

// Start web scraping
function start_scraper(food_items, callback)
{
	endCallback = callback;
	let json_obj = get_recipe_links(food_items);
}

// Creates a JSON object containing name of food item as key and a list of recipe urls as the key
function get_recipe_links(food_items)
{
	// Variables to hold urls to hold food items
	const base_url = 'http://foodnetwork.com/search/';
	
	// Regex for filtering urls for recipes only
	const regex = /^\/\/www.foodnetwork.com\/recipes\/.*/;
	
	let food_items_urls = [];
	
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
				valid_urls.push('https:' + url);
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

var fulfilled = 0;
async function findIngredientsAtLink(link, arr) {
	return new Promise(resolve => {
		request(link, async function (error, response, body) {
			if(error){
				fulfilled++;
				console.error(error);
				resolve(false);
				return;
			}
			fulfilled++;
			console.log("Network!");
			let $ = cheerio.load(body);
			let ingredients = $('.o-Ingredients__m-Body');
			arr.push(ingredients.text().replace(/\s\s+/g, ' ').replace(/[0-9/:]/g, "").toLowerCase());
			resolve(true);
		});
	  });
}
var sentRequests = 0;
async function findIngredientsForKey(source, arr){
	const promises = [];
	for(var link of source) {
		sentRequests++;
		promises.push(findIngredientsAtLink(link, arr)); 
	}
	return promises;

}


// Get ingredients for each food items and return as JSON object
 async function get_ingredients(recipe_obj)
{
	var attempts = 0;
	let promises = [];
	var formattedObj = {};
	for (var food in recipe_obj) {
		if (recipe_obj.hasOwnProperty(food)) {
			
			formattedObj[food] = [];
			 promises += findIngredientsForKey(recipe_obj[food], formattedObj[food]);

		}
	}
	console.log(promises);
	return await Promise.all(promises)
	.then((response) => {
		let x = () =>{
			attempts++;
			//console.log(sentRequests + " " + fulfilled+ " at" + attempts);
			return sentRequests == fulfilled || attempts > 100;
		}
		let y = () =>{
			console.log("Callback");
			//do stuff with response
			endCallback(formattedObj)
		}
		let z = () => {
			while(true){
				if(x()){y(); return;};
				setTimeout(z, 100);
				return;
			}
		}
		z();
		
	
	
	})
	.catch((error) => {
		console.error(error);
	})
	

}