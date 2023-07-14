import { toast, ToastContainer } from "react-toastify";
import React from "react";

const ToastCustom = (context, type) => {
  if (type === "success") {
    setTimeout(() => {
      toast.success(context, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }, 1);
  } else if (type === "fail") {
    toast.error(context, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
};
export default ToastCustom;
