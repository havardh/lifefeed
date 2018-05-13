import {exec} from "child_process";
import {promisify} from "util";
import {dirname, basename, join} from "path";
import {access, constants} from "fs";
import mkdirp from "mkdirp";

const sizes = [512, 768, 1024, 1536, 2048];

async function resizeFile({path}, size) {
  try {
    const inFile = path;
    const outFile = join(process.cwd(), dirname(path), `${size}`, basename(path));

    await promisify(mkdirp)(dirname(outFile));
    try {
      await promisify(access)(outFile, constants.F_OK);
      console.log(`Already resized: ${outFile}`)
    } catch (e) {
      try {
        await promisify(access)(inFile, constants.F_OK);
        await promisify(exec)(`convert ${inFile} -resize ${size} ${outFile}`);
        console.log(`Resized: ${outFile}`);
      } catch (e) {
        if (e.code === "ENOENT") {
          console.error(`Could not find file to resize ${inFile}`, e);
        } else {
          throw e;
        }
      }
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function resizeFiles(files) {
  for (let size of sizes) {
    for (let file of files) {
      await resizeFile(file, size);
    }
  }
}

export default async function resize(req, res, next) {
  try {
      await resizeFiles(req.files);
  } catch (e) {
    console.error(e);
    throw e;
  }
  next();
}
