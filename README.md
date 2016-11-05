##Neighorhood Map Project

[Deployed Project Here](http://andrewtdunn.com/_fortgreenemap/)

<p>I made a few enhancements. Custom markers are used. When a menu item is selected, the map moves center the selected image on the map.
I used the panTo function [described here on stack overload](http://stackoverflow.com/questions/9335150/slow-down-google-panto-function/31203045)</p>

<p>Restaurant reviews are generated from the yelp api. </p>
<p>Recreation location and school information is from the wikipedia api</p>

##Dependencies for Development

- install node.js and npm
[install node](https://nodejs.org/en/).
[how to install npm on a mac](http://blog.teamtreehouse.com/install-node-js-npm-mac).
[how to install npm on a pc](http://blog.teamtreehouse.com/install-node-js-npm-windows).

- to install all local packages:
```bash



$> npm i


```
- run gulp
```
$> gulp
```
- sass should compile on change + save and reload in browser
- html change also triggers reload
- Edit files in the **src** folder not the **dist** folder!

map should load at localhost:3000

