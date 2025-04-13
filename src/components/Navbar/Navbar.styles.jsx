import styled from 'styled-components';
import {memo} from "react";

const NavbarStyled = styled.div`
  width: 100%;
  background: green;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .ant-flex {
    padding: 5px 30px 5px 30px;
    width: 100%;
    
    .ant-image {
      width: 45px;
    }
  }
`

export default memo(NavbarStyled);