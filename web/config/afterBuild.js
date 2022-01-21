const fs = require("fs");
const path = require("path");

function removeSourceMapFileInJs() {
  let targetPath = path.resolve(__dirname, "../build/static/js");
  let files = fs.readdirSync(targetPath);
  files.forEach((file) => {
    if (file.indexOf(".map") !== -1) {
      fs.unlinkSync(path.resolve(targetPath, file));
    }
  });
}

removeSourceMapFileInJs();
