import React, { useEffect } from "react";
import withRouter from "../Components/Common/withRouter";

//redux
import { useSelector } from "react-redux";
import CustomToastContainer from "../Components/Common/ToastContainer";

const NonAuthLayout = ({ children }) => {
  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));

  useEffect(() => {
    if (layoutModeType === "dark") {
      document.body.setAttribute("data-layout-mode", "dark");
    } else {
      document.body.setAttribute("data-layout-mode", "light");
    }
    return () => {
      document.body.removeAttribute("data-layout-mode");
    };
  }, [layoutModeType]);
  return (
    <div>
      <CustomToastContainer />
      {children}
    </div>
  );
};

export default withRouter(NonAuthLayout);
