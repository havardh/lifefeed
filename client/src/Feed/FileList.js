import React from "react";
import {find, uniq, reject, some as _some, includes, every} from "lodash";
import { Subscribe, Container } from "unstated";
import rotate from "./RotateImage";
import resize from "./ResizeImage";

const previewSize = 80;

function rotateFiles(files) {
  const promises = [];
  for (let file of files) {
    promises.push(
      resize(file, previewSize)
        .then(rotate)
        .then(preview => ({ preview, file }))
    );
  }

  return Promise.all(promises);
}

function equalsFile(file) {
  return ({name, lastModified}) => (name === file.name && lastModified === file.lastModified);
}

function equalsTag(tag) {
  return ({id}) => id === tag.id;
}

function hasTag(tags, tag) {
  return !!find(tags, equalsTag(tag))
}

export default class FileListContainer extends Container {
  state = {
    files: [],
    transforming: false
  };

  setFiles({files}) {
    this.setState({transforming: true});
    return rotateFiles(files)
      .then(rotated => {
        /*if (this.state.files.length) {
          this.setState({
            files: files.map(file => {
              const {selected, tags} = find(
                this.state.files,
                equalsFile(file),
                {selected: false, tags: []}
              );
              return {file, tags, selected };
            })
          });
        } else {*/
        this.setState({
          files: rotated.map(({file, preview}) => ({file, preview, selected: false, tags: []})),
        });

        //}
      })
      .then(() => {
        this.setState({transforming: false});
      });
  }

  setSelection(file) {
    this.setState(({files}) => ({
      files: files.map(fileRecord => {
        if (equalsFile(file)(fileRecord.file)) {
          fileRecord.selected = !fileRecord.selected;
        }
        return fileRecord;
      })
    }));
  }

  empty() {
    return this.state.files.length === 0;
  }

  selected() {
    return _some(
      this.state.files,
      ({selected}) => selected
    ) && this.state.files.length !== 0
  }

  some(tag) {
    return _some(
      this.state.files.filter(({selected})=>selected),
      ({tags}) => hasTag(tags, tag)
    ) && this.state.files.length !== 0;
  }

  all(tag) {
    return every(
      this.state.files.filter(({selected})=>selected),
      ({tags}) => hasTag(tags, tag)
    ) && this.state.files.length !== 0;
  }

  none(tag) {
    return !this.some(tag);
  }

  addTag(tag) {
    this.setState(({files}) => ({
      files: files.map(file => {
        if (file.selected) {
          const tags = file.tags || [];
          if (!hasTag(tags, tag)) {
            tags.push(tag);
          }
          file.tags = tags;
        }
        return file;
    })}));
  }

  removeTag(tag) {
    this.setState(({files}) => ({
      files: files.map(file => {
        if (file.selected) {
          file.tags = reject(file.tags || [], equalsTag(tag));
        }
        return file;
    })}));
  }

}
