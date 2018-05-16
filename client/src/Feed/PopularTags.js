import React from "react";

import * as Service from "../Service";

const wrapperStyle = {
  width: "100%",
  marginTop: "10px",
};

const popularTagsStyle = {
  margin: "auto",
  overflowX: "auto",
  overflowY: "hidden",
  whiteSpace: "nowrap",
  display: "flex",
};

const tagStyle = {
  display: "inline-block",
  margin: "5px",
  padding: "5px",
  backgroundColor: "#eee",
  cursor: "pointer",
};

export default class PopularTags extends React.Component {

  constructor(props) {
    super(props);
    this.state = {tags: []};
  }

  componentDidMount() {
    const url = "api/tag/popular";
    Service.get(url)
      .then(res => res.json())
      .then(({tags}) => {
      this.setState({tags});
    })
  }

  render() {
    const {onClick, activeTags} = this.props;
    const {tags} = this.state;
    return (
      <div style={wrapperStyle}>
        <div style={popularTagsStyle}>
          {tags.map(({name}) => (
            <div
              style={tagStyle}
              onClick={() => onClick(name)}>
              {activeTags.includes(name) ? "-" : "+"}{name}
              </div>
          ))}
        </div>
      </div>
    );
  }

}
