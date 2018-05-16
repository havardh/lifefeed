import React from "react";

import * as Service from "../Service";
import TagView from "./TagView";

export default class ImageTags extends React.Component {

  state = { tags: [] };

  async componentDidMount() {
    await this.update();
  }

  async update () {
    const {id} = this.props.match.params;

    const response = await Service.get(`/api/feed/image/${id}/tags`);
    const {tags} = await response.json();

    this.setState({tags});
  }

  onClickTag = async (tag) => {
    const {id} = this.props.match.params;
    const {tags} = this.state;

    const url = `/api/feed/image/${id}/tags/${tag.id}`;

    if (tags.map(({id}) => id).includes(tag.id)) {
      await Service.del({url});
    } else {
      await Service.put({url});
    }

    await this.update();
  }

  render() {
    const tags = (this.state && this.state.tags) || [];

    return (
      <TagView
        onClickTag={this.onClickTag}
        all={({id}) => tags.map(({id}) => id).includes(id)}
        some={() => false}
        none={({id}) => !tags.map(({id}) => id).includes(id)}
      />
    );
  }

}
