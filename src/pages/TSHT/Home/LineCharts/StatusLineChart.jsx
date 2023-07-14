import React, { useEffect, useState } from "react";
import { getAPIListStatusLineChart } from "../../../../helpers/fakebackend_helper";
import { toast } from "react-toastify";
import Loading from "../../../../Components/Common/Loading";
import CountUp from "react-countup";
import { Statistic } from "antd";

const StatusLineChart = (props) => {
  const { status, title } = props;
  const [statusListTotal, setStatusListTotal] = useState();
  const [statusList, setStatusList] = useState({
    top: 10,
    article_status_id: status,
    time_type: "year",
  });
  const formatter = (value) => <CountUp end={value} separator="," />;

  useEffect(() => {
    getAPIListStatusLineChart(
      statusList.top,
      statusList.article_status_id,
      statusList.time_type
    ).then((res) => {
      if (res.data && res.data.list && res.status >= 0) {
        setStatusList(res.data.list);
        setStatusListTotal(res.data);
      } else {
        toast.error("Không tìm thấy dữ liệu!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    });
  }, []);

  return (
    <div class="col-md-6 col-xl-4">
      {statusList && statusList.length ? (
        <div
          class="card-animate card"
          style={{ minHeight: 300, backgroundColor: "#F5F5F5" }}
        >
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="flex-grow-1 overflow-hidden">
                <p class="text-uppercase fw-medium text-muted text-truncate mb-0">
                  {title}
                </p>
              </div>
              {/*<div class="flex-shrink-0">*/}
              {/*  <h5 class="fs-14 mb-0 text-success">*/}
              {/*    <i class="fs-13 align-middle ri-arrow-right-up-line"></i>*/}
              {/*    /!*06/2023*!/*/}
              {/*  </h5>*/}
              {/*</div>*/}
            </div>
            <div class="d-flex align-items-end justify-content-between mt-4">
              <div>
                <h4 class="fs-22 fw-semibold ff-secondary mb-4">
                  <span class="counter-value" data-target="559.25">
                    <Statistic
                      title="Bài viết"
                      value={statusListTotal.total}
                      precision={1}
                      formatter={formatter}
                    />
                  </span>
                </h4>
                <div class="flex-shrink-0 mt-3">
                  {(statusList || []).map((e, i) => {
                    return (
                      <h5 key={i}>
                        {e.category_name} : {e.tong}
                      </h5>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          class="card-animate card"
          style={{ minHeight: 300, backgroundColor: "#F5F5F5" }}
        >
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="flex-grow-1 overflow-hidden">
                <p class="text-uppercase fw-medium text-muted text-truncate mb-0">
                  {title}
                </p>
              </div>
            </div>
            <div class="d-flex align-items-end justify-content-between mt-4">
              <div>
                <h4 class="fs-22 fw-semibold ff-secondary mb-4">
                  <span class="counter-value" data-target="559.25">
                    <Statistic
                      title="Bài viết"
                      value={0}
                      precision={1}
                      formatter={formatter}
                    />
                  </span>
                </h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusLineChart;
