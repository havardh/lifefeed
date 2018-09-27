import React from "react";
import VisibilitySensor from "react-visibility-sensor";
import md5 from "md5";

function toSrcset({sources}) {
  return sources.map(({src, width}) => `${src} ${width}`).join(", ");
}

class Item extends React.Component {

  render() {
    const item = this.props;
    const imageStyle = {
      position: "relative",
      maxWidth: "80vw",
      maxHeight: "80vh",
      margin: "auto",
      border: "10px solid #EEE"
    };

    const avatarStyle = {
      opacity: 0.8,
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      position: "absolute",
      top: "-20px",
      left: "-30px",
      border: "5px solid #EEE"
    };

    return (
      <a href={`/image/${item.id}`}>
        <div style={{alignItems: "center", width: "100%", display: "flex", marginBottom: "20px"}}>
          <div style={imageStyle} >
            <img alt={`Item with id ${item.id}`} sizes="80vw" style={{maxWidth: "80vw", maxHeight: "80vh"}} src={item.src} srcSet={toSrcset(item)}/>
            <img style={avatarStyle} alt={`Gravatar for ${item.user}`} src={`https://www.gravatar.com/avatar/${md5(item.user)}?s=60&d=retro`} />
          </div>
        </div>
      </a>
    );
  }

}

export default Item;
