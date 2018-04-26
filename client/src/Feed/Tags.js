import React from "react";
import { Subscribe } from "unstated";
import FontAwesome from "react-fontawesome";

import FileListContainer from "./FileList";
import * as Service from "../Service";

const itemStyle = {
  display: "flex",
  height: "40px",
  margin: "1px 2px",
  padding: "5px",
  backgroundColor: "#eee"
}
export default class Tags extends React.Component {

  state = {
    name: "",
    tags: []
  };

  componentDidMount() {
    this.update();
  }

  update = () => {
    Service.get("/api/tag/all")
      .then(res => res.json())
      .then(({tags}) => {
        this.setState({tags});
      });
  }

  onUpdate = ({target}) => {
    const {value} = target;
    this.setState({name: value});
  }

  createTag = () => {
    const {name} = this.state;

    Service.put({
      url: "/api/tag/create",
      body: JSON.stringify({name}),
      headers: {'Content-Type': "application/json"}
    })
      .then(result => {
        this.update();
      });
  }

  render() {
    const {tags} = this.state;

    const wrapperStyle = {
      boxSizing: "border-box",
      margin: 0,
      padding: 0,
      display: "flex"
    };
    const inputStyle = {
      boxSizing: "border-box",
      margin: 0,
      padding: "0 10px",
      fontSize: "1.2em",
      height: "40px",
      flex: 1
    };
    const buttonStyle = {
      boxSizing: "border-box",
      margin: 0,
      padding: 0,
      height: "40px",
      flex: 0,
      padding: "0px 25px"
    };
    const iconStyle = {
      lineHeight: "40px"
    }

    return (
      <div>
        <div style={wrapperStyle}>
          <input style={inputStyle} onChange={this.onUpdate}></input>
          <button style={buttonStyle} onClick={this.createTag}>
            <FontAwesome name="plus" />
          </button>
        </div>
        <ul style={{listStyleType: "none", marginTop: "20px"}}>
          {tags.map((tag) =>
            <li key={tag.id} style={{overflow: "auto"}}>
              <Subscribe to={[FileListContainer]}>
                {fileList => (
                  <div
                   style={itemStyle}
                   onClick={() => fileList.all(tag) ? fileList.removeTag(tag) : fileList.addTag(tag)}
                  >
                    <div style={{height: "40px", verticalAlign: "middle"}}>
                      {fileList.all(tag) && <FontAwesome style={iconStyle} size="2x" name="check-square" />}
                      {fileList.some(tag) && !fileList.all(tag) && <FontAwesome style={iconStyle} size="2x" name="minus-square" />}
                      {fileList.none(tag) && <FontAwesome style={iconStyle} size="2x" name="square" />}
                    </div>
                    <div style={{lineHeight: "40px", marginLeft: "10px"}}>{tag.name}</div>
                  </div>
                )}
              </Subscribe>
            </li>
          )}
        </ul>
      </div>
    )
  }

}
