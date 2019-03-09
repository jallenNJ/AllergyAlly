var express = require('express')
var router = express.Router();

router.post('/', function(req, res, next){
    RequestBody = req.body;
    //Making the function call supplied by racheal
    //MenuText = FunctionCall(RequestBody["Menu"])["textAnnotations"]
    for(MenuWord in MenuText){
        console.log(MenuWord["description"])
        //loop until you see the /[0-9][0-9]/i
    }


    res.status(200);
    res.json();
})

module.exports = router;
