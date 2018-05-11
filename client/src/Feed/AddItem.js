import React from "react";
import {Link} from "react-router-dom"
import {find} from "lodash";
import exif from "exif-js";
import exif2css from "exif2css";
import "formdata-polyfill";
import { Subscribe, Container } from "unstated";
import FontAwesome from "react-fontawesome";

import Spinner from "../Spinner";
import FileListContainer from "./FileList";
import * as Service from "../Service";

const previewsStyle = {
  display: "grid",
  gridAutoFlow: "row",
  overflow: "hidden"
}

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
    this.state = {src: ''};

    const {preview} = props;
    console.log(props);
    const fileReader = new FileReader();

    fileReader.onload = () => {
      this.setState({src: fileReader.result})
    }
    fileReader.readAsDataURL(preview);
  }

  onClick = () => {
    this.props.onSelectionChange(this.props.file);
  }

  render() {
    const {file, selected} = this.props;
    const {src} = this.state;

    const previewStyle = {
      backgroundColor: "#eee",
      minWidth: "250px",
      padding: "5px",
      margin: "1px 2px",
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

    return (
      <div style={previewStyle} onClick={this.onClick}>
        <span style={previewLabelStyle}>{ellipsis(file.name)}</span>
        <div style={{display: "flex"}}>
        <div style={{height: "80px", verticalAlign: "middle", marginLeft: "10px", marginRight: "10px"}}>
          {selected && <FontAwesome style={{lineHeight: "80px"}} size="2x" name="check-square" />}
          {!selected && <FontAwesome style={{lineHeight: "80px"}} size="2x" name="square" />}
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
    Service.put({
      url: "/api/feed/image", body: formData
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

    const buttonStyle = {
      display: "inline-block",
      cursor: "pointer",
      backgroundColor: "#eee",
      border: "1px solid #fff",
      padding: "0 28px",
      fontSize: "15px",
      margin: "10px",
      width: "100px",
      height: "40px",
      lineHeight: "40px",
      textAlign: "center",
      verticalAlign: "middle",
      fontFamily: "Roboto"
    };

    return (
      <div>
        <div style={{marginBottom: "60px"}}>
          <div style={{display: "inline-block"}}>
            <label>
              <a style={buttonStyle}>Legg til</a>
              <input
                style={{display: "none"}}
                type="file"
                accept="image/*"
                multiple
                onChange={({target}) => fileList.setFiles(target)}
              />
            </label>
          </div>

          <a
            style={buttonStyle}
            onClick={this.onChangeTags}
          >
            Tags
          </a>

          <div>
            {fileList.state.transforming ?
              <div style={{width: "100%", height: "50hw"}}>
                <Spinner />
              </div> :
              <div style={previewsStyle}>
                {fileList.state.files.map(({file, preview, selected, tags}) => (
                  <Preview
                    key={file.name}
                    file={file}
                    preview={preview}
                    selected={selected}
                    tags={tags}
                    onSelectionChange={(file) => fileList.setSelection(file)}
                  />
                ))}
              </div>}
            </div>

          {uploading && <div><Spinner /></div>}
        </div>

        <footer style={{backgroundColor: "#fff", position: "fixed", bottom: "0px", height: "60px", width: "100%"}}>
          <a style={buttonStyle} onClick={this.onUpload}>
            Last opp {uploading && <Spinner />}
          </a>
          <a style={buttonStyle} onClick={this.onClose}>Avbryt</a>
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
