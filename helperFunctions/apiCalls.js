
const axios = require("axios")
require('dotenv').config()

const getTweets = async (userId) => {
    var url = "https://api.twitter.com/2/users/" + userId + "/tweets"
    axios({
        method:'get',
        url,
        headers: {
            Authorization: 'Bearer ' + process.env.twitterApiBearerToken //the token is a variable which holds the token
        },
    })
    .then(function (response) {
        return response.data
        //res.send(JSON.stringify(response.data));
    })
    .catch(function (error) {
        console.log(error);
    });
}

module.exports = getTweets