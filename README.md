# Edu's Forms [![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/EduFdezSoy)

A simple form generator app.

## Description
I made this to have a dead simple form generator usable as-is or as a module to other pages.

# ------ TODO ------
## Instalation
This runs with [PocketBase]("https://pocketbase.io/") as backend. To make it work just create a collection *(I named it `forms` but you can put the name you want)* and add this fields: 
<!-- 
- `name` as **text**
- `done` as **bool**
- `task` as **text**
- `every` as **text** with this regex pattern `^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$`
- `lastTime` as **number** -->

In the **API Rules** you need *at least* to unlock the calls so everyone can use the API. You may set also some rules to only allow what you want to do.

Once the collection is done we need to **clone** this repo in the **pb_public** folder, alongside the pocketbase executable.  
Contents of **pb_public** will be server in the base path.

Now we need to edit the **js/config.js** with our url and collection name and you are good to go.

## Donations
If you really liked it and feel like I deserve some money, you can buy me a [coffee](https://ko-fi.com/EduFdezSoy) and I'll continue transforming caffeine into code!  

## Copyright
Copyright &copy; 2023 Eduardo Fernandez.  

This content is not licensed, however I reserve all rights, if you want to use something of it just drop me an email at [yo@edufdez.es](mailto:yo@edufdez.es).
