import React from "react";
import exif from "exif-js";
import exif2css from "exif2css";

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
      <div style={{alignItems: "center", width: "100%", display: "flex", marginBottom: "20px"}}>
        {item.type === "image" && <img style={imageStyle} src={item.src} />}
      </div>
    );
  }

}

export default Item;
