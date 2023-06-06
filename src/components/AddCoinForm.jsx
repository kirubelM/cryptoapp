import React, { useState, useEffect } from 'react';
import { useGetCryptosQuery } from '../services/cryptoApi';
import { Select, Card, Row, Col, Input } from 'antd';
import millify from 'millify'
import { Link } from 'react-router-dom'
const AddCoinForm = (addCoin) => {  // const [symbol, setSymbol] = useState('');
  // const [quantity, setQuantity] = useState(0);
  // const [purchasePrice, setPurchasePrice] = useState(0);
  // const [time, setTime] = useState('24h');
  const [selectedCoin, setSelectedCoin] = useState();

  // const { data: cryptosList, isFetching } = useGetCryptosQuery(10);


  const setOptions = (prop) => {
    setSelectedCoin(prop);
  }

  const { data } = useGetCryptosQuery(1000);


  return (
    <>
      <Select
        showSearch
        className='select-coin-to-add'
        placeholder='Select a Crypto'
        optionFilterProp='children'
        onChange={setOptions}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        onSearch={(value) => {
          const filteredOptions = data?.data?.coins.filter((coin) =>
            coin.name.toLowerCase().includes(value.toLowerCase())
          );
          setOptions(filteredOptions);
        }}
      >
        <Select.Option value='Cryptocurrency'>Cryptocurrency</Select.Option>
        {data?.data?.coins.map((coin) => (
          <Select.Option key={coin.id} value={coin.name}>
            {coin.name}
          </Select.Option>
        ))}
      </Select>

    </>
  );
}

export default AddCoinForm

