import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

//import images
import avatar1 from "../../assets/images/users/avatar-1.jpg";
import { getAPIAccountInfo } from "../../helpers/fakebackend_helper";
import { Link } from "react-router-dom";

const ProfileDropdown = () => {
  const { user } = useSelector((state) => ({
    user: state.Profile.user,
  }));

  const [userName, setUserName] = useState("");
  const [userID, setUserID] = useState(0);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      setUserName(
        process.env.REACT_APP_DEFAULTAUTH === "fake"
          ? obj.username === undefined
            ? user.first_name
              ? user.first_name
              : obj.data.first_name
            : "Admin" || "Admin"
          : process.env.REACT_APP_DEFAULTAUTH === "firebase"
          ? obj.providerData[0].email
          : "Admin"
      );
    }
    getAPIAccountInfo().then((res) => {
      if (res.status > 0) {
        if (res.data) {
          setUserName(res.data.full_name);
          setUserID(res.data.user_id);
          var group_list = JSON.parse(res.data.group_list);
          if (Array.isArray(group_list)) {
            if (group_list.length > 0) {
              setGroupName(group_list[0].group_name);
            }
          }
        }
      }
    });
  }, []);

  //Dropdown Toggle
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };
  return (
    <React.Fragment>
      <Dropdown
        isOpen={isProfileDropdown}
        toggle={toggleProfileDropdown}
        className="ms-sm-3 header-item topbar-user"
      >
        <DropdownToggle tag="button" type="button" className="btn">
          <span className="d-flex align-items-center">
            <img
              className="rounded-circle header-profile-user"
              src={avatar1}
              alt="Header Avatar"
            />
            <span className="text-start ms-xl-2">
              <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                {userName}
              </span>
              <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                {groupName}
              </span>
            </span>
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <h6 className="dropdown-header">Xin chào {userName}!</h6>
          <Link to={`/update-account/${userID}`}>
            <DropdownItem>
              <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
              <span className="align-middle">Thông tin</span>
            </DropdownItem>
          </Link>
          <DropdownItem href={process.env.PUBLIC_URL + "/logout"}>
            <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>{" "}
            <span className="align-middle" data-key="t-logout">
              Đăng xuất
            </span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileDropdown;
