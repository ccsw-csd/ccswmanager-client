import { Component, OnInit, ViewChild } from '@angular/core';
import { InternService } from '../services/intern.service';
import { TimeLine } from 'src/app/core/to/TimeLine';
import { ChartComponent } from "ng-apexcharts";

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: Partial<any>;
  startDate : Date | undefined;
  endDate : Date | undefined;
  data : TimeLine[] = [];
  errorText : String | undefined;

  constructor(
    private internService: InternService
  ) {
    this.dateRange();

    this.chartOptions = {
      series: [
        {
          data: []
        }
      ],
      chart: {
        type: "rangeBar"
      },
      annotations: {
        xaxis: [{
          x: new Date().getTime(),
          strokeDashArray: 0,
          borderColor: '#775DD0',
          label: {
            borderColor: '#775DD0',
            style: {
              color: '#fff',
              background: '#775DD0',
            },
            text: 'Hoy',
          }
        }]
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
    this.getInternsByDate();
  }

  onSave(){
    if(this.endDate == null){
      this.errorText = "El fecha de fin no puede estar vacío";
    }
    if(this.startDate != null && this.endDate != null){
      if(this.startDate > this.endDate){
        this.errorText = "El fecha de fin no puede ser anterior a la fecha de inicio";
        this.endDate = undefined;
      }
      else{
        this.getInternsByDate();
      }
    }
  }

  getCurrentDate(): number {

    console.log(new Date().getTime());
    return new Date().getTime();
  }

  dateRange(){
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    this.startDate = new Date(currentYear, currentMonth - 2, currentDay);
    this.endDate = new Date(currentYear, currentMonth + 6, currentDay);
  }

  getInternsByDate(){
    this.internService.findInternsTimelineByDate(this.startDate, this.endDate).subscribe( (res) => {
      this.data = res;

      this.chartOptions.series = [{
        data: res
      }];
    });
  }
}
