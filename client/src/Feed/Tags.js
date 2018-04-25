import React from "react";
import { Subscribe } from "unstated";
import FileListContainer from "./FileList";


const itemStyle = {
  display: "flex",
  height: "40px",
  margin: "1px",
  padding: "5px",
  backgroundColor: "#f1f1f1",
  border: "1px solid #111"
}
export default class Tags extends React.Component {

  state = {
    name: "",
    tags: []
  };

  componentDidMount() {
    this.update();
  }

  update = () => {
    fetch("/api/tag/all", {
      credentials: "same-origin"
    })
      .then(res => res.json())
      .then(({tags}) => {
        this.setState({tags});
      });
  }

  onUpdate = ({target}) => {
    const {value} = target;
    this.setState({name: value});
  }

  createTag = () => {
    const {name} = this.state;

    fetch("/api/tag/create", {
      credentials: "same-origin",
      method: "PUT",
      headers: {
        'Content-Type': "application/json",
      },
      body: JSON.stringify({name})
    }).then(result => {
      this.update();
    });
  }


  onClick = () => {
    const {history} = this.props;
    history.goBack();
  }

  render() {
    const {tags} = this.state;

    return (
      <div>
        <button style={{width: "100px", height: "40px"}} onClick={this.onClick}>{"<"}</button>
        <div>
          <input style={{width: "78%", height: "40px"}} onChange={this.onUpdate}></input>
          <button style={{width: "20%", height: "40px"}} onClick={this.createTag}>Lag ny</button>
        </div>
        <ul style={{listStyleType: "none"}}>
          {tags.map((tag) =>
            <li key={tag.id} style={{overflow: "auto"}}>
              <Subscribe to={[FileListContainer]}>
                {fileList => (
                  <div
                   style={itemStyle}
                   onClick={() => fileList.all(tag) ? fileList.removeTag(tag) : fileList.addTag(tag)}
                  >
                    <div>
                      {fileList.all(tag) && <span>✔️</span>}
                      {fileList.some(tag) && !fileList.all(tag) && <span>➖</span>}
                      {fileList.none(tag) && <span>☐</span>}
                    </div>
                    <div>{tag.name}</div>
                  </div>
                )}
              </Subscribe>
            </li>
          )}
        </ul>
      </div>
    )
  }

}
