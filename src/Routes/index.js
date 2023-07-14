import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
//Layouts
import NonAuthLayout from "../Layouts/NonAuthLayout";
import VerticalLayout from "../Layouts/index";

//routes
import { authProtectedRoutes, publicRoutes } from "./allRoutes";
import { AuthProtected } from "./AuthProtected";
import { useScrollLock } from "../Components/Hooks/UseScrollLock";
import { useProfile } from "../Components/Hooks/UserHooks";
import {
  getAPIListFunctionByUser,
  isUserAuthenticated,
} from "../helpers/fakebackend_helper";
const Index = () => {
  const { lockScroll, unlockScroll } = useScrollLock();
  const { token } = useProfile();
  const [listRoleFunction, setListRoleFunction] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (isUserAuthenticated()) {
      getAPIListFunctionByUser().then((res) => {
        if (res.data && res.data.list && res.status > 0) {
          var filterRoute = [];
          authProtectedRoutes.filter((e) => {
            var target = {};
            if (e.path === "*" || e.path === "/") {
              target = e;
              filterRoute.push(target);
            }
            res.data.list.filter((g) => {
              if (g.child_functions.length > 0) {
                g.child_functions.filter((f) => {
                  if (f.url === e.path) {
                    target = e;
                    filterRoute.push(target);
                  }
                });
              } else {
                if (g.url === e.path) {
                  target = e;
                  filterRoute.push(target);
                }
              }
            });
          });
          setListRoleFunction(filterRoute);
        }
      });
    } else {
      var filterRoute = [];
      authProtectedRoutes.filter((e) => {
        var target = {};
        if (e.path === "*" || e.path === "/" || e.path === "/home") {
          target = e;
          filterRoute.push(target);
        }
      });
      setListRoleFunction(filterRoute);
    }
  }, [token]);
  useEffect(() => {
    unlockScroll();
  }, [navigate]);
  return (
    <React.Fragment>
      <Routes>
        <Route>
          {publicRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={<NonAuthLayout>{route.component}</NonAuthLayout>}
              key={idx}
              exact={true}
            />
          ))}
        </Route>

        <Route>
          {listRoleFunction.map((route, idx) => (
            <Route
              path={route.path}
              element={
                <AuthProtected>
                  <VerticalLayout>{route.component}</VerticalLayout>
                </AuthProtected>
              }
              key={idx}
              exact={true}
            />
          ))}
        </Route>
      </Routes>
    </React.Fragment>
  );
};

export default Index;
