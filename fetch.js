const args = process.argv.slice(2);
const axios = require('axios');
const fs = require('fs');

if (!args.length) {
  console.log("Error: Please provide urls");
  process.exit();
}

async function fetchFromUrls(urls) {
  for (const url of urls) {
    try {
      const { data } = await axios.get(url);
      const urlSplit = url.split('//');
      const urlName = urlSplit.length > 1 ? urlSplit[1] : urlSplit[0];
      const dirname = './files';
      const fileName = `${urlName}.html`;
      const fileLocation = `${dirname}/${fileName}`;

      if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname)
      }

      fs.writeFileSync(fileLocation, data);
      console.log(typeof data, ' :data');
      const hrefs = [...new Set(data.match(/href="([^\'\"]+)/g))];
      const images = data.match(/<img .*?>/g);
      const now = new Date();
      console.log(`site: ${urlName}`);
      console.log(`num_links: ${hrefs.length}`);
      console.log(`images: ${images.length}`);
      console.log(`last_fetch: ${now.toUTCString()}`)
      console.log("Success created: ", fileName);
      console.log('-----------------------------');
    } catch (error) {
      console.log(error);
    }
  }
}

fetchFromUrls(args);
