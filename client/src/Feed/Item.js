import React from "react";
import exif from "exif-js";
import exif2css from "exif2css";
import VisibilitySensor from "react-visibility-sensor";

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
      <a href={`/image?src=${item.src}`}>
        <div style={{alignItems: "center", width: "100%", display: "flex", marginBottom: "20px"}}>
          <VisibilitySensor>
            {({isVisible}) =>
              isVisible
                ? (item.type === "image" && <img style={imageStyle} src={item.src} />)
                : <div style={imageStyle}>&nbsp;</div>
            }
          </VisibilitySensor>
        </div>
      </a>
    );
  }

}

export default Item;
