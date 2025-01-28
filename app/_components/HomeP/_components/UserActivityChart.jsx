import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';

const UserActivityChart = ({ activeUsers = [], inactiveUsers = [] }) => {
  // Helper function to format date consistently
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) return null;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const processData = (users = []) => {
    // Create a map of dates to count
    const dateMap = users.reduce((acc, user) => {
      const createdDate = formatDate(user.createdAt);
      const updatedDate = formatDate(user.updatedAt);
      
      // Only count valid dates
      if (createdDate) {
        acc[createdDate] = (acc[createdDate] || 0) + 1;
      }
      
      if (updatedDate) {
        acc[updatedDate] = (acc[updatedDate] || 0) + 1;
      }
      
      return acc;
    }, {});

    // Sort dates
    const sortedDates = Object.keys(dateMap)
      .filter(date => date) // Remove any null/undefined dates
      .sort((a, b) => new Date(a) - new Date(b));
    
    return {
      dates: sortedDates,
      counts: sortedDates.map(date => dateMap[date])
    };
  };

  const chartData = useMemo(() => {
    const activeData = processData(activeUsers);
    const inactiveData = processData(inactiveUsers);

    // Combine all dates for x-axis
    const allDates = [...new Set([...activeData.dates, ...inactiveData.dates])]
      .filter(date => date) // Remove any invalid dates
      .sort((a, b) => new Date(a) - new Date(b));

    return {
      labels: allDates,
      datasets: [
        {
          label: 'Active Users',
          data: allDates.map(date => {
            const index = activeData.dates.indexOf(date);
            return index !== -1 ? activeData.counts[index] : 0;
          }),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Inactive Users',
          data: allDates.map(date => {
            const index = inactiveData.dates.indexOf(date);
            return index !== -1 ? inactiveData.counts[index] : 0;
          }),
          borderColor: 'rgb(244, 63, 94)',
          backgroundColor: 'rgba(244, 63, 94, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  }, [activeUsers, inactiveUsers]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          title: (context) => {
            return context[0].label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxTicksLimit: 7,
          callback: function(value, index, values) {
            const label = this.getLabelForValue(value);
            // Format the date for display
            return formatDate(label);
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          borderDash: [2],
          drawBorder: false,
        },
        ticks: {
          stepSize: 1
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div className="w-full h-[250px]">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default UserActivityChart;
