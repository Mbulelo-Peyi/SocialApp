import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles for snow theme

const PostForm = () => {
  const [editorValue, setEditorValue] = useState("");
  const [image, setImage] = useState(null);

  const handleChange = (value) => {
    setEditorValue(value);
  };

  // Custom image handler for uploading images to Quill editor
  const handleImageUpload = (file) => {
    // Here you can upload the image to a server or handle it however you like
    const formData = new FormData();
    formData.append("file", file);
    // For demo purposes, we'll use a URL object to preview the image
    const imageUrl = URL.createObjectURL(file);

    // Insert the image URL into the editor
    const range = this.quill.getSelection();
    this.quill.insertEmbed(range.index, "image", imageUrl);
  };

  // Custom video handler for uploading videos to Quill editor
  const handleVideoUpload = (file) => {
    const videoUrl = URL.createObjectURL(file);
    const range = this.quill.getSelection();
    this.quill.insertEmbed(range.index, "video", videoUrl);
  };

  const modules = {
    toolbar: [
      [{ "header": "1" }, { "header": "2" }, { "font": [] }],
      [{ "list": "ordered" }, { "list": "bullet" }],
      ["bold", "italic", "underline"],
      ["link"],
      ["blockquote"],
      [{ "align": [] }],
      [{ "color": [] }, { "background": [] }],
      ["image", "video"],
      ["clean"]
    ],
    handlers: {
      image: () => {
        // Open file input dialog
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) handleImageUpload(file);
        };
        input.click();
      },
      video: () => {
        // Open file input dialog for video
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "video/*";
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) handleVideoUpload(file);
        };
        input.click();
      }
    }
  };

  return (
    <div>
      <h1>Upload Image & Video with React-Quill</h1>
      <form>
        <div>
          <label>Title:</label>
          <input type="text" placeholder="Enter title" />
        </div>
        <div>
          <label>Content:</label>
          <ReactQuill
            value={editorValue}
            onChange={handleChange}
            theme="snow"
            modules={modules}
          />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
      <div>
        <h3>Editor Output</h3>
        <div>{editorValue}</div>
      </div>
    </div>
  );
};

export default PostForm;
                                                                     