require('dotenv').config();
// const {TwitterApi} = require('twitter-api-v2');
// //console.log(twitterApi)

// const twitterClient = new TwitterApi(process.env.twitterApiBearerToken);
// const client = new TwitterApi({
//     appKey: process.env.twitterAPiKey,
//     appSecret: process.env.twitterApiKeySecret,
// });

// getData = async function(){
//     //const homeTimeline = await client.v1.homeTimeline();
//     const foundUsers = await client.v1.searchUsers('alki');
//     //const data = await twitterClient.accountsAndUsers.usersSearch({ q: 'twitterDev' });
//     console.log(foundUsers)
//     //console.log(homeTimeline)
// }

// getData()

var Twit = require('twit')

//console.log(process.env.twitterAPiKey)
var T = new Twit({
  consumer_key:         process.env.twitterAPiKey,
  consumer_secret:      process.env.twitterApiKeySecret,
  access_token: process.env.twitterApiAccessToken,
  access_token_secret: process.env.twitterApiTokenSecret,
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

T.get('search/tweets', { q: 'banana since:2011-07-11', count: 100 }, function(err, data, response) {
    console.log(data)
})

// https://api.twitter.com/2/users?ids=2244994945,6253282 -H "Authorization: Bearer AAAAAAAAAAAAAAAAAAAAAA3XbQEAAAAA3JvQKaXwdo8nLnQy%2BrsXEVtVh34%3DzkZLJ88GtaCQIyPmIXeIekRbrYRZR5zfusjQaUOuENm0YuXSb2"
