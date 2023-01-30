const args = process.argv.slice(2);
const axios = require('axios');
const fs = require('fs');

if (!args.length) {
  console.log("Error: Please provide urls");
  process.exit();
}

async function fetchFromUrls(urls) {
  console.log(urls, ' :urls');
  for (const url of urls) {
    console.log(url, ' :argargarg');
    try {
      const { data } = await axios.get(url);
      const urlSplit = url.split('//');
      const urlName = urlSplit.length > 1 ? urlSplit[1] : urlSplit[0];
      const fileName = `${urlName}.html`;
      fs.writeFileSync(fileName, data);
      console.log("Success created: ", fileName);
    } catch (error) {
      console.log(error);
    }
  }
}

fetchFromUrls(args);
