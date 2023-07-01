import { Select, Typography } from "antd";

const SearchBar = ({ coinsList, handleSelectCoin }) => {
  const handleCoinSelection = (value) => {
    handleSelectCoin(value);
  };
  return (
    <>
      <Typography>Search to add coin to portfolio</Typography>
      <Select
        showSearch
        size="10"
        style={{ width: 150 }}
        className="select-coin-to-add"
        placeholder="Select a Crypto"
        optionFilterProp="children"
        onSelect={handleCoinSelection}
      >
        {coinsList.map((coin) => (
          <Select.Option key={coin.id} value={coin.id}>
            {coin.name}
          </Select.Option>
        ))}
      </Select>
    </>
  );
};

export default SearchBar;
