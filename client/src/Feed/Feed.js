import React from "react";

import Item from "./Item";
import ShowModal from "./ShowModal";
import AddItem from "./AddItem";

const Header = () => (<div>Header</div>);

const Footer = () => (<div>Footer</div>);

const FeedList = ({items}) => (
  <ul>
    {items.map((item) => <Item key={item.id} {...item} />)}
  </ul>
)

const Add = ({onClick}) => (
  <div style={{position: "fixed", bottom: "30px", right: "30px", top: "auto", left: "auto", margin: "auto"}}>
    <button style={{backgroundColor: "#F44336", color: "#FFF", borderRadius: "50%", border: "2px solid #EEE",  width: "60px", height: "60px"}} onClick={onClick}>+</button>
  </div>
);

export default class Feed extends React.Component {

  constructor(props) {
    super(props);
    this.state= {
      modal: undefined,
      items: [],
    };
  }

  openAdd = () => {
    this.setState({
      modal: "add"
    });
  }

  closeModal  =() => {
    this.setState({
      modal: undefined
    });
  }

  componentDidMount() {
    fetch("/api/feed/images")
      .then(res => res.json())
      .then(({items}) => {
      this.setState({items});
    })
  }

  render() {
    const {modal, items} = this.state;

    return (
      <div>
        <Header />

        <FeedList items={items}/>

        <Add onClick={this.openAdd} />

        { modal === "add" && <AddItem onClose={this.closeModal} /> }

        <Footer />
      </div>
    )
  }
}
