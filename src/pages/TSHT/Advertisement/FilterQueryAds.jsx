import { useEffect, useState } from "react";
import { DatePicker, Select } from "antd";
import moment from "moment";

const FilterQueryAds = (props) => {
  const Option = Select.Option;
  const { type, apiFunction, value, setQuery } = props;
  const [placeholder, setPlaceholder] = useState("");
  const [list, setList] = useState([]);
  useEffect(() => {
    if (type === "text" && apiFunction) {
      apiFunction().then((res) => {
        if (res.data && res.status > 0) {
          const temp = res.data.list ? res.data.list : res.data;
          switch (value) {
            case "customer_info":
              setList(
                temp.map((e) => {
                  return {
                    value: e.customer_info,
                    id: e.ad_id,
                  };
                })
              );
              break;
            case "ad_type":
              setList(
                temp.map((e) => {
                  return {
                    value: e.ad_type,
                    id: e.ad_id,
                  };
                })
              );
              break;
            case "status_display":
              setList(
                temp.map((e) => {
                  return {
                    value: e.status_display,
                    id: e.ad_id,
                  };
                })
              );
              break;
          }
        }
      });
    }
    switch (value) {
      case "customer_info":
        setPlaceholder("Tên đối tác");
        break;
      case "status_display":
        setPlaceholder("Trạng thái");
        break;
      case "ad_type":
        setPlaceholder("Loại quảng cáo");
        break;
      case "fromDate":
        setPlaceholder("Từ ngày");
        break;
      case "toDate":
        setPlaceholder("Đến ngày");
        break;
    }
  }, []);
  const onPickDate = (date, dateString) => {
    setQuery(date ? moment(date).format("YYYY-MM-DD hh:mm:ss") : null);
  };

  const handleChange = (value) => {
    setQuery(value ? value : null);
  };
  return (
    <>
      {type === "text" && (
        <>
          <Select
            style={{ width: 200, height: 38 }}
            allowClear
            placeholder={placeholder}
            onChange={handleChange}
          >
            {list.map((e, i) => {
              return (
                <Option key={i} value={e.id}>
                  {e.value}
                </Option>
              );
            })}
          </Select>
        </>
      )}
      {type === "date" && (
        <>
          <DatePicker
            onChange={onPickDate}
            placeholder={placeholder}
          ></DatePicker>
        </>
      )}
    </>
  );
};

export default FilterQueryAds;
