/*
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
/*
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
    //this.getScholarsByDate();
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
    this.scholarService.findScholarsByDateTimeline(this.startDate, this.endDate).subscribe( (res) => {
      this.scholarData = res;
      /*
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
      */
      /*
      window.ApexCharts.exec("chart", "updateSeries", [
        {
          data: res
        }
      ]);
      *//*
      debugger;
    });
  }
  
}
*/

import { Component, OnInit } from '@angular/core';
import { VScholarTimeLine } from 'src/app/core/to/VScholarTimeLine';
import { ScholarService } from '../services/scholar.service';

@Component({
  selector: 'app-timeline-dialog',
  templateUrl: './timeline-dialog.component.html',
  styleUrls: ['./timeline-dialog.component.scss']
})
export class TimelineDialogComponent implements OnInit {
  minDate: Date | undefined;
  maxDate: Date | undefined;
  startDate : Date | undefined;
  endDate : Date | undefined;
  scholarData : VScholarTimeLine[] = [];
  
  single: any[] | undefined;
  view: any = [700, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Country';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Population';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(private scholarService: ScholarService) {
    this.dateRange();
    //Object.assign(this, { single });
  }

  ngOnInit(): void {

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
    this.scholarService.findScholarsByDateTimeline(this.startDate, this.endDate).subscribe( (res) => {
      this.scholarData = res;
    });
  }

  //cuando se hace click encima
  /*
  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  //cuando se pone el raton encima
  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }
  //cuando se quita el raton encima
  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
  */
}