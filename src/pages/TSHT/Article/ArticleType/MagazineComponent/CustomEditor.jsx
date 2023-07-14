const ArticleCustomEditor = (
  textColor,
  backgroundColor,
  text,
  textAlign,
  img,
  caption,
  justify,
  type
) => {
  const textEditor = (text, textAlign) => {
    return `<p style="align-self: ${textAlign};"><span style="color: ${textColor};">${text}</span></p>`;
  };

  const space = () => {
    return `<p>&nbsp;</p>`;
  };

  const imageEditor = (img, caption) => {
    return img && img !== ""
      ? `<figure id="add_image_link"><img src=${img} width="500">
    <figcaption><span style="color: ${textColor};">${caption}</span></figcaption>
    </figure>`
      : "";
  };
  const styleBlock = (content, justify) => {
    return `<div style="display:flex;flex-direction:row;justify-content:${justify}">${content}</div>`;
  };
  return `<div style="background-color:${backgroundColor}">${styleBlock(
    type
      ? textEditor(text, textAlign) + imageEditor(img, caption)
      : imageEditor(img, caption) + textEditor(text, textAlign),
    justify
  )}</div>`;
};

export default ArticleCustomEditor;
