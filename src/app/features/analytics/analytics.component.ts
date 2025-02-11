import { Component, OnInit } from '@angular/core';
import {
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexOptions,
  ApexPlotOptions,
  ApexXAxis,
  ApexYAxis,
  NgxApexchartsModule,
} from 'ngx-apexcharts';
import { CommonModule } from '@angular/common';
import { UserWidgetService } from '../../core/services/widgets/userWidget.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, NgxApexchartsModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit {
  constructor(private userWidgetService: UserWidgetService) {}

  ngOnInit(): void {
    this.userWidgetService.getTickets(null, true).subscribe((res) => {
      this.ticketData.forEach((ticket, index) => {
        ticket.count = res.data[index] as unknown as number;
      });
      this.loadTicketGraphData();
    });
    this.userWidgetService.getSubscribers(true).subscribe((res) => {
      this.subscriberData.forEach((subscriber, index) => {
        subscriber.count = res.data[index] as unknown as number;
      });
      this.loadSubscriberGraphData();
    });
  }
  subscriberData = [
    { month: 'Jan', count: 5 },
    { month: 'Feb', count: 12 },
    { month: 'Mar', count: 8 },
    { month: 'Apr', count: 20 },
    { month: 'May', count: 15 },
    { month: 'Jun', count: 18 },
    { month: 'Jul', count: 22 },
    { month: 'Aug', count: 10 },
    { month: 'Sep', count: 14 },
    { month: 'Oct', count: 19 },
    { month: 'Nov', count: 30 },
    { month: 'Dec', count: 25 },
  ];

  ticketData = [
    { month: 'Jan', count: 0 },
    { month: 'Feb', count: 0 },
    { month: 'Mar', count: 0 },
    { month: 'Apr', count: 0 },
    { month: 'May', count: 0 },
    { month: 'Jun', count: 0 },
    { month: 'Jul', count: 0 },
    { month: 'Aug', count: 0 },
    { month: 'Sep', count: 0 },
    { month: 'Oct', count: 0 },
    { month: 'Nov', count: 0 },
    { month: 'Dec', count: 0 },
  ];

  chartSeries: any;
  chartOptions: any;
  chartSeries2: any;
  chartOptions2: any;

  loadSubscriberGraphData() {
    this.chartSeries = [
      {
        name: 'Subscribers',
        data: this.subscriberData.map((d) => d.count),
      },
    ];

    this.chartOptions = {
      chart: <ApexChart>{
        type: 'bar',
        height: 350,
      },
      xaxis: {
        categories: this.subscriberData.map((d) => d.month),
      },

      colors: ['#769720'],
      fill: <ApexFill>{
        opacity: 0.8,
      },
    };
  }

  loadTicketGraphData() {
    this.chartSeries2 = [
      {
        name: 'Tickets Generated',
        data: this.ticketData.map((d) => d.count),
      },
    ];
    this.chartOptions2 = {
      chart: {
        type: 'bar',
        height: 350,
      } as ApexChart,
      xaxis: {
        categories: this.ticketData.map((d) => d.month),
      } as ApexXAxis,
      yaxis: {
        labels: {
          formatter: (value) => value.toFixed(0),
        },
      } as ApexYAxis,
      colors: ['#e63d3d'], // Red bars
      plotOptions: {
        bar: {
          borderRadius: 5, // Rounded bars
          columnWidth: '50%', // Adjust width for spacing
        },
      } as ApexPlotOptions,
      dataLabels: {
        enabled: false,
      } as ApexDataLabels,
      fill: {
        opacity: 1,
      } as ApexFill,
    };
  }
}
