import React, {useEffect, useRef} from "react";
import {Chart as ChartJS, LinearScale, CategoryScale, BarElement, BarController, Title, Tooltip, Legend} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(LinearScale, CategoryScale, BarElement, BarController, Title, Tooltip, Legend, ChartDataLabels)

export function ChartComponent({height, width, bleu, rouge, vert, jaune}) {
    const canvasRef = useRef(null); 
      
        useEffect(() => {
          
          const ctx = canvasRef.current.getContext('2d'); 
      
          const data = {
            labels: ["Bleu", "Rouge", "Vert", "Jaune"],
            datasets: [{
              label: '',
              data: [bleu, rouge, vert, jaune],
              backgroundColor: [
                '#6199EF',
                "#F87C8B",
                "#4BDDB6",
                "#F4F22D"
              ],
              borderRadius: 50,
              barThickness: 'flex', // Adjusted to remove space
              maxBarThickness: 100, // Adjusted to remove space
              
              
            }]
          };
      
          const options = {
            scales: {
              y: {
                display: false,
                type: 'linear',
                beginAtZero: true,
                grid: {
                  display: false
                },
              },
              x: {
                type: 'category',
                grid: {
                  display: false
                },
                categoryPercentage: 1.0, // Adjusted to remove space
                barPercentage: 1.0, // Adjusted to remove space
              },
              

            },
            animation: {
              duration: 1500,
              easing: 'easeInOutQuad'
            },
            responsive: false,
            maintainAspectRatio: false,
            
            plugins: {
              legend: {
                  display: false  // Désactiver la légende
              },
              datalabels: {
                  anchor: 'center', 
                  align: 'top',
                  color: '#000', 
                  font: {
                      size: 14,  
                      weight: 'bold'
                  }
              }
          }, 
           
          };
      
          const myBarChart = new ChartJS(ctx, {
            type: 'bar',
            data: data,
            options: options
          });
      
          
          return () => {
            myBarChart.destroy();
          };
        }, [bleu, rouge, vert, jaune]); 
      
        
    
    
    return (
        <div className="chartContainer">
          <canvas className="chart" height={height} width={width} ref={canvasRef} ></canvas>
        </div>
    )
       
}