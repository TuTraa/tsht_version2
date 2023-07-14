import React, { useEffect, useState } from "react";
import { CardHeader, Input, Label } from "reactstrap";

const ButtonLiveChannel = ({
  title,
  value,
  name,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="form-check form-switch form-switch-md mt-2" dir="ltr">
      <Input
        type="switch"
        className="form-check-input"
        checked={value == 1 ? true : false}
        onChange={onChange}
        name={name}
        disabled={disabled}
      />
      <Label className="form-check-label">{title}</Label>
    </div>
  );
};

export default ButtonLiveChannel;
