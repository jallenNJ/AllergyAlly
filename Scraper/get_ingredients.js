const scrape = require('website-scraper');
const url = "http://foodnetwork.com/search/";


let food_items = ["pizza", "burger", "sandwich"];

get_ingredients(food_items);

function get_ingredients(food_items)
{
	for (i = 0; i < food_items.length; i++)
	{
		console.log(food_items[i]);
	}


	//let map = {name :
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
