import {exec} from "child_process";
import {promisify} from "util";

async function rotateFile({path}) {
  try {
    await promisify(exec)(`jhead -autorot ${path}`);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export default async function rotate(req, res, next) {
  try {
    await Promise.all(req.files.map(rotateFile))
  } catch (e) {
    console.error(e);
    throw e;
  }
  next();
}
