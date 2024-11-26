const tripsEndpoint = 'http://localhost:3000/api/trips';
const options = {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
}
// var fs = require('fs');
// var trips = JSON.parse(fs.readFileSync('data/trips.json','utf8'));

/* GET travel view */
const travel = async function(req, res, next) {
    // console.log('TRAVEL CONTROLLER BEGIN');
    await fetch(tripsEndpoint, options)
    .then(res => res.json())
    .then(json => {
        //console.log(json);
        let message = null;
        if(!(json instanceof Array)) {
            message = 'API lookup error';
            json = [];
        }
        else{
            if(!json.length){
                message = 'No trips exist in our database!';
        }
        }
        res.render('travel', {title: 'Travlr Getaways', trips: json, message})
    })
    .catch(err => res.statis(500).send(e.message));
    // console.log('TRAVEL CONTROLLER AFTER RENDER');
};

module.exports= {
    travel
};