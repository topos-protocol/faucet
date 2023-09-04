import { Layout, Space } from "antd";

import logo from "/logo.svg";

const { Header: AntdHeader } = Layout;

const Header = () => {
  return (
    <AntdHeader>
      <Space>
        <Space align="start">
          <img src={logo} width={40} alt="logo" />
          <h3
            style={{
              color: "#fff",
              fontWeight: "bold",
              marginBottom: 0,
              marginRight: "2rem",
            }}
          >
            Topos Faucet
          </h3>
        </Space>
      </Space>
    </AntdHeader>
  );
};

export default Header;
