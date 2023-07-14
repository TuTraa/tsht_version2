import React from "react";
import { Col, Input, Label } from "reactstrap";
import { importEPGList } from "../../../helpers/fakebackend_helper";
import ToastCustom from "../../../Components/Common/Toast";
import { toast } from "react-toastify";

export const ExcelEpg = ({ id, reload, setReLoad }) => {
  const onHandleImport = (e) => {
    const file = e.target.files[0] || null;
    var bodyFormData = new FormData();
    bodyFormData.append("live_channel_id", id);
    bodyFormData.append("file", file);

    if (
      file &&
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      importEPGList(bodyFormData).then((res) => {
        if (res && res.status > 0) {
          ToastCustom("Cập nhật kênh thành công", "success");
          setReLoad(!reload);
        } else {
          toast.error("Không tìm thấy dữ liệu!", {
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
      });
    }
  };
  return (
    <Col lg={8}>
      <div>
        <Label className="form-label">Nhập Excel</Label>
        <Input className="form-control" type="file" onChange={onHandleImport} />
      </div>
    </Col>
  );
};
export default ExcelEpg;
