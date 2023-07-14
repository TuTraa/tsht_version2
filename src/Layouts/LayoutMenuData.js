import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAPIListFunctionByUser,
  isUserAuthenticated,
} from "../helpers/fakebackend_helper";

const Navdata = () => {
  const history = useNavigate();

  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  //TSHT
  const [isHome, setIsHome] = useState(false);
  const [isArticle, setIsArticle] = useState(false);
  const [isCategory, setIsCategory] = useState(false);
  const [isTag, setIsTag] = useState(false);
  const [isLiveChannel, setIsLiveChannel] = useState(false);
  const [isEvents, setIsEvents] = useState(false);
  const [isComment, setIsComment] = useState(false);
  const [isGroupFunction, setIsGroupFunction] = useState(false);
  const [isArticlePrice, setIsArticlePrice] = useState(false);
  const [isHotArticle, setIsHotArticle] = useState(false);
  const [isRole, setIsRole] = useState(false);
  const [isDepartment, setIsDepartment] = useState(false);
  const [isAccount, setIsAccount] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  const [isInteraction, setIsInteraction] = useState(false);
  const [isSetting, setIsSetting] = useState(false);
  const [isAdvertisement, setIsAdvertisement] = useState(false);

  function openCollapse(e) {
    var target = e.target.id;
    var items = document.getElementById(`sidebarApps_${target}`);
    items.classList.toggle("show");
  }
  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
    if (iscurrentState !== "Article") {
      setIsArticle(false);
    }
    if (iscurrentState !== "Category") {
      setIsCategory(false);
    }
    if (iscurrentState !== "Tag") {
      setIsTag(false);
    }
    if (iscurrentState !== "LiveChannel") {
      setIsLiveChannel(false);
    }
    if (iscurrentState !== "GroupFunction") {
      setIsGroupFunction(false);
    }
    if (iscurrentState !== "HotArticle") {
      setIsHotArticle(false);
    }
    if (iscurrentState !== "Role") {
      setIsRole(false);
    }
    if (iscurrentState !== "Department") {
      setIsDepartment(false);
    }
    if (iscurrentState !== "Account") {
      setIsAccount(false);
    }
  }, [
    history,
    iscurrentState,
    isArticle,
    isCategory,
    isTag,
    isGroupFunction,
    isHotArticle,
    isRole,
    isDepartment,
    isAccount,
  ]);

  var menuItems = [
    {
      id: "dashboard-home",
      label: "Tổng quan",
      icon: "ri-dashboard-2-line",
      link: "/home",
    },
    {
      id: "article",
      label: "Quản lý bài viết",
      icon: "mdi mdi-file-document-edit-outline",
      link: "/article",
      stateVariables: isArticle,
      click: function (e) {
        e.preventDefault();
        setIsArticle(!isArticle);
        setIscurrentState("Article");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "add-article",
          label: "Thêm bài viết",
          link: "/add-article",
          parentId: "article",
        },
        {
          id: "list-article",
          label: "Danh sách bài viết",
          link: "/list-article",
          parentId: "article",
        },
        {
          id: "draft-article",
          label: "Danh sách bài nháp",
          link: "/draft-article",
          parentId: "article",
        },
      ],
    },
    {
      id: "category",
      label: "Quản lý chuyên mục",
      icon: "ri-dashboard-line",
      link: "/category",
      stateVariables: isCategory,
      click: function (e) {
        e.preventDefault();
        setIsCategory(!isCategory);
        setIscurrentState("Category");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "add-category",
          label: "Thêm chuyên mục",
          link: "/add-category",
          parentId: "category",
        },
        {
          id: "list-category",
          label: "Danh sách chuyên mục",
          link: "/list-category",
          parentId: "category",
        },
      ],
    },
    {
      id: "tag",
      label: "Quản lý tag",
      icon: "bx bx-purchase-tag",
      link: "/tag",
      stateVariables: isTag,
      click: function (e) {
        e.preventDefault();
        setIsTag(!isTag);
        setIscurrentState("Tag");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "add-tag",
          label: "Thêm tag",
          link: "/add-tag",
          parentId: "tag",
        },
        {
          id: "list-tag",
          label: "Danh sách tag",
          link: "/list-tag",
          parentId: "tag",
        },
      ],
    },
    {
      id: "live-channel",
      label: "Quản lý Kênh",
      icon: "mdi mdi-television-box",
      link: "/live-channel",
      stateVariables: isLiveChannel,
      click: function (e) {
        e.preventDefault();
        setIsLiveChannel(!isLiveChannel);
        setIscurrentState("LiveChannel");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "add-live-channel",
          label: "Thêm kênh",
          link: "/add-live-channel",
          parentId: "live-channel",
        },
        {
          id: "list-live-channel",
          label: "Danh sách kênh",
          link: "/list-live-channel",
          parentId: "live-channel",
        },
      ],
    },
    {
      id: "events",
      label: "Quản lý Sự kiện",
      icon: "mdi mdi-calendar-star",
      link: "/events",
      stateVariables: isEvents,
      click: function (e) {
        e.preventDefault();
        setIsEvents(!isEvents);
        setIscurrentState("Events");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "add-events",
          label: "Thêm Sự kiện",
          link: "/add-events",
          parentId: "events",
        },
        {
          id: "list-events",
          label: "Danh sách Sự kiện",
          link: "/list-events",
          parentId: "live-events",
        },
      ],
    },
    {
      id: "comment",
      label: "Quản lý bình luận",
      icon: "mdi mdi-message-reply-outline",
      link: "/comment",
    },
    {
      id: "advertisement",
      label: "Quảng cáo",
      icon: "mdi mdi-google-ads",
      link: "/advertisement",
      stateVariables: isAdvertisement,
      click: function (e) {
        e.preventDefault();
        setIsAdvertisement(!isAdvertisement);
        setIscurrentState("advertisement");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "add-advertisement",
          label: "Thêm Quảng Cáo",
          link: "/add-advertisement",
          parentId: "advertisement",
        },
        {
          id: "list-advertisement",
          label: "Danh sách Quảng Cáo",
          link: "/list-advertisement",
          parentId: "advertisement",
        },
      ],
    },
    {
      id: "role",
      label: "Quản lý quy trình",
      icon: "mdi mdi-nfc-tap",
      link: "/role",
      stateVariables: isRole,
      click: function (e) {
        e.preventDefault();
        setIsRole(!isRole);
        setIscurrentState("Role");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "add-role",
          label: "Thêm quy trình",
          link: "/add-role",
          parentId: "role",
        },
        {
          id: "list-role",
          label: "Danh sách quy trình",
          link: "/list-role",
          parentId: "role",
        },
      ],
    },
    {
      id: "article-price",
      label: "Nhuận bút",
      icon: "mdi mdi-piggy-bank-outline",
      link: "/article-price",
    },
    {
      id: "hot-article",
      label: "Thiết lập tin nổi bật",
      icon: "mdi mdi-newspaper-variant-outline",
      link: "/hot-article",
      stateVariables: isHotArticle,
      click: function (e) {
        e.preventDefault();
        setIsHotArticle(!isHotArticle);
        setIscurrentState("HotArticle");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "oustanding",
          label: "Tin nổi bật",
          link: "/oustanding",
          parentId: "hot-article",
        },
        {
          id: "is-selected",
          label: "Tin tiêu điểm",
          link: "/is-selected",
          parentId: "hot-article",
        },
      ],
    },
    {
      id: "group-function",
      label: "Quản lý nhóm quyền",
      icon: "mdi mdi-account-group-outline",
      link: "/group-function",
      stateVariables: isGroupFunction,
      click: function (e) {
        e.preventDefault();
        setIsGroupFunction(!isGroupFunction);
        setIscurrentState("GroupFunction");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "add-group-function",
          label: "Thêm nhóm quyền",
          link: "/add-group-function",
          parentId: "group-function",
        },
        {
          id: "list-group-function",
          label: "Danh sách nhóm quyền",
          link: "/list-group-function",
          parentId: "group-function",
        },
      ],
    },
    {
      id: "function",
      label: "Quản lý chức năng",
      icon: "mdi mdi-cog-outline fs-22",
      link: "/function",
      stateVariables: isSetting,
      click: function (e) {
        e.preventDefault();
        setIsSetting(!isSetting);
        setIscurrentState("Setting");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "add-function",
          label: "Thêm chức năng",
          link: "/add-function",
          parentId: "function",
        },
        {
          id: "list-function",
          label: "Danh sách chức năng",
          link: "/list-function",
          parentId: "function",
        },
      ],
    },
    {
      id: "department",
      label: "Quản lý phòng ban",
      icon: "ri-bubble-chart-fill",
      link: "/department",
      stateVariables: isDepartment,
      click: function (e) {
        e.preventDefault();
        setIsDepartment(!isDepartment);
        setIscurrentState("Department");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "add-department",
          label: "Thêm phòng ban",
          link: "/add-department",
          parentId: "department",
        },
        {
          id: "list-department",
          label: "Danh sách phòng ban",
          link: "/list-department",
          parentId: "department",
        },
      ],
    },
    {
      id: "account",
      label: "Quản lý tài khoản",
      icon: "mdi mdi-account-circle-outline",
      link: "/account",
      stateVariables: isAccount,
      click: function (e) {
        e.preventDefault();
        setIsAccount(!isAccount);
        setIscurrentState("Account");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "add-account",
          label: "Thêm tài khoản",
          link: "/add-account",
          parentId: "account",
        },
        {
          id: "list-account",
          label: "Danh sách tài khoản",
          link: "/list-account",
          parentId: "account",
        },
      ],
    },
    // {
    //   id: "interaction",
    //   label: "Quản lý tương tác",
    //   icon: "mdi mdi-account-switch-outline",
    //   link: "/interaction",
    // },
    // {
    //   id: "report",
    //   label: "Thống kê báo cáo",
    //   icon: "mdi mdi-chart-areaspline",
    //   link: "/report",
    // },
    {
      id: "file-manager",
      label: "Thư viện",
      icon: "ri-gallery-line",
      link: "/file-manager",
    },

    {
      id: "menu",
      label: "Quản lý giao diện",
      icon: "bx bx-list-ol",
      link: "/menu",
      stateVariables: isMenu,
      click: function (e) {
        e.preventDefault();
        setIsMenu(!isMenu);
        setIscurrentState("Menu");
        updateIconSidebar(e);
        openCollapse(e);
      },
      subItems: [
        {
          id: "menu",
          label: "Menu",
          link: "/menu",
          parentId: "menu",
        },
        {
          id: "header",
          label: "Header",
          link: "/header",
          parentId: "menu",
        },
        {
          id: "footer",
          label: "Footer",
          link: "/footer",
          parentId: "menu",
        },
      ],
    },
  ];
  const [listRoleFunction, setListRoleFunction] = useState([]);
  function getDifference(array1, array2) {
    return array1.filter((object1) => {
      return array2.some((object2) => {
        return object1.link === object2.url;
      });
    });
  }
  useEffect(() => {
    if (isUserAuthenticated()) {
      // setListRoleFunction(menuItems);
      getAPIListFunctionByUser().then((res) => {
        if (res.data && res.data.list && res.status > 0) {
          var filterRoute = [];
          var target = {};
          res.data.list.filter((g) => {
            if (g.child_functions.length > 0) {
              menuItems.filter((e) => {
                if (g.url === e.link) {
                  target = e;
                  filterRoute.push(target);
                }
              });
              const find = filterRoute.filter((l) => l.link === g.url);
              const li = getDifference(find[0].subItems, g.child_functions);
              filterRoute.forEach((l) => {
                if (l.link === g.url) {
                  l.subItems = li;
                }
              });
            } else {
              menuItems.filter((e) => {
                if (g.url === e.link) {
                  target = e;
                  filterRoute.push(target);
                }
              });
            }
          });
          setListRoleFunction(filterRoute);
        }
      });
    }
  }, []);
  return <React.Fragment>{listRoleFunction}</React.Fragment>;
};
export default Navdata;
