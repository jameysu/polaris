import styled, { createGlobalStyle } from 'styled-components';
import { memo } from 'react';

// Add this global style to remove scrollbars from body/html
export const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    height: 100%;
    width: 100%;
  }
`;

const HomeStyled = styled.div`
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  text-align: center;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://forestry.denr.gov.ph/fmb_web/wp-content/uploads/2023/04/banner1.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  .ant-image {
    max-width: 180px;
    margin-bottom: 10px;
    animation: bounceIn 1.2s ease-out;
  }

  .ant-flex {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;

    .ant-typography {
      color: white;
      text-align: center;
    }

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
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #e0e0e0;
    }

    .denr-cenro-text {
      animation-delay: 0.5s;
      font-size: 26px;
      font-weight: 600;
      line-height: 1.4;
      color: #ffffff;
      max-width: 800px;
    }

    .other-text {
      animation-delay: 0.7s;
      font-size: 18px;
      color: #d5d5d5;
    }

    .continue-btn {
      width: 160px;
      height: 45px;
      font-size: 16px;
      margin-top: 12px;
      border-radius: 6px;
      background-color: #006400;
      border: none;
      transition: all 0.3s ease;
      animation: fadeInUp 0.8s ease forwards;
      animation-delay: 0.9s;

      &:hover {
        background-color: #228B22;
        transform: translateY(-2px);
      }

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

  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    .ant-image {
      max-width: 140px;
    }

    .denr-cenro-text {
      font-size: 20px;
    }

    .ph-text,
    .other-text {
      font-size: 16px;
    }

    .continue-btn {
      width: 140px;
      height: 40px;
      font-size: 14px;
    }
  }
`;

export default memo(HomeStyled);
