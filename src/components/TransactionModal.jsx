import React from "react";
import { Modal, Input, Form, InputNumber } from "antd";
import Typography from "antd/es/typography/Typography";

const TransactionModal = ({
  isModalVisible,
  setIsModalVisible,
  selectedCoin,
  transactionPrice,
  setTransactionPrice,
  transactionQuantity,
  setTransactionQuantity,
  transactionType,
  handleModalSubmit,
  coinsInPortfolio
}) => {
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = () => {
    handleModalSubmit();
  };
  const validateNumber = (_, value) => {
    if (typeof value === "number" && value >= 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Value must be a positive number"));
  };
  return (
    <Modal
      title="Add Transaction to My Portfolio"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      cancelButtonProps={{ style: { backgroundColor: '#f73939' } }}
      okButtonProps={{ style: { backgroundColor: '#58da69', color: '#fff' } }}
      reverseButton={false}
      forceRender={true}
    >
      <Typography>{transactionType === "BUY" ? "Buying " : " Selling "}<b>{selectedCoin}</b></Typography>
      <Form>
        <div className="portfolio-inputs">
          <p>
            {/* Coin: <b>{selectedCoin}</b> */}
          </p>
          <b>Quantity</b>{" "}
          <Form.Item
            name="transactionQuantity"
            rules={[{ required: true, message: 'Quantity is required' },
            { validator: validateNumber }]}
          >
            <InputNumber
              id="transaction-input"
              min={0}
              size="small"
              value={transactionQuantity}
              onChange={(value) => setTransactionQuantity(value)}
            />
          </Form.Item>
          {/* <p>
          </p> */}
          <p>
            <b>Price Per Coin</b>{" "}          </p>

          <Input
            id="transaction-input"
            value={transactionPrice}
            size="small"
            placeholder={coinsInPortfolio[selectedCoin]?.[1]}
            onChange={(e) => {
              console.log("transactionPrice changed:", e.target.value);
              if (!isNaN(e.target.value) || e.target.value === '') {
                setTransactionPrice(e.target.value);
              }
            }}

          />
        </div>
      </Form>
    </Modal >
  );
};

export default TransactionModal;
