import styled from 'styled-components';
import {memo} from "react";

const HomeStyled = styled.div`
  width: 100%;
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  
  .ant-image {
    max-width: 250px;
  }
  
  .ant-flex {
    
    .ph-text {
      font-size: 18px;
      text-decoration: underline;
    }
    
    .denr-cenro-text {
      font-size: 25px;
    }
    
    .other-text{
      font-size: 20px;
    }
    
    .continue-btn {
      width: 150px;
      height: 40px;
      padding: 0;
      
      a {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
`

export default memo(HomeStyled);