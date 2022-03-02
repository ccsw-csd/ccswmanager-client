import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from "moment";
import { ScholarService } from '../services/scholar.service';
import { VScholarDto } from 'src/app/core/to/VScholarDto';
import { VScholarTimeLine } from 'src/app/core/to/VScholarTimeLine';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexXAxis,
  ApexFill,
  ApexDataLabels,
  ApexYAxis,
  ApexGrid
} from "ng-apexcharts";


/*
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  fill: ApexFill;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
};
*/
@Component({
  selector: 'app-timeline-dialog',
  templateUrl: './timeline-dialog.component.html',
  styleUrls: ['./timeline-dialog.component.scss']
})
export class TimelineDialogComponent implements OnInit {
  minDate: Date | undefined;
  maxDate: Date | undefined;
  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: Partial<any>;
  startDate : Date | undefined;
  endDate : Date | undefined;
  scholarData : VScholarTimeLine[] = [];
  
  constructor(private scholarService: ScholarService) {
    this.dateRange();
    //this.getScholarsByDate();

    this.chartOptions = {
      series: [
        {
          //data: this.scholarData,
          
          data: [/*
            {
              x: 'Analysis',
              y: [
                new Date("2019-02-27").getTime(),
                new Date("2019-03-04").getTime()
              ],
              fillColor: '#008FFB'
            },
            {
              x: "Design",
              y: [
                new Date("2019-03-04").getTime(),
                new Date("2019-03-08").getTime()
              ],
              fillColor: "#00E396"
            },
            {
              x: "Coding",
              y: [
                new Date("2019-03-07").getTime(),
                new Date("2019-03-10").getTime()
              ],
              fillColor: "#775DD0"
            },
            {
              x: "Testing",
              y: [
                new Date("2019-03-08").getTime(),
                new Date("2019-03-12").getTime()
              ],
              fillColor: "#FEB019"
            },
            {
              x: "Deployment",
              y: [
                new Date("2019-03-12").getTime(),
                new Date("2019-03-17").getTime()
              ],
              fillColor: "#FF4560"
            },*/
          ]
        }
        
      ],
      chart: {
        height: 350,
        type: "rangeBar"
      },
      plotOptions: {
        bar: {
          horizontal: true,
          distributed: true,
          dataLabels: {
            hideOverflowingLabels: false
          }
        }
      },
      xaxis: {
        type: "datetime"
      },
      yaxis: {
        show: true
      },
      grid: {
        row: {
          colors: ["#f3f4f5", "#fff"],
          opacity: 1
        }
      }
    };
    //this.getScholarsByDate();
  }
  
  ngOnInit(): void {
    //this.getScholars();
    this.getScholarsByDate();
    //debugger;
  }

  dateRange(){
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    this.minDate = new Date(currentYear, currentMonth - 2, currentDay);
    this.maxDate = new Date(currentYear, currentMonth + 12, currentDay);
  }
  /*
  getScholars(){
    this.scholarService.findScholars().subscribe( (data) => {
      this.scholarData = data;
      debugger;
    }); 
  }
  */
  getScholarsByDate(){
    this.scholarService.findScholarsByDate(this.startDate, this.endDate).subscribe( (res) => {
      this.scholarData = res;
      //let result = []

      let date = new Date("2019-03-04").getTime();
      /*
      this.scholarData.forEach((res1) =>
      result.push({
          'x': res1.x,
          'y': res1.y?.forEach((res2) =>
            res2 = new Date(new Date(res2).getTime()),
          ),
          'fillColor': res1.fillColor
        })
      )
      */
     /*
      this.chartOptions = {
        series: [
          {
            data: {
              fillColor: "#00E396",
              x: "asolerpa",
              y: [1645311600000, 1647730800000]
            },
          }
        ]
      }
      */

      
      this.chart?.updateSeries([{
        data: [{
          fillColor: "#00E396",
          x: "asolerpa",
          y: [1645311600000, 1647730800000]
        },]
      }])
      

      debugger;
    }); 
  }
  
}
