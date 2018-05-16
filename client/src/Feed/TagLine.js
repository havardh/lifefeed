import React from "react";
import * as Service from "../Service";

const tagStyle = {
  backgroundColor: "#eee",
  margin: "5px",
  padding: "5px",
};

const Tag = ({name}) => (
  <div style={tagStyle}>{name}</div>
);

const buttonStyle = {
  cursor: "pointer",
  backgroundColor: "#eee",
  margin: "5px",
  padding: "5px",
};

const EditTags = ({onClick}) => (
  <div style={buttonStyle} onClick={onClick}>Legg til / Fjern tags</div>
);

const wrapperStyle = {
  margin: "10px",
  maxWidth: "90vw",
  display: "flex",
  flexWrap: "wrap",
};

export default class TagLine extends React.Component {

  state = { tags: [] };

  async componentDidMount() {
    const {itemId} = this.props;

    const response = await Service.get(`/api/feed/image/${itemId}/tags`);

    const {tags} = await response.json();

    this.setState({tags});
  }

  onClick = () => {
    const {itemId} = this.props;
    this.props.history.push(`/image/${itemId}/tags`)
  }

  render() {
    const {tags} = this.state;

    return (
      <div style={wrapperStyle}>
        {tags.map(({id, name}) => (<Tag key={id} name={name} />))}
        <EditTags onClick={this.onClick} />
      </div>
    );
  }

}
