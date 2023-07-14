import React from "react";
import { Spin } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Loading(props) {
  return (
    <div
      style={{
        height: 500,
        display: "flex",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {props.error &&
        toast.error(props.error, {
          position: "top-right",
          hideProgressBar: false,
          progress: undefined,
          toastId: "",
        })}
      <Spin />
    </div>
  );
}
