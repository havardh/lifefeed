import React from "react";
import VisibilitySensor from "react-visibility-sensor";

function toSrcset({sources}) {
  return sources.map(({src, width}) => `${src} ${width}`).join(", ");
}


const imageStyle = {
  maxWidth: "80vw",
  maxHeight: "80vh",
  margin: "auto",
  border: "10px solid #EEE"
};

const Image = ({item}) => (
  <img alt={`Item with id ${item.id}`} sizes="80vw" style={imageStyle} src={item.src} srcSet={toSrcset(item)} />
);

const videoStyle = {
  maxWidth: "80vw",
  maxHeight: "80vh",
  margin: "auto",
  border: "10px solid #EEE"
}

const Video = ({item}) => (
  <video style={videoStyle} controls autoplay muted loop>
    <source src={item.src} type="video/mp4" />
  </video>
);

class Item extends React.Component {

  render() {
    const item = this.props;

    let Component;

    switch (item.type) {
      case 'image':
        Component = Image;
        break;
      case 'video':
        Component = Video;
    }

    return (
      <a href={`/image/${item.id}`}>
        <div style={{alignItems: "center", width: "100%", display: "flex", marginBottom: "20px"}}>
          <VisibilitySensor>
            {({isVisible}) =>
              isVisible ? <Component item={item} /> : <div style={imageStyle}>&nbsp;</div>
            }
          </VisibilitySensor>
        </div>
      </a>
    );
  }

}

export default Item;
