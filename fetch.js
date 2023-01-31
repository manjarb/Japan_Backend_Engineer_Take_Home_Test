const args = process.argv.slice(2);
const axios = require("axios");
const fs = require("fs");
const cheerio = require("cheerio");

if (!args.length) {
  console.log("Error: Please provide urls");
  process.exit();
}

async function downloadAssetsByTag($, fullUrl, pathName, tagName, sourceAttr) {
  $(tagName).map(async function () {
    const src = $(this).attr(sourceAttr);
    if (src && !src.includes("http")) {
      if (tagName === 'link' && !src.includes('.css')) {
        return;
      }

      try {
        const res = await axios({
          url: `${fullUrl}/${src}`,
          responseType: "stream",
        })

        const dir = `${pathName}/${src.split('/').slice(0, -1).join('/')}`;
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        return new Promise((resolve, reject) => {
          const dir = `${pathName}/${src.split('/').slice(0, -1).join('/')}`;
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }

          const fileSrc = `${pathName}/${src.split('?')[0]}`;
          res.data
            .pipe(fs.createWriteStream(fileSrc))
            .on("finish", () => resolve())
            .on("error", (e) => reject(e));
        });
      } catch (error) {
        console.log(error);
      }
    }
  });
}

async function saveAssets(fullUrl, urlName, data) {
  const dirname = "./files_assets";
  const fileName = `${urlName}.html`;
  const pathName = `${dirname}/${urlName}`;
  const fileLocation = `${pathName}/${fileName}`;

  if (!fs.existsSync(pathName)) {
    fs.mkdirSync(pathName, { recursive: true });
  }

  fs.writeFileSync(fileLocation, data);
  const $ = cheerio.load(data);
  await downloadAssetsByTag($, fullUrl, pathName, "img", 'src');
  await downloadAssetsByTag($, fullUrl, pathName, "script", 'src');
  await downloadAssetsByTag($, fullUrl, pathName, "link", 'href');
}

async function fetchFromUrls(urls) {
  for (const url of urls) {
    try {
      const { data } = await axios.get(url);
      const urlSplit = url.split("//");
      const urlName = urlSplit.length > 1 ? urlSplit[1] : urlSplit[0];
      const dirname = "./files";
      const fileName = `${urlName}.html`;
      const fileLocation = `${dirname}/${fileName}`;

      if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname);
      }

      fs.writeFileSync(fileLocation, data);
      const hrefs = [...new Set(data.match(/href="([^\'\"]+)/g))];
      const images = data.match(/<img .*?>/g);
      const now = new Date();
      console.log(`site: ${urlName}`);
      console.log(`num_links: ${hrefs.length}`);
      console.log(`images: ${images.length}`);
      console.log(`last_fetch: ${now.toUTCString()}`);
      console.log("Success created: ", fileName);
      console.log("-----------------------------");

      // Save Assets locally
      await saveAssets(url, urlName, data);
    } catch (error) {
      console.log(error);
    }
  }
}

fetchFromUrls(args);
