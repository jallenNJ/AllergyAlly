const fs = require('fs')
var express = require('express')
var GCloud = require('MenuImageProcessor')
//var wbParser = require('get_ingredients_request')
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
  /*  await wbParser.Scrape(FoodNames, function(data){
        for(Food in FoodNames){
            IngredentsArrays = data[Food];
            console.log(IngredentsArrays)
            
            for(IngredentsString of IngredentsArrays){
                for(Allergy in AllergyList){
                    if(IngredentsString.contain(Allergy)){
                        delete data.Food;
                        break;
                    }
                }
            }
            
        }
*/
      res.status(200);
        res.send({"EdibleFood" : FoodNames});
        return;

    });
//});

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

//FoodList contains all of the foods from the menu that the user can eat
function getFoodName(FoodList) {
    FullNameArray = []
    for(Food of FoodList){
        //Reg ex string to split on every word that does not have a capital letter in it
        NameArray = Food.split(/\b[a-z].*?\b/g);
        FullNameArray.push(NameArray[0]);
    }

    //Making a new array for the modified food strings
    ModifiedFoodStringsArr=[];

    //Remove item at spot 0 because that will be the title
    FullNameArray.shift();

    //Iterating through fullNameArray (which contains all possible foods, with capital letters)
    //Trying to get it as close to only containing the name of the food as possible
    for(index of FullNameArray){
        if(index.includes("Burger")){
            //Find where the word burger is in the string
            var burgerIndex=index.indexOf("Burger");
            //Adding 6 to burger index to get to end of the word Burger
            burgerIndex+=6;
            
            var modifiedFoodString=index.substring(0, burgerIndex);
            //Adding modified string to arr
            ModifiedFoodStringsArr.push(modifiedFoodString);
        }

        else if(index.includes("$")){
            //Find where $ is in the string
            var dollarIndex=index.indexOf("$");
            //Subtracting 1 from dollarIndex because we want to remove starting with $
            dollarIndex--;

            var modifiedDollarString=index.substring(0, dollarIndex);
            //Adding modified string to arr
            ModifiedFoodStringsArr.push(modifiedDollarString);
        }
        else if(index.includes("Not")){
            continue;
        }
        else if(index.includes("Soup")){
            continue;
        }
        else if(index.includes("Sandwiches")){
            continue;
        }
        //If nothing was changed
        else{
            ModifiedFoodStringsArr.push(index);
        }
    }
    return ModifiedFoodStringsArr;
}

module.exports = router;

//Egg, Milk, Fish, ShellFish, TreeNut, Peanut, TreeNut, Wheat, Soy, Chocolate