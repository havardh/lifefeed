import {getData, getTag} from "exif-js";

function resetOrientation(file, srcOrientation) {
  console.log(file);
  return new Promise(resolve => {
  	const img = new Image();

  	img.onload = function() {
    	const width = img.width,
      		height = img.height,
          canvas = document.createElement('canvas'),
  	  		ctx = canvas.getContext("2d");

      // set proper canvas dimensions before transform & export
  		if (4 < srcOrientation && srcOrientation < 9) {
      	canvas.width = height;
        canvas.height = width;
      } else {
      	canvas.width = width;
        canvas.height = height;
      }

    	// transform context before drawing image
  		switch (srcOrientation) {
        case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
        case 3: ctx.transform(-1, 0, 0, -1, width, height ); break;
        case 4: ctx.transform(1, 0, 0, -1, 0, height ); break;
        case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
        case 6: ctx.transform(0, 1, -1, 0, height , 0); break;
        case 7: ctx.transform(0, -1, -1, 0, height , width); break;
        case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
        default: break;
      }

  		// draw image
      ctx.drawImage(img, 0, 0);

  		// export base64
  		resolve(canvas.toDataURL(file.type));
    };

    const fileReader = new FileReader();
    fileReader.onload = () => {
      img.src = fileReader.result;
    }
    fileReader.readAsDataURL(file);
  });
}

function getOrientation(file) {
  const orientationTagName = "Orientation";

  return new Promise(resolve => {
    getData(file, function() {
      const orientation = getTag(file, orientationTagName);
      resolve(orientation);
    });
  });
}

function urltoFile(url, filename, mimeType) {
    mimeType = mimeType || (url.match(/^data:([^;]+);/)||'')[1];
    return (fetch(url)
        .then(res => res.arrayBuffer())
        .then(buf => new File([buf], filename, {type:mimeType}))
    );
}


export default async function rotate(file) {
  const orientation = await getOrientation(file);

  const base64 = await resetOrientation(file, orientation);

  return urltoFile(base64, file.name);
}
