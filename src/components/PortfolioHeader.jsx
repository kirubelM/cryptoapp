import { Statistic } from "antd";

const PortfolioHeader = ({ portfolioBalance }) => {
  return (
    <Statistic
      title="Portfolio Balance in USD"
      value={portfolioBalance < 0.05 ? 0 : portfolioBalance}
      precision={2}
      valueStyle={{ color: "#3f8600" }}
      prefix="$"
    />
  );
};

export default PortfolioHeader;
