import React from "react";
import exif from "exif-js";
import exif2css from "exif2css";
import rotate from "./RotateImage";
import Spinner from "../Spinner";
import "formdata-polyfill";

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
  border: "5px solid #EEE",
  padding: "5px",
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
  width: "auto",
  display: "block",
  margin: "auto"
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
    this.state = {src: ''};

    const {file} = props;
    const fileReader = new FileReader();

    fileReader.onload = () => {
      this.setState({src: fileReader.result})
    }
    fileReader.readAsDataURL(file);
  }

  render() {
    const {file} = this.props;
    const {src} = this.state;

    return (
      <div style={previewStyle}>
        <span style={previewLabelStyle}>{ellipsis(file.name)}</span>
        <img style={previewImageStyle} src={src} />
      </div>
    );
  }

}

class AddItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      files: [],
      transforming: false,
      uploading: false,
      failed: false
    }
  }

  onUpload = () => {
    const formData = new FormData();
    for (let file of this.state.files) {
      formData.append('files[]', file, file.name);
    }

    this.setState({uploading: true, failed: false});
    fetch("/api/feed/image", {
      credentials: "same-origin",
      method: "PUT",
      body: formData
    }).then(result => {
      this.setState({uploading: false});
      if (result.status === 200) {
        this.props.onClose({shouldFetch: true});
      } else {
        this.setState({failed: true, debug: result});
      }
    });
  }

  onChange = (e) => {
    const {files} = e.target;

    this.setState({transforming: true});

    const promises = [];
    for (let file of files) {
      promises.push(rotate(file));
    }

    Promise.all(promises)
      .then(files => this.setState({files}))
      .then(() => this.setState({transforming: false}));
  }

  render() {
    const {onClose} = this.props;
    const {files, uploading, failed, transforming} = this.state;

    return (
      <div style={modalStyle}>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={this.onChange}
        />

        {transforming ?
          <div><Spinner /></div> :
          <div style={previewsStyle}>
            {toArray(files).map(file => (<Preview key={file.name} file={file}/>))}
          </div>
        }

        {uploading && <div><Spinner /></div>}

        <div style={{position: "absolute", bottom: 0}}>
          <button style={buttonStyle} onClick={this.onUpload}>Upload</button>
          <button style={buttonStyle} onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }
}

export default AddItem;
