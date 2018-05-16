import React from "react";
import VisibilitySensor from "react-visibility-sensor";

function toSrcset({sources}) {
  return sources.map(({src, width}) => `${src} ${width}`).join(", ");
}

class Item extends React.Component {

  render() {
    const item = this.props;
    const imageStyle = {
      maxWidth: "80vw",
      maxHeight: "80vh",
      margin: "auto",
      border: "10px solid #EEE"
    };

    return (
      <a href={`/image/${item.id}`}>
        <div style={{alignItems: "center", width: "100%", display: "flex", marginBottom: "20px"}}>
          <VisibilitySensor>
            {({isVisible}) =>
              isVisible
                ? (item.type === "image" && <img alt={`Item with id ${item.id}`} sizes="80vw" style={imageStyle} src={item.src} srcSet={toSrcset(item)} />)
                : <div style={imageStyle}>&nbsp;</div>
            }
          </VisibilitySensor>
        </div>
      </a>
    );
  }

}

export default Item;
