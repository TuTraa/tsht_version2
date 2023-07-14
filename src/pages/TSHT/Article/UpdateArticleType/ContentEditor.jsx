import { Label } from "reactstrap";
import { Editor } from "@tinymce/tinymce-react";
import React, { useRef } from "react";

const ContentEditor = ({ value, editorRef, title }) => {
  const initContent = `<p>Toà Soạn Hội Tụ.</p>`;
  return (
    <div className="mb-3">
      <Label htmlFor="article_content" className="form-label">
        {title}
      </Label>
      <Editor
        apiKey="g4pmwp4e5kcjz0cum1z0vz2h0tl5vnjwc5ou58yj82sp4kbf"
        tinymceScriptSrc={process.env.PUBLIC_URL + "/tinymce/tinymce.min.js"}
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={value}
        selector={"textarea"}
        init={{
          height: 500,
          selector: "textarea",
          menubar: ["tools", "view"],
          // language: "vi",
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "preview",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help" +
            "code" +
            "fullscreen",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
    </div>
  );
};
export default ContentEditor;
