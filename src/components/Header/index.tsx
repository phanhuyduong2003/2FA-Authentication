import { paths } from "@/config";
import { firebaseAuth } from "@/config/firebase";
import { Button, Flex, message, Modal, Spin } from "antd";
import { Header } from "antd/es/layout/layout";
import { signOut } from "firebase/auth";
import { useState } from "react";
import { HiOutlineShieldCheck } from "react-icons/hi2";
import { Link, useNavigate } from "react-router";

export const HeaderComponent = () => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(firebaseAuth);
      messageApi.success("Logout successful");
      setLoading(false);
      setTimeout(() => {
        navigate(paths.login);
      }, 1000);
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        messageApi.error(error.message);
      }
    }
  };
  return (
    <>
      <Header className="header">
        {loading && <Spin size="large" className="loader" />}
        {contextHolder}
        <Flex justify="space-between" align="center" className="container">
          <Link to={paths.home}>
            <Flex gap={10} align="center">
              <HiOutlineShieldCheck size={50} />
              <h1>2FA Authentication</h1>
            </Flex>
          </Link>
          <Flex gap={10}>
            <Link to={paths.account}>
              <Button size="large">My account</Button>
            </Link>
            <Button type="primary" danger size="large" onClick={() => setVisible(true)}>
              Logout
            </Button>
          </Flex>
        </Flex>
      </Header>
      <Modal
        title="Logout"
        footer={null}
        centered
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={handleLogout}
        classNames={{ wrapper: "logout-modal", header: "logout-modal-header", body: "logout-modal-body" }}
      >
        <p className="logout-modal-body-text">Are you sure you want to logout?</p>
        <Flex justify="center" gap={15}>
          <Button size="large" onClick={() => setVisible(false)}>
            Cancel
          </Button>
          <Button type="primary" size="large" danger onClick={handleLogout}>
            Logout
          </Button>
        </Flex>
      </Modal>
    </>
  );
};
