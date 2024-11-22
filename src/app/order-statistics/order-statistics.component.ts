// import { Component } from '@angular/core';
// import { FormGroup } from '@angular/forms';
// import { OrderStatistics } from '../interface/Order';

// @Component({
//   selector: 'app-order-statistics',
//   standalone: true,
//   imports: [],
//   templateUrl: './order-statistics.component.html',
//   styleUrl: './order-statistics.component.scss',
// })
// export class OrderStatisticsComponent {
//   filterForm: FormGroup;
//   statistics?: OrderStatistics;
//   isLoading = false;
//   chart?: Chart;

//   constructor(
//     private fb: FormBuilder,
//     private statisticsService: OrderStatisticsService
//   ) {
//     this.filterForm = this.fb.group({
//       startDate: [null],
//       endDate: [null],
//     });
//   }

//   ngOnInit() {
//     // Set default date range (current month)
//     const today = new Date();
//     const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//     const lastDayOfMonth = new Date(
//       today.getFullYear(),
//       today.getMonth() + 1,
//       0
//     );

//     this.filterForm.patchValue({
//       startDate: firstDayOfMonth,
//       endDate: lastDayOfMonth,
//     });

//     this.fetchStatistics();
//   }

//   fetchStatistics() {
//     const startDate = this.filterForm.get('startDate')?.value;
//     const endDate = this.filterForm.get('endDate')?.value;

//     if (!startDate || !endDate) return;

//     this.isLoading = true;

//     const start = new Date(startDate);
//     start.setHours(0, 0, 0, 0);

//     const end = new Date(endDate);
//     end.setHours(23, 59, 59, 999);

//     this.statisticsService.getOrderStatistics(start, end).subscribe({
//       next: (response) => {
//         this.statistics = response.result;
//         this.updateChart();
//         this.isLoading = false;
//       },
//       error: (error) => {
//         console.error('Error fetching statistics:', error);
//         this.isLoading = false;
//       },
//     });
//   }

//   updateChart() {
//     if (!this.statistics) return;

//     if (this.chart) {
//       this.chart.destroy();
//     }

//     const ctx = document.getElementById('orderChart') as HTMLCanvasElement;
//     this.chart = new Chart(ctx, {
//       type: 'doughnut',
//       data: {
//         labels: ['Delivered', 'Canceled', 'Failed', 'Pending'],
//         datasets: [
//           {
//             data: [
//               this.statistics.deliveredOrders,
//               this.statistics.canceledOrders,
//               this.statistics.failedOrders,
//               this.statistics.pendingOrders,
//             ],
//             backgroundColor: ['#4CAF50', '#f44336', '#9C27B0', '#FFC107'],
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         plugins: {
//           legend: {
//             position: 'right',
//           },
//         },
//       },
//     });
//   }
// }