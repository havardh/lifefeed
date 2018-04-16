import React from "react";
import exif from "exif-js";
import exif2css from "exif2css";

const modalStyle = {
  position: "fixed",
  top: 0,
  bottom: 0,
  left: 0,
  right:0,
  backgroundColor: "white",
  border: "10px solid #EEE",
  width: "85%",
  height: "85%",
  padding: "20px",

  margin: "auto",
};

const buttonStyle = {
  margin: "10px",
  width: "100px",
  height: "40px"
}

const previewsStyle = {
  display: "grid",
  gridAutoFlow: "column",
  overflow: "auto",
  height: "80%",
  width: "80%"
}

const previewStyle = {
  border: "5px",
  padding: "5px",
  backgroundColor: "red",
  width: "100px",
  height: "100px"
}

const previewLabelStyle = {
  textOverflow: "ellipsis"
}

const previewImageStyle = {
  maxHeight: "80px",
  maxWidth: "80px",
  height: "auto",
  width: "auto"
};

function toArray(files) {
  const array = [];

  for (let file of files) {
    array.push(file);
  }

  return array;
}

function ellipsis(text) {
  if (text.length > 12) {
    return text.substr(0, 4) + "..." + text.substr(text.length-5);
  } else {
    return text;
  }
}

class Preview extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      src: '',
      css: {},
    }

    const {file} = props;
    const that = this;
    exif.getData(file, function() {
      const orientation = exif.getTag(this, "Orientation");
      const exifcss = exif2css(orientation);

      const css = {
        transform: exifcss.transform,
        transformOrigin: exifcss['transform-origin']
      }

      that.setState({css});
    });

    const fileReader = new FileReader();

    fileReader.onload = () => {
      this.setState({src: fileReader.result})
    }
    fileReader.readAsDataURL(file);
  }

  render() {
    const {file} = this.props;
    const {src, css} = this.state;

    const style = {
      ...previewImageStyle,
      ...css
    };

    return (
      <div style={previewStyle}>
        <span style={previewLabelStyle}>{ellipsis(file.name)}</span>
        <img style={style} src={src} />
      </div>);
  }

}

class AddItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {files: []}
  }

  onUpload = () => {
    const formData = new FormData();

    for (let file of this.state.files) {
      if (!file.type.match('image.*')) {
        throw new Error("not an image: " + file.name);
      }

      formData.append('images[]', file, file.name);
    }

    fetch("/api/feed/image", {
      method: "POST",
      body: formData
    }).then(result => {
      console.log(result);
    });
  }

  onChange = (e) => {
    const {files} = e.target;
    this.setState({files});
  }

  render() {
    const {onClose} = this.props;
    const {files} = this.state;

    return (
      <div style={modalStyle}>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={this.onChange}
        />
        <div style={previewsStyle}>
          {toArray(files).map(file => (<Preview key={file.name} file={file}/>))}
        </div>

        <div style={{position: "absolute", bottom: 0}}>
          <button style={buttonStyle} onClick={this.onUpload}>Upload</button>
          <button style={buttonStyle} onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }
}

export default AddItem;
