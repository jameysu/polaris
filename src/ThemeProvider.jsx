import { ConfigProvider } from 'antd';
import '@fontsource/poppins'; // You can install this via npm: npm install @fontsource/poppins

const ThemeProvider = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Poppins, sans-serif',
        },
        components: {
          Button: {
            colorPrimary: '#0D300D',
            algorithm: true,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default ThemeProvider;
