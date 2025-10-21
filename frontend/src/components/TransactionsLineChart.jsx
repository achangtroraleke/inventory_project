import React, { useEffect, useState, useContext } from 'react';
// 1. Import the necessary components and features from react-chartjs-2 and chart.js
import { Line, Bar, Chart } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    // CRITICAL FIX: Explicitly register the controllers for the types used in datasets
    LineController,
    BarController,
} from 'chart.js';
import LoadingSpinner from './LoadingSpinner';
import AppContext from '../context/AppContext';

// 2. Register the components (Crucial step for Chart.js v3+)
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    // Register Controllers
    LineController,
    BarController
);
function getDaysInMonth(month, year = new Date().getFullYear()) {
  const date = new Date(year, month, 1);
  const days = [];

  while (date.getMonth() === month) {
    days.push(date.toISOString().split("T")[0]); // "YYYY-MM-DD"
    date.setDate(date.getDate() + 1);
  }

  return days;
}

function createChartData(data, month) {
    data.forEach((d)=>{
        d['date'] = d.timestamp.split("T")[0]
    })
 
  const days = getDaysInMonth(month);
  
  const today = new Date().toISOString().split("T")[0];

  let lastKnownPrice = null;
    
  const result = days.map(day => {
    // Filter all records for this day
    const entriesForDay = data.filter(item => item.date === day);

    // Compute total quantity changes by type
    const totalIn = entriesForDay
      .filter(item => item.type === "IN")
      .reduce((sum, item) => sum + (item.quantity_change || 0), 0);

    const totalOut = entriesForDay
      .filter(item => item.type === "OUT")
      .reduce((sum, item) => sum + Math.abs(item.quantity_change || 0), 0); // abs for clarity

    // Update last known price if this day has one
    const priceEntry = entriesForDay.find(item => item.price != null);
   
    if (priceEntry) {
      lastKnownPrice = parseFloat(priceEntry.price);
    }
    const isPastOrToday = day <= today;
    const price = isPastOrToday ? lastKnownPrice : null;

    // Return daily record
    return {
      date: day,
      price,
      in: totalIn,
      out: totalOut,
    };
  });
  
  return {
    labels: days,
    data: result,
  };
}





const TransactionsLineChart = ({product, month}) =>{

    let rawTransactionData = product.transaction_history
   
    let myChartData = createChartData(rawTransactionData, month)
    


    const data = {
        labels:myChartData.data.map((d)=>d.date),
        datasets:[
        {
            type: 'bar',
            label: 'Purchase (units)',
            data: myChartData.data.map((d)=>d.in),
            backgroundColor: 'rgba(52, 211, 153, 0.8)', // Teal/Green
            borderColor: 'rgb(52, 211, 153)',
            borderWidth: 1,
            borderRadius: 4,
            yAxisID: 'y', // Assign to the left Y-axis
            order: 2, // Draw bars first
        },    // Dataset 2: Costs Bar Chart (Left Axis)
        {
            type: 'bar',
            label: 'Sold (units)',
            data: myChartData.data.map((d)=>d.out),
            backgroundColor: 'rgba(239, 68, 68, 0.8)', // Rose/Red
            borderColor: 'rgb(239, 68, 68)',
            borderWidth: 1,
            borderRadius: 4,
            yAxisID: 'y', // Assign to the left Y-axis
            order: 3, // Draw bars first
        },
        {
            type: 'line',
            label: 'Price History',
            data: myChartData.data.map((t)=>t.price),
            borderColor: 'rgb(99, 102, 241)', // Indigo/Blue
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            tension: 0.3,
            fill: false,
            pointRadius: 4,
            pointBackgroundColor: 'rgb(99, 102, 241)',
            pointBorderColor: '#fff',
            borderWidth: 2,
            yAxisID: 'y1', // Assign to the right Y-axis
            order: 1, // Draw line last (on top)
        }
    ]
    }


    const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    plugins: {
        title: {
            display: true,
            text: `Demand vs Prices for ${product.name}`,
            font: {
                size: 18,
                weight: 'bold',
            },
            color: '#1f2937',
        },
        legend: {
            labels: {
                padding: 15,
                usePointStyle: true,
            }
        },
        tooltip: {
            callbacks: {
                // Custom formatting for tooltips based on the dataset
                label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        if (context.dataset.type === 'line') {
                             // Format price
                            label += context.parsed.y.toFixed(2); 
                        } else {
                            // Format units sold
                            label +=  context.parsed.y.toFixed(0);
                        }
                    }
                    return label;
                }
            }
        }
    },
    scales: {
        // Left Y-Axis for Bars (k$)
        y: {
            type: 'linear',
            position: 'left',
            min: 0,
            max: 100,
            beginAtZero: true,
            title: {
                display: true,
                text: 'Units Bought and Sold',
                color: '#4b5563'
            }
        },
        // Right Y-Axis for Line (%)
        y1: {
            type: 'linear',
            position: 'right',
            min: 0,
            max: 100,
            grid: {
                drawOnChartArea: false, // Only draw the grid for the left axis
            },
            title: {
                display: true,
                text: 'Price',
                color: '#1f2937'
            },
            ticks: {
                color: '#1f2937',
                callback: function(value) {
                    return '$'+value; // Add percentage sign
                }
            }
        },
        // X-Axis
        x: {
             grid: {
                display: true 
            },
             title: {
                display: true,
                text: 'Dates',
                color: '#1f2937'
            }
        }
    }
};

    return(

            <div className="bg-white shadow-2xl rounded-xl p-6 md:p-8 md:col-span-2 ">
           
                
                <div className="h-[400px] w-full ">
                    {/* 3. The Line component takes data and options as props */}
                     <Bar data={data} options={options} />
                </div>
            </div>
    
    )
}
export default TransactionsLineChart;