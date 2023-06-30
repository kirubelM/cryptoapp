import { Statistic } from "antd";

const PortfolioHeader = ({ portfolioBalance }) => {
  return (
    <Statistic
      title="Portfolio Balance in USD"
      value={portfolioBalance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 20 })}
      precision={2}
      valueStyle={{ color: "#3f8600" }}
      prefix="$"
    />
  );
};

export default PortfolioHeader;
