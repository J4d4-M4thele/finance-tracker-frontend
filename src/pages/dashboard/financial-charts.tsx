import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { FinancialRecord } from '../../contexts/financial-record-context';

interface ChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  chartType: 'income-expenses' | 'category-pie' | 'category-bar';
  records: FinancialRecord[];
}

const ChartModal: React.FC<ChartModalProps> = ({ isOpen, onClose, chartType, records }) => {
  // Color palette for charts
  const COLORS = [
    '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
    '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#d35400',
    '#8e44ad', '#27ae60', '#2980b9', '#c0392b', '#16a085'
  ];

  const chartData = useMemo(() => {
    if (!records || records.length === 0) {
      return {
        incomeVsExpenses: [],
        categoryBreakdown: [],
        totalIncome: 0,
        totalExpenses: 0
      };
    }

    // Separate income (salary) and expenses
    const income = records.filter(record => 
      record.category.toLowerCase() === 'salary'
    );
    const expenses = records.filter(record => 
      record.category.toLowerCase() !== 'salary'
    );

    const totalIncome = income.reduce((sum, record) => sum + Math.abs(record.amount), 0);
    const totalExpenses = expenses.reduce((sum, record) => sum + Math.abs(record.amount), 0);

    // Income vs Expenses data
    const incomeVsExpenses = [
      { name: 'Income', value: totalIncome, fill: '#2ecc71' },
      { name: 'Expenses', value: totalExpenses, fill: '#e74c3c' }
    ];

    // Category breakdown (all categories including salary)
    const categoryMap = new Map<string, number>();
    records.forEach(record => {
      const category = record.category || 'Other';
      const currentAmount = categoryMap.get(category) || 0;
      categoryMap.set(category, currentAmount + Math.abs(record.amount));
    });

    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        name: category,
        value: amount,
        fill: COLORS[Array.from(categoryMap.keys()).indexOf(category) % COLORS.length]
      }))
      .sort((a, b) => b.value - a.value);

    return {
      incomeVsExpenses,
      categoryBreakdown,
      totalIncome,
      totalExpenses
    };
  }, [records]);

  const formatCurrency = (value: number) => {
    return `R${value.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '12px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color, margin: '4px 0' }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getChartTitle = () => {
    switch (chartType) {
      case 'income-expenses':
        return 'Income vs Expenses';
      case 'category-pie':
        return 'Spending by Category';
      case 'category-bar':
        return 'Category Breakdown';
      default:
        return 'Chart';
    }
  };

  const renderChart = () => {
    if (!records || records.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
          <h3>No financial data available</h3>
          <p>Add some financial records to see your analytics!</p>
        </div>
      );
    }

    switch (chartType) {
      case 'income-expenses':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData.incomeVsExpenses}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.incomeVsExpenses.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'category-pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData.categoryBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => 
                  percent > 0.05 ? `${name} ${(percent * 100).toFixed(1)}%` : ''
                }
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.categoryBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'category-bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData.categoryBreakdown}
              margin={{ top: 20, right: 30, left: 40, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.categoryBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        width: '800px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        overflow: 'auto'
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666',
            padding: '5px'
          }}
        >
          ×
        </button>

        {/* Chart title */}
        <h2 style={{
          textAlign: 'center',
          color: '#2c3e50',
          marginBottom: '30px',
          marginTop: '10px'
        }}>
          {getChartTitle()}
        </h2>

        {/* Summary info for income vs expenses */}
        {chartType === 'income-expenses' && records.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '30px'
          }}>
            <div style={{
              backgroundColor: '#d4edda',
              border: '1px solid #c3e6cb',
              borderRadius: '8px',
              padding: '15px',
              textAlign: 'center'
            }}>
              <strong style={{ color: '#155724' }}>
                Income: {formatCurrency(chartData.totalIncome)}
              </strong>
            </div>
            <div style={{
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '8px',
              padding: '15px',
              textAlign: 'center'
            }}>
              <strong style={{ color: '#721c24' }}>
                Expenses: {formatCurrency(chartData.totalExpenses)}
              </strong>
            </div>
          </div>
        )}

        {/* Chart content */}
        <div>
          {renderChart()}
        </div>
      </div>
    </div>
  );
};

export default ChartModal;