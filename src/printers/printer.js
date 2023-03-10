const fs = require("fs");
const pdf = require("html-pdf");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");
const { html } = require("cheerio");

const encodingToMimeType = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
};

async function loadCSSFromFile(filePath) {
  // Read the CSS file content
  let finalPath = path.resolve(filePath);
  let css = fs.readFileSync(finalPath, "utf-8");
  css = await encodeCSSResources(css);
  return css;
}

async function downloadStyles(html) {
  const $ = cheerio.load(html);

  // Find all <link> elements with a "href" attribute and "rel" attribute set to "stylesheet"
  const stylesheetLinks = $('link[rel="stylesheet"][href]');

  // Create an array to store the CSS content
  const css = [];

  // Loop through each stylesheet link and download the CSS content
  for (let i = 0; i < stylesheetLinks.length; i++) {
    let link = stylesheetLinks[i];
    let href = $(link).attr("href");

    if (!/^(https?:\/\/)/i.test(href) && !/^(\/\/)/i.test(href)) {
      href = "https://psnprofiles.com/" + href;
    }

    // Download the CSS content
    const response = await axios.get(href);

    if (href.includes("psnprofiles.css")) {
      //mod
      //htmlContent
      // min-width: 1070px;
      css.push(await loadCSSFromFile("./src/printers/psnprofiles.css"));
    } else {
      css.push(response.data);
    }
  }
  return css;
}

async function encodeCSSResources(css) {
  // Regular expression to match CSS resources
  const resourceRegex = /url\((.*?)\)/g;

  let result;
  // Array to hold all the matched CSS resources
  const resources = [];

  // Iterate over all the matched CSS resources
  while ((result = resourceRegex.exec(css)) !== null) {
    // Push the matched resource to the resources array
    if (result[1].indexOf("/lib/img") >= 0) {
      resources.push(result[1]);
    }
  }

  let formattedFiles = resources.map((file) => {
    return file.replace(/^['"]|['"]$/g, "");
  });

  // Loop through each resource
  for (let i = 0; i < resources.length; i++) {
    let resource = resources[i];
    // Strip quotes and parenthesis from resource
    resource = resource.slice(1, -1);

    // Get the base64 encoded data of the resource using axios
    let finalPath = path.resolve("." + resource.split("?")[0]);
    try {
      let file = fs.readFileSync(finalPath);
      const encoding = resource.split(".")[resource.split(".").length - 1];
      const mimeType = encodingToMimeType[encoding] || "";

      const data = new Buffer.from(file, "binary").toString("base64");
      let base64Url = `data:${mimeType};base64,${data}`;
      base64Url = base64Url.replace(/(\r\n|\n|\r)/gm, "");
      css = css.replace(resources[i], `"${base64Url}"`);
    } catch (err) {}
  }

  return css;
}

async function resolveGenericImgs(htmlContent) {
  // Regular expression to match CSS resources
  const imageRegex = /<img.*?src="(\/lib\/img\/.*?)".*?>/g;

  let result;
  // Array to hold all the matched images resources
  const images = [];

  // Iterate over all the matched CSS resources
  while ((result = imageRegex.exec(htmlContent)) !== null) {
    // Push the matched resource to the resources array
    if (result[1].indexOf("/lib/img") >= 0) {
      images.push(result[1]);
    }
  }

  // Loop through each resource
  for (let i = 0; i < images.length; i++) {
    let resource = images[i];

    // Get the base64 encoded data of the resource using axios
    let finalPath = path.resolve("." + resource.split("?")[0]);
    try {
      let file = fs.readFileSync(finalPath);
      const encoding = resource.split(".")[resource.split(".").length - 1];
      const mimeType = encodingToMimeType[encoding] || "";

      const data = new Buffer.from(file, "binary").toString("base64");
      let base64Url = `data:${mimeType};base64,${data}`;
      base64Url = base64Url.replace(/(\r\n|\n|\r)/gm, "");
      htmlContent = htmlContent.replace(
        `src="${images[i]}"`,
        `src="${base64Url}"`
      );
    } catch (err) {}
  }

  return htmlContent;
}

async function completeBookmarkedUrl(htmlContent, url) {
  //function that appends a url to to all links that start with # like <a href="#6-defeated-dr-steinman" class="title">Defeated Dr. Steinman</a> in a string
  const urlRegex = /<a.*?href="(#.*?)".*?>/g;
  let result;
  // Array to hold all the matched bookmarks resources
  const bookmarks = [];

  // Iterate over all the matched CSS resources
  while ((result = urlRegex.exec(htmlContent)) !== null) {
    // Push the matched resource to the resources array
    if (result[1].indexOf("#") >= 0) {
      bookmarks.push(result[1]);
    }
  }

  console.warn("need to replace this", bookmarks);

  // Loop through each resource
  for (let i = 0; i < bookmarks.length; i++) {
    let resource = bookmarks[i];

    htmlContent = htmlContent.replace(
      `href="${resource}"`,
      `href="${url}${resource}"`
    );
  }

  return htmlContent;
}

async function printAsPdf(htmlContent, url, title = "game") {
  let styles = await downloadStyles(htmlContent);

  let styleElements = "";
  for (let i = 0; i < styles.length; i++) {
    styleElements += `<style>${styles[i]}</style>`;
  }

  htmlContent = htmlContent
    .replace(
      '<link rel="stylesheet" type="text/css" href="/lib/css/psnprofiles.css?24">',
      ""
    )
    .replace(
      '<link rel="stylesheet" type="text/css" href="/lib/css/flexboxgrid.min.css">',
      ""
    )
    .replace(
      '<link rel="stylesheet" type="text/css" href="/lib/css/forms.css">',
      ""
    )
    .replace("</head>", `${styleElements}</head>`);

  htmlContent = await resolveGenericImgs(htmlContent);
  htmlContent = await completeBookmarkedUrl(htmlContent, url);

  const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  let cleanHtml = htmlContent;
  while (SCRIPT_REGEX.test(cleanHtml)) {
    cleanHtml = cleanHtml.replace(SCRIPT_REGEX, "");
  }

  fs.writeFile("index.html", cleanHtml, (err) => {
    if (err) {
      console.error(err);
    }

    console.log("HTML file created successfully.");
  });

  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return new Promise((resolve, reject) => {
    const path = `./${year}-${month}-${day}-${title}-guide.pdf`;
    pdf
      .create(cleanHtml, {
        format: "A4",
        childProcessOptions: {
          env: {
            OPENSSL_CONF: "/dev/null",
          },
        },
      })
      .toFile(path, function (err, res) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve({ path: res.filename });
        }
      });
  });
}

module.exports = {
  printAsPdf: printAsPdf,
};
