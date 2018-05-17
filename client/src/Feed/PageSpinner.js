import React from "react";

import Spinner from "../Spinner";

const pageSpinnerStyle = {
  position: "fixed",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  backgroundColor: "#fff",
  opacity: "0.7",
  width: "100%",
  height: "100%",
  zIndex: "2",
  cursor: "pointer",
  display: "flex",
  alignItems: "center"
}

const spinnerStyle = {
  margin: "auto",
  width: "64px",
  height: "64px",
}

const PageSpinner = () => (
  <div style={pageSpinnerStyle}>
    <div style={spinnerStyle}>
    <Spinner />
    </div>
  </div>
);

export default PageSpinner;
