import { Line } from "react-chartjs-2";

export default function RevenueChart({ data }) {
  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: "Monthly Revenue",
        data: data.map(item => item.total),
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
      },
    ],
  };

  return (
    <div style={{ width: "50%" }}>
      <h3>Revenue</h3>
      <Line data={chartData} />
    </div>
  );
}
