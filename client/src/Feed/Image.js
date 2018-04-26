import React from "react";

const imageStyle = {
  maxWidth: "90vw",
  maxHeight: "90vh",
  margin: "auto",
  border: "10px solid #EEE"

};

const Image = ({match}) => (
  <div style={{alignItems: "center", width: "100%", display: "flex"}}>
    <img style={imageStyle} src={new URLSearchParams(document.location.search).get("src")} />
  </div>
);

export default Image;
