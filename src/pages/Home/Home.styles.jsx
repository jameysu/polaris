import styled from 'styled-components';
import {memo} from "react";

const HomeStyled = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('https://forestry.denr.gov.ph/fmb_web/wp-content/uploads/2023/04/banner1.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.8;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  .ant-image {
    max-width: 250px;
    animation: bounceIn 1.2s ease-out;
  }

  .ant-flex {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    .ph-text,
    .denr-cenro-text,
    .other-text {
      opacity: 0;
      transform: translateY(20px);
      animation: fadeInUp 0.8s ease forwards;
    }

    .ph-text {
      animation-delay: 0.3s;
      font-size: 18px;
      text-decoration: underline;
    }

    .denr-cenro-text {
      animation-delay: 0.5s;
      font-size: 25px;
    }

    .other-text {
      animation-delay: 0.7s;
      font-size: 20px;
    }

    .continue-btn {
      width: 150px;
      height: 40px;
      padding: 0;
      margin-top: 10px;
      animation: fadeInUp 0.8s ease forwards;
      animation-delay: 0.9s;

      a {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  @keyframes bounceIn {
    0% {
      transform: scale(0.5);
      opacity: 0;
    }
    60% {
      transform: scale(1.05);
      opacity: 1;
    }
    80% {
      transform: scale(0.95);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;


export default memo(HomeStyled);