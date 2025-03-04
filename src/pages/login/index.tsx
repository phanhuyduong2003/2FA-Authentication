import { paths } from "@/config";
import { db, firebaseAuth } from "@/config/firebase";
import { useAuth } from "@/hooks/useAuth";
import { LoginType } from "@/types/auth";
import { Button, Flex, Form, Input, message, Modal, Spin } from "antd";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { HiOutlineEye, HiOutlineEyeSlash, HiOutlineLockClosed, HiOutlineUserCircle } from "react-icons/hi2";
import { Link, useNavigate } from "react-router";
import * as OTPAuth from "otpauth";
import CryptoJS from "crypto-js";

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogin = async (values: LoginType) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, values.email, values.password);
      const userLogin = userCredential.user;
      if (userLogin?.uid) {
        const userRef = doc(db, "users", userLogin?.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData?.secret) {
            setVisible(true);
          } else {
            messageApi.success("Login successfully");
            setTimeout(() => {
              navigate(paths.home);
            }, 1000);
          }
        }
      }
      if (user) {
        setLoading(false);
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
  const handleVerifyOTP = async (otp: string) => {
    setLoading(true);
    if (user) {
      const userRef = doc(db, "users", user?.uid ?? "");
      const userDoc = await getDoc(userRef);
      const secretKey = userDoc.data()?.secret;

      if (!secretKey) {
        messageApi.error("Secret key not found");
        return;
      }

      const bytes = CryptoJS.AES.decrypt(secretKey, import.meta.env.VITE_HASH_KEY);
      const decryptedSecret = bytes.toString(CryptoJS.enc.Utf8);
      const totp = new OTPAuth.TOTP({
        issuer: "2FA Authentication",
        label: user?.email ?? "",
        secret: decryptedSecret,
      });

      const isValid = totp.validate({ token: otp, window: 1, timestamp: Date.now() });
      if (isValid !== null) {
        messageApi.success("2FA verified successfully");
        setVisible(false);
        setOtp("");
        setTimeout(() => {
          navigate(paths.home);
        }, 1000);
        setLoading(false);
      } else {
        messageApi.error("Invalid OTP code");
        setLoading(false);
      }
    }
  };

  return (
    <div className="wrapper login">
      {loading && <Spin size="large" className="loader" />}
      {contextHolder}
      <div className="login-wrapper">
        <div className="login-welcome">
          <h1>Welcome to the App</h1>
          <p>Log in to continue</p>
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
                Log in
              </Button>
              or <Link to={paths.register}>Register now!</Link>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Modal title="2FA Authentication" footer={null} centered open={visible} onCancel={() => setVisible(false)}>
        <Flex vertical gap={10}>
          <Flex vertical gap={10}>
            <p>Input OTP from Google Authenticator</p>
            <Input onChange={(e) => setOtp(e.target.value)} />
          </Flex>
          <Button type="primary" onClick={() => handleVerifyOTP(otp)}>
            Submit
          </Button>
        </Flex>
      </Modal>
    </div>
  );
};
