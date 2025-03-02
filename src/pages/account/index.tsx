import { useAuth } from "@/hooks/useAuth";
import { Button, Card, Divider, Flex, Input, message, Modal, QRCode, Switch, Table } from "antd";
import { useState, useEffect } from "react";
import * as OTPAuth from "otpauth";
import CryptoJS from "crypto-js";
import { db } from "@/config/firebase";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { UAParser } from "ua-parser-js";

export const MyAccount = () => {
  const { user } = useAuth();
  const [otpAuthUrl, setOtpAuthUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [devices, setDevices] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const deviceInfo = UAParser();

  const getDeviceInfo = () => {
    return {
      device: deviceInfo.device?.model || "Unknown device",
      os: deviceInfo.os?.name || "Unknown OS",
      browser: deviceInfo.browser?.name || "Unknown browser",
      ua: deviceInfo.ua || "Unknown user agent",
    };
  };

  useEffect(() => {
    const check2FAStatus = async () => {
      if (user?.uid) {
        const userRef = doc(db, "users", user?.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData?.secret) {
            setIs2FAEnabled(true);
            setDevices(userData?.devices || []);
          }
        }
      }
    };
    check2FAStatus();
  }, [user?.uid]);

  const handleEnable2FA = async (checked: boolean) => {
    if (checked) {
      const secretKey = new OTPAuth.Secret({ size: 20 });
      const secretBase32 = secretKey.base32;
      const encryptedSecret = CryptoJS.AES.encrypt(secretBase32, import.meta.env.VITE_HASH_KEY).toString();
      const userRef = doc(db, "users", user?.uid ?? "");
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        messageApi.error("2FA already enabled");
        return;
      } else {
        const deviceInfo = getDeviceInfo();

        await setDoc(userRef, {
          uid: user?.uid,
          secret: encryptedSecret,
          devices: [deviceInfo],
        });
      }

      const totp = new OTPAuth.TOTP({
        issuer: "2FA Authentication",
        label: user?.email ?? "",
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: secretBase32,
      });
      setOtpAuthUrl(totp.toString());
      setSecret(secretBase32);
      setVisible(true);
      setIs2FAEnabled(true);
    } else {
      setIs2FAEnabled(false);
      await deleteDoc(doc(db, "users", user?.uid ?? ""));
      messageApi.success("2FA disabled successfully");
    }
  };

  const handleVerifyOTP = async (otp: string) => {
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

    const isValid = totp.validate({ token: otp, window: 1 });
    if (isValid !== null) {
      messageApi.success("2FA enabled successfully");
      setVisible(false);
      setOtp("");
    } else {
      messageApi.error("Invalid OTP code");
    }
  };

  const columns = [
    {
      title: "Device",
      dataIndex: "device",
      key: "device",
    },
    {
      title: "OS",
      dataIndex: "os",
      key: "os",
    },
    {
      title: "Browser",
      dataIndex: "browser",
      key: "browser",
    },
    {
      title: "User Agent",
      dataIndex: "ua",
      key: "ua",
    },
  ];
  return (
    <div className="wrapper account">
      {contextHolder}
      <div className="content container">
        <Card
          title="My Account"
          classNames={{ header: "account-card-header", body: "account-card-body" }}
          className="account-card"
        >
          <Flex align="center" gap={20}>
            <h2>Email: </h2>
            <Input disabled value={user?.email ?? ""} />
          </Flex>
          <Divider />
          <Flex align="center" gap={20}>
            <h2>Enable 2FA: </h2>
            <Switch checked={is2FAEnabled} onChange={handleEnable2FA} />
          </Flex>
          {is2FAEnabled && (
            <>
              <Divider />
              <Table
                pagination={false}
                dataSource={
                  Array.isArray(devices)
                    ? devices
                        .filter((device) => typeof device === "object")
                        .map((device, index) => ({ key: index, ...(device as object) }))
                    : []
                }
                columns={columns}
              />
            </>
          )}
        </Card>

        <Modal title="Enable 2FA" footer={null} centered open={visible} onCancel={() => setVisible(false)}>
          {step === 1 && (
            <>
              <Flex gap={10} vertical>
                <p>Scan the QR code with your 2FA app</p>
                <QRCode value={otpAuthUrl} />
              </Flex>
              <Divider />
              <Flex gap={10} vertical>
                <p>Or enter the code below:</p>
                <Input value={secret} disabled />
              </Flex>
              <Divider />
              <Button onClick={() => setStep(2)} type="primary">
                Next
              </Button>
            </>
          )}
          {step === 2 && (
            <>
              <Flex gap={10} vertical>
                <p>Enter the code from your 2FA app:</p>
                <Input onChange={(e) => setOtp(e.target.value)} />
              </Flex>
              <Divider />
              <Flex gap={10}>
                <Button onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => handleVerifyOTP(otp)} type="primary">
                  Verify
                </Button>
              </Flex>
            </>
          )}
        </Modal>
      </div>
    </div>
  );
};
