import React from "react";
import {Link} from "react-router-dom";

import Item from "./Item";
import ShowModal from "./ShowModal";
import AddItem from "./AddItem";

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
  console.log(base);
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

const Add = () => (
  <div style={{position: "fixed", bottom: "30px", right: "30px", top: "auto", left: "auto", margin: "auto"}}>
    <button style={{backgroundColor: "#F44336", color: "#FFF", borderRadius: "50%", border: "2px solid #EEE",  width: "60px", height: "60px"}}>
      <Link to="/add">+</Link>
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

    fetch(url, {credentials: "same-origin"})
      .then(res => res.json())
      .then(({items}) => {
      this.setState({items});
    })
  }

  onChange = ({target}) => {
    const {value} = target;

    if (value) {
      this.setState({tags: value.split(' ')})
      const tags = value.split(' ');
    }
  };

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

    return (
      <div>
        <input
          style={{width: "78%", height: "40px"}}
          defaultValue={tagString}
          placeholder={"Søk etter tags"}
          onChange={this.onChange}
        />
        <button  style={{width: "20%", height: "40px"}} onClick={this.search}>Søk</button>

        <FeedList items={items}/>
        <Add />
      </div>
    )
  }
}
