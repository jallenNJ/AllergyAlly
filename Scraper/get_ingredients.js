const scrape = require('website-scraper');
const base_url = "http://foodnetwork.com/search/";
let food_items_urls = [];

let food_items = ["pizza", "burger", "sandwich"];

get_ingredients(food_items);

function get_ingredients(food_items)
{
	for (i = 0; i < food_items.length; i++)
	{
		food_items_urls.push(base_url.concat(food_items[i]));
		console.log(food_items[i]);
		console.log(food_items_urls);
	}

	scrape({
		urls: food_items_urls,
		directory: './foodname',
		sources: [
			{selector: 'div', attr: 'src'}
		]
	});




}
/*
scrape({
	urls: ['http://foodnetwork.com/'],
	directory: './images',
	sources: [
		{selector: 'img', attr: 'src'}
	]
});
*/
