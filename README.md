# Take Home Test

This script to download webpage and asset locally

### Success feature
- download a webpage from url arguments into `files` folder and assets into `files_assets` folder

### Partial Success feature
- Currently this script can download some sort of assets such as `img, link and script` with normal pattern but still can not download all other assets such as `fonts` and `base64` image file.

### What is not success?
- Modify page link to make the webpage that we download can be seen successfully locally

### How to use the script
Below command will download webpage into `files` folder and assets into `files_assets` folder.
You can add as many url that you need.
```
$ node ./fetch.js https://www.google.com https://autify.com
```

### Future improvement
- Make the script fully download all assets type and also replace content of downloaded page to make sure it could be run locally.
