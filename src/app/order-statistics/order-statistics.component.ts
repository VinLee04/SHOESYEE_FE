import { Component, OnInit } from '@angular/core';
import { OrderStatisticsService } from './order-statistics.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-order-statistics',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './order-statistics.component.html',
  styleUrl: './order-statistics.component.scss',
})
export class OrderStatisticsComponent implements OnInit {
  orderStats: any = {};
  startDate!: string; // Input yêu cầu chuỗi yyyy-MM-dd
  endDate!: string;
  orderChart!: Chart;

  constructor(private orderService: OrderStatisticsService) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    this.orderService.getFirstOrderDate().subscribe((firstOrderResponse) => {
      const [year, month, day, hour, minute] = firstOrderResponse.result;
      const firstOrderDate = new Date(year, month - 1, day, hour, minute);
      this.startDate = this.formatDateForInput(firstOrderDate);
      this.endDate = this.formatDateForInput(new Date());

      // Fetch the order statistics
      this.fetchOrderStatistics();
    });
  }

  fetchOrderStatistics() {
    const formattedStartDate = this.formatLocalDateTime(
      this.parseDateFromInput(this.startDate)
    );
    const formattedEndDate = this.formatLocalDateTime(
      this.parseDateFromInput(this.endDate)
    );

    this.orderService
      .getOrderStatistics(formattedStartDate, formattedEndDate)
      .subscribe((statsResponse) => {
        this.orderStats = statsResponse.result;
        this.createOrderChart();
      });
  }

  applyFilter() {
    // Chuyển đổi giá trị từ input thành kiểu Date để xử lý
    const startDate = this.parseDateFromInput(this.startDate);
    const endDate = this.parseDateFromInput(this.endDate);

    this.startDate = this.formatDateForInput(startDate);
    this.endDate = this.formatDateForInput(endDate);

    this.fetchOrderStatistics();
  }

  formatLocalDateTime(date: Date): string {
    return date.toISOString().slice(0, 19);
  }

  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  parseDateFromInput(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // Lưu ý: tháng trong Date bắt đầu từ 0
  }

  createOrderChart() {
    const ctx = document.getElementById('orderChart') as HTMLCanvasElement;
    this.orderChart?.destroy();

    this.orderChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Total Orders', 'Delivered', 'Pending', 'Canceled', 'Failed'],
        datasets: [
          {
            label: 'Order Statistics',
            data: [
              this.orderStats.totalOrders,
              this.orderStats.deliveredOrders,
              this.orderStats.pendingOrders,
              this.orderStats.canceledOrders,
              this.orderStats.failedOrders,
            ],
            backgroundColor: [
              'rgba(75, 192, 192, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(255, 99, 132, 0.6)',
              'rgba(153, 102, 255, 0.6)',
            ],
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}