import {exec} from "child_process";
import {promisify} from "util";

export async function rotate(file) {
  console.log(file);

  try {
    await promisify(exec)(`jhead -autorot ${file}`);
    console.log("rotated");
    return file;
  } catch (err) {
    console.error(err);
    throw err;
  }

}
