// Required packages
const cheerio = require('cheerio');
const request = require('request');
const rpromise = require('request-promise');

let bob = ['pizza', 'burger', 'sandwich', 'japanese-pancake'];
//let bob = ['japanese pancake']

start_scraper(bob, (a) => { console.log(a) });

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


async function findIngredientsAtLink(link, arr) {
	return new Promise(resolve => {
		request(link, function (error, response, body) {
			if(error){
				console.error(error);
				resolve(false);
			}
			let $ = cheerio.load(body);
			let ingredients = $('.o-Ingredients__m-Body');
			arr.push(ingredients.text().replace(/\s\s+/g, ' ').replace(/[0-9/:]/g, "").toLowerCase());
			resolve(true);
		});
	  });
}

async function findIngredientsForKey(source, arr){
	const promises = [];
	for(var link of source) {
		promises.push(findIngredientsAtLink(link, arr)); 
	}
	return Promise.all(promises);

}


// Get ingredients for each food items and return as JSON object
 async function get_ingredients(recipe_obj)
{

	var formattedObj = {};
	for (var food in recipe_obj) {
		if (recipe_obj.hasOwnProperty(food)) {
			formattedObj[food] = [];
			 await findIngredientsForKey(recipe_obj[food], formattedObj[food]);

		}
	}

	endCallback(formattedObj);



			/*formattedObj[food] = [];
			let thisKey = food;
			for( link of recipe_obj[thisKey]){
				promises.push(rpromise(link)
					.then(async function (htmlString) {
						
						
						let $ = cheerio.load(htmlString);
						let ingredients = $('.o-Ingredients__m-Body');
						formattedObj[thisKey].push(ingredients.text().replace(/\s\s+/g, ' ').replace(/[0-9/:]/g, ""));
						resolve(true);
						// Process html...
					})
					.catch(async function (err) {
						console.error(err);
						resolve(false);
					}));
			}*/


	/*console.log(recipe_obj);
	let ingredient_obj = {};
	let ingredient_list = [];

	targetParsings = Object.keys(recipe_obj).length;
	Object.keys(recipe_obj).forEach(async function(key) {
	//	console.log(recipe_obj[key]);
		
		try{
			await query_ingredients(recipe_obj[key], [], key); 
		} catch(ex){
			console.error(ex);
			
		}
	});
	return;*/
}

/*
	let key_count_2 = Object.keys(recipe_obj).length;
	let count_2 = 0;
	console.log(key_count_2);

	Object.keys(recipe_obj).forEach(function(key) {
		console.log('key : ' + key + ', value : ' + recipe_obj[key])
		count_2++;	

		let ingredient_list = []; // hold stringified text of list of ingredients for food item

		ingredient_obj[key] = [];

		let key_count = recipe_obj[key].length;
		let count = 0;
		console.log(key_count);
		// Get each food items ingredients
		for (link of recipe_obj[key])
		{
			let ingredient_key = key;
			
			request({
				url: link
			}, function(err, res, body) {
				if (err) 
				{
					return console.error(err);
				}

				let $ = cheerio.load(body);
				let ingredients = $('.o-Ingredients__m-Body');
				ingredient_list.push(ingredients.text().replace(/\s\s+/g, ' ').replace(/[0-9/:]/g, ""));
				console.log("this is where it should add the ingredients");
			
				count++;
				// Add to JSON object
				ingredient_obj[ingredient_key].push(ingredient_list);
				if (count == key_count && count_2 == key_count_2)
				{
					count = 9999;
					console.log("@@@@@@@@@@@@@@@@@" + JSON.stringify(ingredient_obj[ingredient_key][0]));
					v_callback();
				}
			});
		}
		console.log(ingredient_obj);
	})
	console.log(ingredient_obj);

	Object.keys(ingredient_obj).forEach(function(key){
		console.log('key : ' + key + ', value : ' +  ingredient_obj[key])
	})
	*/






