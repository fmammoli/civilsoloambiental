import { ImagePool } from "@squoosh/lib";
import { cpus } from "os";
const imagePool = new ImagePool(cpus().length);

import fs from "fs/promises";
import { exit } from "process";

const file = await fs.readFile("./areas_contaminadas_home.jpg");
console.log({ file });
const image = imagePool.ingestImage(file);

await image.decoded; //Wait until the image is decoded before running preprocessors.
console.log(await image.decoded);

const preprocessOptions = {
  //When both width and height are specified, the image resized to specified size.
  //   resize: {
  //     enabled: true,
  //     width: 100,
  //     height: 50,
  //   },

  //   When either width or height is specified, the image resized to specified size keeping aspect ratio.
  resize: {
    enabled: true,
    width: 300,
  },
};
await image.preprocess(preprocessOptions);

const encodeOptions = {
  webp: {}, //an empty object means 'use default settings',

  jxl: {
    quality: 90,
  },
};
await image.encode(encodeOptions);

console.log(await image.encodedWith.webp);

await imagePool.close();

const rawEncodedImage = (await image.encodedWith.mozjpeg).binary;

fs.writeFile("./image.jpg", rawEncodedImage);

// const newImagePath = "./test."; //extension is added automatically

// for (const encodedImage of Object.values(image.encodedWith)) {
//   fs.writeFile(
//     newImagePath + (await encodedImage).extension,
//     (await encodedImage).binary
//   );
// }

console.log("aaaa");
exit();
