import { ConfigProvider, theme } from 'antd';

const ThemeProvider = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
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
