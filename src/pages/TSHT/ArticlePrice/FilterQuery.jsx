import { useEffect, useState } from "react";
import { DatePicker, Select } from "antd";
import moment from "moment";

const FilterQuery = (props) => {
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
            case "author":
              setList(
                temp.map((e) => {
                  return {
                    value: e.author_name,
                    id: e.user_id,
                  };
                })
              );
              break;
            case "type":
              setList(
                temp.map((e) => {
                  return {
                    value: e.article_type_name,
                    id: e.article_type_id,
                  };
                })
              );
              break;
            case "category":
              setList(
                temp.map((e) => {
                  return {
                    value: e.category_name,
                    id: e.category_id,
                  };
                })
              );
              break;
          }
        }
      });
    }
    switch (value) {
      case "author":
        setPlaceholder("Tác giả");
        break;
      case "category":
        setPlaceholder("Chuyên mục");
        break;
      case "type":
        setPlaceholder("Loại bài viết");
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

export default FilterQuery;
