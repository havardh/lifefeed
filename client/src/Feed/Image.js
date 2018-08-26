import React from "react";

import TagLine from "./TagLine";
import * as Service from "../Service";
import Spinner from "../Spinner";

const imageWrapper = {
  alignItems: "center",
  width: "100%",
  display: "flex",
  flexDirection: "column"
};

const imageStyle = {
  maxWidth: "90vw",
  maxHeight: "90vh",
  margin: "auto",
  border: "10px solid #EEE"
};

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

function toSrcset({sources}) {
  return sources.map(({src, width}) => `${src} ${width}`).join(", ");
}

export default class Image extends React.Component {

  state = {};

  async componentDidMount() {
    const {id} = this.props.match.params;
    const request = await Service.get(`/api/feed/image/${id}`);

    if (request.status === 200) {
      const {item} = await request.json();
      this.setState({item});
    } else if (request.status === 404) {
      const {err} = await request.json();
      throw new Error(err.msg);
    }
  }

  render() {
    const {id} = this.props.match.params;
    const {item} = this.state;

    if (!item) {
      return <Spinner />
    }

    return (
      <div style={imageWrapper}>
        <img sizes="90vw" style={imageStyle} alt={`id ${item.id}`} src={item.src} srcSet={toSrcset(item)} />
        <div>
          <i>av {item.user.split("@")[0]}</i> <a style={buttonStyle} download={item.id} href={item.src}>Last ned</a>
        </div>
        <TagLine itemId={id} history={this.props.history} />
      </div>
    );
  }
}
