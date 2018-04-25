import React from "react";
import {Link} from "react-router-dom"
import {find} from "lodash";
import exif from "exif-js";
import exif2css from "exif2css";
import "formdata-polyfill";
import { Subscribe, Container } from "unstated";
import Spinner from "../Spinner";
import FileListContainer from "./FileList";

const buttonStyle = {
  margin: "10px",
  width: "100px",
  height: "40px",
}

const uploadLabelStyle = {
  margin: "10px",
  width: "100px",
  height: "40px",
  border: "1px solid #000",
  background: "#ddd",
  display: "inline-block"
}

const previewsStyle = {
  display: "grid",
  gridAutoFlow: "row",
  overflow: "auto",
  height: "80%",
  width: "80%"
}

const previewStyle = {
  border: "1px solid #EEE",
  padding: "2px",
  margin: "2px",
  width: "100vv",
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

  if (text.length > 30) {
    return text.substr(0, 25) + "..." + text.substr(text.length-5);
  } else {
    return text;
  }
}

const tagStyle = {
  margin: "5px",
  height: "20px",
  padding: "2px",
  backgroundColor: "#EEE",
  borderRadius: "5px"
};

const Tag = ({children}) => (
  <div style={tagStyle}>{children}</div>
);

const TagList = ({tags}) => (
  <div style={{height: "100px", display: "flex", flexWrap: "wrap"}}>
    {tags.map(({id, name}) => <Tag key={id}>{name}</Tag>)}
  </div>
);

class Preview extends React.Component {

  constructor(props) {
    super(props);
    this.state = {src: '', selected: false};

    const {file} = props;
    const fileReader = new FileReader();

    fileReader.onload = () => {
      this.setState({src: fileReader.result})
    }
    fileReader.readAsDataURL(file);
  }

  onClick = () => {
    this.setState(
      ({selected}) => ({selected: !selected}),
      () => this.props.onSelectionChange(this.state.selected)
    );
  }

  render() {
    const {file} = this.props;
    const {src} = this.state;

    return (
      <div style={previewStyle} onClick={this.onClick}>
        <span style={previewLabelStyle}>{ellipsis(file.name)}</span>
        <div style={{display: "flex"}}>
          <div style={{width: "80px", height: "100px"}}>
            <input
              style={{width: "60px", height: "60px", margin: "15px 10px"}}
              type="checkbox"
              readOnly
              checked={this.props.selected}
            />
          </div>
          <img style={previewImageStyle} src={src} />
          <TagList tags={this.props.tags || []} />
        </div>
      </div>
    );
  }

}

class Form extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      failed: false
    }
  }

  onUpload = () => {
    const {fileList} = this.props;

    const files = fileList.state.files.map(({file}) => file);

    const formData = new FormData();
    for (let file of files) {
      formData.append('files[]', file, file.name);
    }

    const metadata = fileList.state.files.map(({file, tags}) => ({
      file: {name: file.name, size: file.size},
      tags
    }));

    formData.append('metadata', JSON.stringify(metadata));

    this.setState({uploading: true, failed: false});
    fetch("/api/feed/image", {
      credentials: "same-origin",
      method: "PUT",
      body: formData
    }).then(result => {
      this.setState({uploading: false});
      if (result.status === 200) {
        this.onClose({shouldFetch: true});
      } else {
        this.setState({failed: true, debug: result});
      }
    });
  }

  onChangeTags = () => {
    const {history} = this.props;
    history.push("/tags")
  }

  onClose = () => {
    const {history} = this.props;

    history.goBack();
  }

  render() {
    const {fileList} = this.props;
    const {uploading, failed} = this.state;

    return (
      <div>
        <div>
          <div>
            <div>
              <label style={uploadLabelStyle}>
                <span>Legg til bilder</span>
                <input
                  style={{display: "none"}}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={({target}) => fileList.setFiles(target)}
                />
              </label>
            </div>

            <button
              style={buttonStyle}
              onClick={this.onChangeTags}
            >
              Tags
            </button>

            {fileList.state.transforming ?
              <div><Spinner /></div> :
              <div style={previewsStyle}>
                {fileList.state.files.map(({file, selected, tags}) => (

                  <Preview
                    key={file.name}
                    file={file}
                    selected={selected}
                    tags={tags}
                    onSelectionChange={(selection) => fileList.setSelection(file, selection)}
                  />
                ))}
              </div>}
            </div>

          {uploading && <div><Spinner /></div>}
        </div>

        <footer>
          <button style={buttonStyle} onClick={this.onUpload}>Last opp</button>
          <button style={buttonStyle} onClick={this.onClose}>Avbryt</button>
        </footer>
      </div>
    );
  }

}

class AddItem extends React.Component {
  render() {
    const {history} = this.props;

    return (<Subscribe to={[FileListContainer]}>
      {fileList => (
        <Form fileList={fileList} history={history} />
      )}
    </Subscribe>);
  }
}

export default AddItem;
