jest.mock('./RotateImage')

function delay(duration) {
	return function(){
		return new Promise(function(resolve, reject){
			setTimeout(function(){
				resolve();
			}, duration)
		});
	};
}

const FileList = require("./FileList").default;

describe("FileList", () => {

  const files = [
    {name: "img1.jpeg", lastModified: 1},
    {name: "img2.jpeg", lastModified: 2}
  ];

  let fileList;
  beforeEach(() => {
    fileList = new FileList();
  });

  it("should set files as rotated", async () => {
    fileList.setFiles({files});
    await Promise.resolve().then(delay(1));

    expect(fileList.state.files).toEqual([
      {file: {name: "img1.jpeg", lastModified: 1}, selected: false, tags: []},
      {file: {name: "img2.jpeg", lastModified: 2}, selected: false, tags: []}
    ]);
  });

  it("should set selection for file", async () => {
    fileList.setFiles({files});
    await Promise.resolve().then(delay(1));

    fileList.setSelection(files[0], true);
    await Promise.resolve().then(delay(1));

    expect(fileList.state.files[0].selected).toEqual(true);
    await Promise.resolve().then(delay(1));

    fileList.setSelection(files[0], false);
    await Promise.resolve().then(delay(1));

    expect(fileList.state.files[0].selected).toEqual(false);
  });

  describe("selection", () => {
    it("should return false when no files", () => {
      expect(fileList.selected()).toEqual(false);
    });

    it("should return false when no files are selected", async () => {
      fileList.setFiles({files});
      await Promise.resolve().then(delay(1));

      expect(fileList.selected()).toEqual(false);
    });

    it("should return true when files are selected", async () => {
      fileList.setFiles({files});
      await Promise.resolve().then(delay(1));

      fileList.setSelection(files[0], true);
      await Promise.resolve().then(delay(1));

      expect(fileList.selected()).toEqual(true);
    });

    it("should return true when all files are selected", async () => {
      fileList.setFiles({files});
      await Promise.resolve().then(delay(1));

      fileList.setSelection(files[0], true);
      fileList.setSelection(files[1], true);
      await Promise.resolve().then(delay(1));

      expect(fileList.selected()).toEqual(true);
    });
  });

  describe("addTag", () => {
    it("should add the tag to the selected files", async () => {
      fileList.setFiles({files});
      await Promise.resolve().then(delay(1));

      fileList.setSelection(files[0], true);
      await Promise.resolve().then(delay(1));

      fileList.addTag({id: 1, name: "location"});
      await Promise.resolve().then(delay(1));

      expect(fileList.state.files[0].tags).toEqual([{id: 1, name: "location"}])
    });

    it("should not add the tag to unselected files", async () => {
      fileList.setFiles({files});
      await Promise.resolve().then(delay(1));

      fileList.setSelection(files[0], true);
      await Promise.resolve().then(delay(1));

      fileList.addTag({id: 1, name: "location"});
      await Promise.resolve().then(delay(1));

      expect(fileList.state.files[1].tags).toEqual([])
    });

    it("should not add the tag twice to a selected file", async () => {
      fileList.setFiles({files});
      await Promise.resolve().then(delay(1));

      fileList.setSelection(files[0], true);
      await Promise.resolve().then(delay(1));

      fileList.addTag({id: 1, name: "location"});
      await Promise.resolve().then(delay(1));

      fileList.addTag({id: 1, name: "location"});
      await Promise.resolve().then(delay(1));

      expect(fileList.state.files[0].tags).toEqual([{id: 1, name: "location"}])
    });
  });

  describe("remove", () => {
    it("should remove the tag from the selected files", async () => {
      fileList.setFiles({files});
      await Promise.resolve().then(delay(1));

      fileList.state.files[0].tags = [{id: 1, name: "location"}];
      fileList.state.files[1].tags = [{id: 1, name: "location"}];

      fileList.setSelection(files[0], true);
      await Promise.resolve().then(delay(1));

      fileList.removeTag({id: 1, name: "location"});
      await Promise.resolve().then(delay(1));

      expect(fileList.state.files[0].tags).toEqual([]);
    });

    it("should not remove the tag from unselected files", async () => {
      fileList.setFiles({files});
      await Promise.resolve().then(delay(1));

      fileList.state.files[0].tags = [{id: 1, name: "location"}];
      fileList.state.files[1].tags = [{id: 1, name: "location"}];

      fileList.setSelection(files[0], true);
      await Promise.resolve().then(delay(1));

      fileList.removeTag({id: 1, name: "location"});
      await Promise.resolve().then(delay(1));

      expect(fileList.state.files[1].tags).toEqual([{id: 1, name: "location"}]);
    });

    it("should not remove fail to remove from file without the tag", async () => {
      fileList.setFiles({files});
      await Promise.resolve().then(delay(1));

      fileList.state.files[0].tags = [];

      fileList.setSelection(files[0], true);
      await Promise.resolve().then(delay(1));

      fileList.removeTag({id: 1, name: "location"});
      await Promise.resolve().then(delay(1));

      expect(fileList.state.files[0].tags).toEqual([]);
    });
  });

  describe("some", () => {
    it("should return true when some selected files has tag", async () => {
      fileList.setFiles({files});
      await Promise.resolve().then(delay(1));

      fileList.state.files[0].tags = [{id: 1, name: "location"}];
      fileList.state.files[0].selected = true;
      fileList.state.files[1].tags = [{id: 1, name: "location"}];
      fileList.state.files[1].selected = true;

      expect(fileList.some({id: 1, name: "location"})).toEqual(true);
    });

    it("should return false when no selected files has tag", async () => {
      fileList.setFiles({files});
      await Promise.resolve().then(delay(1));

      fileList.state.files[0].selected = true;
      fileList.state.files[1].selected = true;

      expect(fileList.some({id: 1, name: "location"})).toEqual(false);
    });

    it("should return false when no files", async () => {
      expect(fileList.some({id: 1, name: "location"})).toEqual(false);
    });

    it("should return false when only unselected files has tag", async () => {
      fileList.setFiles({files});
      await Promise.resolve().then(delay(1));

      fileList.state.files[0].tags = [];
      fileList.state.files[0].selected = true;
      fileList.state.files[1].tags = [{id: 1, name: "location"}];
      fileList.state.files[1].selected = false;

      expect(fileList.some({id: 1, name: "location"})).toEqual(false);
    });
  });

  describe("all", () => {
    it("should return true when all selected files has tag", async () => {
      fileList.setFiles({files});
      await Promise.resolve().then(delay(1));

      fileList.state.files[0].tags = [{id: 1, name: "location"}];
      fileList.state.files[0].selected = true;
      fileList.state.files[1].tags = [{id: 1, name: "location"}];
      fileList.state.files[1].selected = true;

      expect(fileList.all({id: 1, name: "location"})).toEqual(true);
    });

    it("should return false when only some selected files has tag", async () => {
      fileList.setFiles({files});
      await Promise.resolve().then(delay(1));

      fileList.state.files[0].tags = [{id: 1, name: "location"}];
      fileList.state.files[0].selected = true;
      fileList.state.files[1].tags = [];
      fileList.state.files[1].selected = true;

      expect(fileList.all({id: 1, name: "location"})).toEqual(false);
    });

    it("should return false when no selected files has tag", async () => {
      fileList.setFiles({files});
      await Promise.resolve().then(delay(1));

      fileList.state.files[0].selected = true;
      fileList.state.files[1].selected = true;

      expect(fileList.all({id: 1, name: "location"})).toEqual(false);
    });

    it("should return false when no files", async () => {
      expect(fileList.all({id: 1, name: "location"})).toEqual(false);
    });
  })

  describe("none", () => {
    it("should return true when no selected files has tag", async () => {
      fileList.setFiles({files});
      await Promise.resolve().then(delay(1));

      fileList.state.files[0].selected = true;
      fileList.state.files[1].selected = true;

      expect(fileList.none({id: 1, name: "location"})).toEqual(true);
    });

    it("should return false when some selected files has tag", async () => {
      fileList.setFiles({files});
      await Promise.resolve().then(delay(1));

      fileList.state.files[0].selected = true;
      fileList.state.files[1].tags = [{id: 1, name: "location"}];
      fileList.state.files[1].selected = true;

      expect(fileList.none({id: 1, name: "location"})).toEqual(false);
    });

    it("should return true when only unselected files has tag", async () => {
      fileList.setFiles({files});
      await Promise.resolve().then(delay(1));

      fileList.state.files[0].tags = [];
      fileList.state.files[0].selected = true;
      fileList.state.files[1].tags = [{id: 1, name: "location"}];
      fileList.state.files[1].selected = false;

      expect(fileList.none({id: 1, name: "location"})).toEqual(true);
    });

    it("should return true when no files", async () => {
      expect(fileList.none({id: 1, name: "location"})).toEqual(true);
    });
  });
});
