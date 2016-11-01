##Neighorhood Map Project

I add a few enhancements. Custom markers are used. When a menu item is selected, the map moves center the selected image on the map.
I used the panTo function [described here on stack overload](http://stackoverflow.com/questions/9335150/slow-down-google-panto-function/31203045)

##Dependencies for Development

- install node.js and npm
[install node](https://nodejs.org/en/).
[how to install npm on a mac](http://blog.teamtreehouse.com/install-node-js-npm-mac).
[how to install npm on a pc](http://blog.teamtreehouse.com/install-node-js-npm-windows).

- install devDependencies. cd to main directory (which has the gulpfile). Install each of the following packages (gulp, gulp-sass, gulp-watch, autoprefixer, browser-sync, gulp-eslint, gulp-jasmine-phantom, gulp-concat, gulp-uglify, gulp-babel, gulp-imagemin, imagemin-pngquant, gulp-gh-pages) with the following npm command:
```bash
$> npm install --save-dev package_name
```
- run gulp
```
$> gulp
```
- sass should compile on change + save and reload in browser
- html change also triggers reload
- Edit files in the **src** folder not the **dist** folder!

