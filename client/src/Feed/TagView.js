import React from "react";
import FontAwesome from "react-fontawesome";

import * as Service from "../Service";


const itemStyle = {
  display: "flex",
  height: "40px",
  margin: "1px 2px",
  padding: "5px",
  backgroundColor: "#eee"
};

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
  height: "40px",
  flex: 0,
  padding: "0px 25px"
};
const iconStyle = {
  lineHeight: "40px"
}

export default class TagView extends React.Component {

    state = { name: "", tags: [] };

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

      const {onClickTag, all, some, none} = this.props

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
                <div
                 style={itemStyle}
                 onClick={() => onClickTag(tag)}
                >
                  <div style={{height: "40px", verticalAlign: "middle"}}>
                    {all(tag) && <FontAwesome style={iconStyle} size="2x" name="check-square" />}
                    {some(tag) && !all(tag) && <FontAwesome style={iconStyle} size="2x" name="minus-square" />}
                    {none(tag) && <FontAwesome style={iconStyle} size="2x" name="square" />}
                  </div>
                  <div style={{lineHeight: "40px", marginLeft: "10px"}}>{tag.name}</div>
                </div>
              </li>
            )}
          </ul>
        </div>
      )
    }

}
