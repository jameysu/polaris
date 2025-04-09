import styled from 'styled-components';
import {memo} from "react";

const SigninStyled = styled.div`
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .ant-form {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: #141F24;
    border-radius: 6px;
    padding: 50px;
    
    .ant-image {
      max-width: 250px;
      margin-bottom: 20px;
    }

    .ant-form-item {
      width: 100%;
      //margin: 0;
    }
    
    .ant-btn {
      width: 250px;
      margin-bottom: 20px;
    }

    .ant-divider {
      width: 250px;
      min-width: 250px;
      margin-top: 0;
    }
  }
`

export default memo(SigninStyled);