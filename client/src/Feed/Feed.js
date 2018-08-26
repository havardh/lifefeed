import React from "react";
import FontAwesome from "react-fontawesome";

import Item from "./Item";
import PopularTags from "./PopularTags";
import * as Service from "../Service";

function queryDict() {
  /* eslint-disable no-restricted-globals */
  const qd = {};
  if (location.search) location.search.substr(1).split("&").forEach(function(item) {
    var s = item.split("="),
        k = s[0],
        v = s[1] && decodeURIComponent(s[1]);
    (qd[k] = qd[k] || []).push(v);
  })
  return qd;
}

function createUrl(base, tags) {
  const url = new URL(base);

  if (tags) {
    const searchParams = new URLSearchParams();
    for (let tag of tags) {
      searchParams.append("tags", tag);
    }
    url.search = searchParams;
  }

  return url;
}

const FeedList = ({items}) => (
  <ul>
    {items.map((item) => <Item key={item.id} {...item} />)}
  </ul>
)

const addButtonStyle = {
  backgroundColor: "#d23f31",
  color: "#FFF",
  borderRadius: "50%",
  outline: "none",
  border: "none",
  width: "60px",
  height: "60px",
  fontSize: "1.4em",
  boxShadow: "0px 2px 10px 0px rgba(0,0,0,0.5)"
};

const Add = ({history}) => (
  <div style={{position: "fixed", bottom: "30px", right: "30px", top: "auto", left: "auto", margin: "auto"}}>
    <button style={addButtonStyle} onClick={() => history.push("/add")}>
      +
    </button>
  </div>
);

export default class Feed extends React.Component {

  constructor(props) {
    super(props);
    this.state = { items: [], tags: queryDict().tags || [] };
  }

  componentDidMount() {
    const base = document.location.origin + "/api/feed/images";
    const query = queryDict();
    const url = createUrl(base, query.tags);

    Service.get(url)
      .then(res => res.json())
      .then(({items}) => {
      this.setState({items});
    })
  }

  onChange = ({target}) => {
    const {value} = target;

    if (value) {
      const tags = value.split(' ');
      this.setState({tags})
    }
  };

  onClickTag = (tag) => {
    this.setState(({tags}) => {
      if (tags.includes(tag)) {
        const i = tags.indexOf(tag);

        return {tags: [
          ...tags.slice(0, i),
          ...tags.slice(i + 1)
        ]};
      } else {
        return {tags: [...tags, tag]};
      }
    }, this.search);

  }

  search = () => {
    const {tags} = this.state;
    const url = createUrl(document.location.href, tags);

    window.location.href = url.toString();
  }

  render() {
    const {items} = this.state;

    const {tags} = queryDict();

    let tagString = ""
    if (tags) {
      tagString = tags.join(" ")
    }

    const wrapperStyle = {
      boxSizing: "border-box",
      margin: 0,
      padding: 0,
      display: "flex"
    };
    const inputStyle = {
      boxSizing: "border-box",
      margin: 0,
      padding: "0 10px",
      fontSize: "1.2em",
      height: "40px",
      flex: 1
    };
    const buttonStyle = {
      boxSizing: "border-box",
      margin: 0,
      height: "40px",
      flex: 0,
      padding: "0px 25px"
    };

    return (
      <div>
        <div style={wrapperStyle}>
          <input
            style={inputStyle}
            defaultValue={tagString}
            placeholder={"Søk etter tags"}
            onChange={this.onChange}
          />
          <button style={buttonStyle} onClick={this.search}>
            <FontAwesome name="search" />
          </button>
        </div>

        <PopularTags
          activeTags={this.state.tags}
          onClick={this.onClickTag}
        />

        <div style={{marginTop: "20px"}}>
          <FeedList items={[{type: "video", id: 1, src: "api/feed/image/20180517_131959.mp4"}, ...items]}/>
        </div>
        <Add history={this.props.history} />
      </div>
    )
  }
}
