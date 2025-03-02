import { paths } from "@/config";
import { firebaseAuth } from "@/config/firebase";
import { LoginType } from "@/types/auth";
import { Button, Form, Input, message, Spin } from "antd";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { HiOutlineEye, HiOutlineEyeSlash, HiOutlineLockClosed, HiOutlineUserCircle } from "react-icons/hi2";
import { Link, useNavigate } from "react-router";

export const Register = () => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const handleLogin = async (values: LoginType) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, values.email, values.password);
      const user = userCredential.user;
      if (user) {
        messageApi.success("Register successful");
        setLoading(false);
        setTimeout(() => {
          navigate(paths.login);
        }, 1000);
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        messageApi.error(error.message);
      } else {
        messageApi.error("Login failed");
      }
      setLoading(false);
    }
  };
  return (
    <div className="wrapper login">
      {loading && <Spin size="large" className="loader" />}
      {contextHolder}
      <div className="login-wrapper">
        <div className="login-welcome">
          <h1>Welcome to the App</h1>
          <p>Register to continue</p>
        </div>
        <div className="login-form">
          <Form name="login" initialValues={{ remember: true }} onFinish={handleLogin} layout="vertical">
            <Form.Item name="email" label="Email" rules={[{ required: true, message: "Please input your Email!" }]}>
              <Input size="large" prefix={<HiOutlineUserCircle size={30} />} placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please input your Password!" }]}
            >
              <Input.Password
                size="large"
                prefix={<HiOutlineLockClosed size={30} />}
                iconRender={(visible) => (visible ? <HiOutlineEyeSlash /> : <HiOutlineEye />)}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Button size="large" block type="primary" htmlType="submit">
                Register
              </Button>
              or <Link to={paths.login}>Login now!</Link>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};
