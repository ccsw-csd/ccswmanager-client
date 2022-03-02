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

    this.chartOptions = {
      series: [
        {
          data: []
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
  }
  
  ngOnInit(): void {
    this.getScholarsByDate();
  }

  dateRange(){
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    this.minDate = new Date(currentYear, currentMonth - 2, currentDay);
    this.maxDate = new Date(currentYear, currentMonth + 12, currentDay);
  }

  getScholarsByDate(){
    this.scholarService.findScholarsByDate(this.startDate, this.endDate).subscribe( (res) => {
      this.scholarData = res;

      //TODO limpiar todo esto
      this.chartOptions = {
        series: [
          {
            data: res
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
    });
  }
  
}
