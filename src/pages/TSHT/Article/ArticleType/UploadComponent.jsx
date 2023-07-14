import React, { useState } from "react";
import { Upload, Button } from "antd";
import SelectMedia from "../../FileManager/FileManagerMedia/SelectMedia";
// import { Player } from "video-react";

const UploadComponent = (props) => {
  const initialstate = {
    videoSrc: "",
  };

  const [videoSrc, setVideoSrc] = useState("");

  const handleChange = ({ file }) => {
    var reader = new FileReader();
    var url = URL.createObjectURL(file.originFileObj);
    setVideoSrc(url);
  };

  return (
    <React.Fragment>
      <div className="action">
        {/*<Upload*/}
        {/*  className="mt-3 mb-3"*/}
        {/*  accept=".mp4"*/}
        {/*  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"*/}
        {/*  listType="picture"*/}
        {/*  maxCount={1}*/}
        {/*  onChange={handleChange}*/}
        {/*>*/}
        {/*  <Button>Upload Video</Button>*/}
        {/*</Upload>*/}
        <SelectMedia
          //onUploadMedia={(e) => setVideo(e)}
          className={"btn btn-success m-lg-2"}
          title={"Video"}
        ></SelectMedia>

        {/*<video width="100%" controls className="mt-3">*/}
        {/*  <source src={videoSrc.Src} type={videoSrc.type} />*/}
        {/*</video>*/}

        <iframe
          width="100%"
          src="https://www.youtube.com/embed/ukHK1GVyr0I"
          height="300"
          className="mt-3"
          title="Đen - Nấu ăn cho em ft. PiaLinh (M/V)"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </React.Fragment>
  );
};
export default UploadComponent;
