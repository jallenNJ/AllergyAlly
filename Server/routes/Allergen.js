const fs = require('fs')
var express = require('express')
var GCloud = require('MenuImageProcessor')
var wbParser = require('get_ingredients_request')
var router = express.Router();
/*
    TODO: 1. Add the database call for the allergies
          2. Get the Name of the food
          3. Parse the return from the scrapper
*/  
router.post('/', async function(req, res, next){
    RequestBody = req.body;
    //Making the function call supplied by racheal
    fs.writeFile("./temp/TempMenu.png", Buffer.from(RequestBody["Menu"], 'base64'), { flag : 'w' }, function(err) {
        if(err){
            throw(err);
        }
    });
    MenuText = await GCloud.processImage("./temp/TempMenu.png");
    AllFoods = parseMenu(MenuText);

    if(RequestBody["Allergens"] == ""){
        FoodName = getFoodName(AllFoods);
        res.status(200);
        res.send({"EdibleFood" : FoodName})
        return;
    }

    AllergyList = getAllergyFoods(RequestBody["Allergens"]);
    PossibleFoods = removeBadFood(AllFoods, AllergyList);
    FoodNames = getFoodName(AllFoods);
    await wbParser.Scrape(FoodNames, function(data){
        for(Food in FoodNames){
            IngredentsArrays = data[Food];
            console.log(IngredentsArrays)
            /*
            for(IngredentsString of IngredentsArrays){
                for(Allergy in AllergyList){
                    if(IngredentsString.contain(Allergy)){
                        delete data.Food;
                        break;
                    }
                }
            }
            */
        }

        res.status(200);
        res.send({"EdibleFood" : data});
        return;

    });
})

//parses arrays into items
function parseMenu(MenuText) {
    //Regex Search to check to see if the word is only two digits
    MenuText = MenuText.replace(/\n/g, " ");
    Items = MenuText.split(/[\.]\d{2}/gi);
    return Items
}

function getAllergyFoods(Allergies) {
    AllergyToFood = {
        Egg : [
            "egg", "omelette", "ova", "ovo"
            ],
        Milk : [
            "milk", "cream", "cheese", "dairy"
            ],
        Fish : [
            "anchovies", "bass", "catfish", "cod", "flounder", "grouper", "haddock", "hake", "halibut", 
            "herring", "mahi", "perch", "pike", "pollock", "salmon", "scrod", "sole", "snapper",
            "swordfish", "tilapia", "trout", "tuna"
            ],
        ShellFish : [
            "barnacle", "crab", "crawfish", "krill", "lobster", "prawns", "shrimp", "abalone", 
            "clams", "cockle", "cuttlefish", "limpet", "mussels", "octopus", "oysters", "periwinkle",
            "sea cucumber", "sea urchin", "scallops", "snails", "squid", "whelk"
            ],
        TreeNut : [
            "almond", "artificial nuts", "Beechnut", "black walnut hull extract", "brazil nut",
            "butternut", "cashew", "chestnut", "chinquapin nut", "coconut", "filbert", "hazelnut",
            "gianduja", "ginkgo", "hickory nut", "litchi", "lichee", "lychee nut", "macadamia",
            "marzipan", "nangai", "pecan", "pesto", "pili nut", "pine nut","pistachio", "praline", 
            "shea nut", "walnut"
            ],
        Peanut : ["peanut"],
        Wheat : [
            "wheat","flour","pasta","couscous", "Beer"
            ],
        Soy : [
            "soy", "tofu", "miso", "natto", "shoyu", "tempeh", "tamari", "edamane", "vegetable oil",
            "vegetable gum", "vegetable broth", "vegetable starch"
        ],
        Chocolate : [
            "coco", "coco powder", "cocoa", "chocolate"
            ]
    };

    AllergyList = [];
    Allergies = Allergies.split(",");
    for(Allergy of Allergies){
        AllergyList = AllergyList.concat(AllergyToFood[Allergy]);
    }
    return AllergyList;
}

//builds a new array that contains all the possible good foods
function removeBadFood(MenuFoods, AllergyList) {
    //this is ugly
    for(Food in MenuFoods) {
        for(Allergy of AllergyList) {
            if(MenuFoods[Food].includes(Allergy)) {
                MenuFoods.splice(Food, 1);
                break;
            }
        } 
    }
    return MenuFoods;
}

function getFoodName(FoodList) {
    FullNameArray = []
    for(Food of FoodList){
        NameArray = Food.split(/\b[a-z].*?\b/g);
        FullNameArray.push(NameArray[0]);
    }

    return FullNameArray;
}

module.exports = router;

//Egg, Milk, Fish, ShellFish, TreeNut, Peanut, TreeNut, Wheat, Soy, Chocolate