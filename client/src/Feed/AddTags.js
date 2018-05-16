import React from "react";
import { Subscribe } from "unstated";

import FileListContainer from "./FileList";
import TagView from "./TagView";

export default class AddTags extends React.Component {

  render() {
    console.log("wat");
    return (
      <Subscribe to={[FileListContainer]}>
        {fileList => (
          <TagView
            onClickTag={tag => fileList.all(tag) ? fileList.removeTag(tag) : fileList.addTag(tag)}
            all={tag => fileList.all(tag)}
            some={tag => fileList.some(tag)}
            none={tag => fileList.none(tag)}
          />
        )}
      </Subscribe>
    );
  }

}
