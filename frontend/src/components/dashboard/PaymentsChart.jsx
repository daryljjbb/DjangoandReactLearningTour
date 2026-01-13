import { Bar } from "react-chartjs-2";

export default function PaymentsChart({ data }) {
  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: "Payments Collected",
        data: data.map(item => item.total),
        backgroundColor: "green",
      },
    ],
  };

  return (
    <div style={{ width: "50%" }}>
      <h3>Payments</h3>
      <Bar data={chartData} />
    </div>
  );
}
