import { useUser } from "@clerk/clerk-react";
import { FinancialRecordForm } from "./financial-record-form";
import { FinancialRecordList } from "./financial-record-list";
import "./financial-record.css";
import { useFinancialRecords } from "../../contexts/financial-record-context";
import { useMemo, useState } from "react";
import ChartModal from "./financial-charts";

export const Dashboard = () => {
  const { user } = useUser();
  const { records } = useFinancialRecords();
  const [activeModal, setActiveModal] = useState<
    "income-expenses" | "category-pie" | "category-bar" | null
  >(null);

  const totalMonthly = useMemo(() => {
    let totalAmount = 0;
    records.forEach((record) => {
      totalAmount += record.amount;
    });

    return totalAmount;
  }, [records]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>
        {" "}
        Welcome {user?.firstName}! Here is what your finances are looking like:
      </h2>

      <FinancialRecordForm />
      <div
        style={{
          textAlign: "center",
          margin: "20px 0",
          padding: "15px",
          backgroundColor: totalMonthly >= 0 ? "#d4edda" : "#f8d7da",
          border: `1px solid ${totalMonthly >= 0 ? "#c3e6cb" : "#f5c6cb"}`,
          borderRadius: "8px",
        }}
      >
        <div>
          <b>Monthly Total</b>: R {totalMonthly.toFixed(2)}
        </div>
        {/* Chart Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            margin: "20px 0",
            flexWrap: "wrap",
          }}
        >
          <button
            className="button"
            onClick={() => setActiveModal("income-expenses")}
            style={{ backgroundColor: "#2e95ccff" }}
          >
            📊 Income vs Expenses
          </button>
          <button
            className="button"
            onClick={() => setActiveModal("category-pie")}
            style={{ backgroundColor: "#2127c2ff" }}
          >
            🥧 Category Breakdown (Pie)
          </button>
          <button
            className="button"
            onClick={() => setActiveModal("category-bar")}
            style={{ backgroundColor: "#100349ff" }}
          >
            📈 Category Breakdown (Bar)
          </button>
        </div>
      </div>
      <FinancialRecordList />

      {/* Chart Modals */}
      <ChartModal
        isOpen={activeModal === "income-expenses"}
        onClose={() => setActiveModal(null)}
        chartType="income-expenses"
        records={records}
      />
      <ChartModal
        isOpen={activeModal === "category-pie"}
        onClose={() => setActiveModal(null)}
        chartType="category-pie"
        records={records}
      />
      <ChartModal
        isOpen={activeModal === "category-bar"}
        onClose={() => setActiveModal(null)}
        chartType="category-bar"
        records={records}
      />
    </div>
  );
};
