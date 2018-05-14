require("babel-polyfill");
require("babel-register");

const resizeFiles = require("../src/image/resize").resizeFiles;
const Item = require("../src/feed/service");

async function run() {
  const items = await Item.all();

  const files = items.map(({content}) => ({path: content}));

  await resizeFiles(files);
}

run()
  .then(() => console.log("all items resized"))
  .catch(err => console.error(err));
