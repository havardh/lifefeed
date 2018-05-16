import {load, dump, insert} from "piexifjs";

function resizeFile(file, maxSize) {
  return new Promise(resolve => {
  	const img = new Image();

  	img.onload = function() {
    	let width = img.width,
      		height = img.height,
          canvas = document.createElement('canvas'),
  	  		ctx = canvas.getContext("2d");

      let ratio = 1;
      if (height > width) {
      	ratio = height / maxSize;
      } else {
      	ratio = width / maxSize;
      }

      canvas.height = height / ratio;
      canvas.width = width / ratio;

  		// draw image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  		// export base64
      const base64 = canvas.toDataURL(file.type);

      resolve(insert(dump(load(img.src)), base64));
    };

    const fileReader = new FileReader();
    fileReader.onload = () => {
      img.src = fileReader.result;
    }
    fileReader.readAsDataURL(file);
  });
}

function urlToFile(url, filename, mimeType) {
    mimeType = mimeType || (url.match(/^data:([^;]+);/)||'')[1];
    return (fetch(url)
        .then(res => res.arrayBuffer())
        .then(buf => new File([buf], filename, {type:mimeType}))
    );
}

export default async function resize(file, maxSize) {
  const base64 = await resizeFile(file, maxSize)
  return urlToFile(base64, file.name);
}
