import React, {useEffect, useRef} from "react";
import {Chart as ChartJS, LinearScale, CategoryScale, BarElement, BarController, Title, Tooltip, Legend} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(LinearScale, CategoryScale, BarElement, BarController, Title, Tooltip, Legend, ChartDataLabels)

export function ChartComponent({bleu, rouge, vert, jaune}) {
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
              },
              

            },
            animation: {
              duration: 1500,
              easing: 'easeInOutQuad'
            },
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                  display: false  // Désactiver la légende
              },
              datalabels: {
                  anchor: 'center', // Positionner les labels sur la fin de chaque barre
                  align: 'top',  // Aligner les labels au-dessus des barres
                  color: '#000', // Couleur du texte des labels
                  font: {
                      size: 14,  // Taille de la police
                      weight: 'bold'
                  }
              }
          }
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
      
        
    
    
    return <canvas className="chart" ref={canvasRef} width="400" height="200"></canvas>
       
}