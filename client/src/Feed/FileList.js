import {find, reject, some as _some, every} from "lodash";
import { Container } from "unstated";
import rotate from "./RotateImage";
import resize from "./ResizeImage";

const previewSize = 80;

function rotateFiles(files) {
  const promises = [];
  for (let file of files) {
    promises.push({
      file,
      preview: resize(file, previewSize).then(rotate)
    });
  }

  return promises;
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
  state = { files: [] };

  setFiles({files}) {
    this.setState({
      files: rotateFiles(files)
        .map(({file, preview}) => ({
          file, preview, selected: false, tags: []
        }))
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
