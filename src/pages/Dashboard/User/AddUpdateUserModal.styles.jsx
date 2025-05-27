import styled from 'styled-components';
import {memo} from "react";
import {Modal} from "antd";

const AddUpdateUserModalStyled = styled(Modal)`
  .ant-form-item {
    margin-bottom: 10px;
  }
`;


export default memo(AddUpdateUserModalStyled);