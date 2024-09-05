# Lambda

Lambda is a social media web application where users can make posts, comments, like & make friends. Users can also personalize their profile and 
it also have a chatting engine which enables them to talk in real time !

## Features: 


1.  Google authorization for seamless sign-in and sign-up
2.  Secure authentication using Passport.js
3.  Upload profile photos and edit personal information in user profile
4.  Dynamic feed section allowing users to post their thoughts, like and comment on other users' posts
5.  Users can also make friends
6.  Discover section to find all people
7.  Friends section to display all friends at one place
8.  Real-time notifications using Noty
9.  Chat box to talk in real time!
10. Dark UI for nice user experience


## Disclaimer 
``` 
Make sure your node version is v16.16.0 and npm version is v8.11.0 in order to run the application properly
as some of the code will become outdated if you use newer version of Node.
UPD:
Google SignUp/SignIn Feature is disabled for now!
I made this project to learn about how Backend Development works, so I haven't worked on making the website responsive [ I am too lazy for that :P ] 
```


## Installation 

Download the Zip file and extract it
Now, download all the dependencies using 
``` bash 
npm install 
```
You need to setup redis, mongoDB for this to work completely! Refer the following link for deatiled steps: 


> [Redis](https://www.youtube.com/watch?v=nB7zi88DB1Y)

> [MongoDB](https://www.mongodb.com/docs/compass/current/)

## Caution
If you do any changes to the scss/css or js files, and you are trying to run it in production mode ( for which you also have to manually
add environment variables in your system), you need to use gulp to compress and process the respective files to reflect the changes. 

``` js
gulp build
gulp js /*If js files doesn't appear in the rev.manifest.json in the /public/assets folder. */
```

To run the project in development mode use : 
``` bash 
npm start
``` 

To run the project in production mode use: 
``` bash 
npm run prod_start
```

The application should be running on local host(i.e. http://localhost:8000).


 



