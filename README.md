# Final project

## Website
website url: http://161.35.253.240/
unfortunitly we didn't have enough time to encrypt the website using ssl also we didn't have the money to get the domain name.

## video


## adversity
While developing the website we ran into many problems. The first major one was calling the mongoDB database. While uploading the questions from the game to the database we were having trouble uploading the data luckly we found that we weren't the right parameters. We also had trouble with the sever and how it was sending data through the websocket. At first the websocket wasn't sending any data but after we got it to send data there were problems with how the data was recieved so we found a way to encode the data into json format. Lastly we're currently having problems with the images and having the server on digital ocean send them to the client.

## how to start
- first download node js 
- go to the project directory and run npm install in the comand prompt
- Next in the directory create a file called .env
- go to twitter and generate api keys
- after that go to mongoDB and create a database
- When you create that data base get the Uri
- inside of the .env create 6 varaiables
-- twitterAPiKey = ApiKey
-- twitterApiKeySecret = ApiSecretKey
-- twitterApiBearerToken = BearerToken
-- twitterApiAccessToken = AccessToken
-- twitterApiTokenSecret = TokenSecret
-- MongoDBUri = Uri
- lastly to run the program in the command prompt type 
-- npm run test to run development mode
-- npm run deploy to run server mode

