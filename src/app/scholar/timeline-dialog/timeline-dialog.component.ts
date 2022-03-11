import { Component, OnInit, ViewChild } from '@angular/core';
import { ScholarService } from '../services/scholar.service';
import { VScholarTimeLine } from 'src/app/core/to/VScholarTimeLine';
import { ChartComponent } from "ng-apexcharts";


@Component({
  selector: 'app-timeline-dialog',
  templateUrl: './timeline-dialog.component.html',
  styleUrls: ['./timeline-dialog.component.scss']
})
export class TimelineDialogComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: Partial<any>;
  startDate : Date | undefined;
  endDate : Date | undefined;
  scholarData : VScholarTimeLine[] = [];
  errorTexto : String | undefined;
  
  
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

  onSave(){
    if(this.endDate == null){
      this.errorTexto = "El fecha de fin no puede estar vacío";
    }
    if(this.startDate != null && this.endDate != null){
      if(this.startDate > this.endDate){
        this.errorTexto = "El fecha de fin no puede ser anterior a la fecha de inicio";
        this.endDate = undefined;
      }
      else{
        this.getScholarsByDate();
      }
    }
  }

  dateRange(){
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    this.startDate = new Date(currentYear, currentMonth - 2, currentDay);
    this.endDate = new Date(currentYear, currentMonth + 6, currentDay);
  }

  getScholarsByDate(){
    this.scholarService.findScholarsTimelineByDate(this.startDate, this.endDate).subscribe( (res) => {
      this.scholarData = res;

      this.chartOptions.series = [{
        data: res
      }];
    });
  }
}
