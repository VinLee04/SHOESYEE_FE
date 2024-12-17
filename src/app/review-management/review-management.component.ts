import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { ReviewManagementService } from './review-management.service';

Chart.register(...registerables);

interface ReviewData {
  id: number;
  userName: string;
  rating: number;
  reviewText: string;
  reviewDate: Date;
}

@Component({
  selector: 'app-review-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-management.component.html',
  styleUrl: './review-management.component.scss',
})
export class ReviewManagementComponent implements OnInit {
  @ViewChild('ratingChart', { static: false }) ratingChartRef!: ElementRef;
  @ViewChild('reviewDistributionChart', { static: false })
  distributionChartRef!: ElementRef;
  @ViewChild('reviewByTimeChart', { static: false }) timeChartRef!: ElementRef;

  reviews: ReviewData[] = [];
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalReviews = 0;

  pageInput = 1;

  ratingChart: Chart | null = null;
  distributionChart: Chart | null = null;
  timeChart: Chart | null = null;

  constructor(private reviewService: ReviewManagementService) {}

  ngOnInit() {
    this.fetchReviews();
  }

  ngAfterViewInit() {
    // Không cần setTimeout nữa
  }

  fetchReviews() {
    this.reviewService
      .getAllReviews(this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          // Chuyển đổi reviewDate từ Instant thành Date
          this.reviews = response.content.map((review: any) => ({
            ...review,
            reviewDate: new Date(review.reviewDate * 1000),
          }));

          this.totalPages = response.totalPages;
          this.totalReviews = response.totalElements;

          this.updateCharts();
        },
        error: (err) => {
          console.error('Failed to fetch reviews', err);
        },
      });
  }

  // fetchReviews() {
  //   this.reviewService
  //     .getAllReviews(this.currentPage, this.pageSize)
  //     .subscribe({
  //       next: (response) => {
  //         this.reviews = response.content;
  //         this.totalPages = response.totalPages;
  //         this.totalReviews = response.totalElements;

  //         this.updateCharts();
  //       },
  //       error: (err) => {
  //         console.error('Failed to fetch reviews', err);
  //       },
  //     });
  // }

  updateCharts() {
    if (this.ratingChart) {
      this.ratingChart.destroy();
    }
    if (this.distributionChart) {
      this.distributionChart.destroy();
    }
    if (this.timeChart) {
      this.timeChart.destroy();
    }

    this.initializeRatingChart();
    this.initializeDistributionChart();
    this.initializeTimeChart();
  }

  initializeRatingChart() {
    if (this.ratingChartRef) {
      const ctx = this.ratingChartRef.nativeElement.getContext('2d');

      const ratingCounts = [0, 0, 0, 0, 0];
      this.reviews.forEach((review) => {
        const index = Math.min(Math.max(Math.round(review.rating) - 1, 0), 4);
        ratingCounts[index]++;
      });

      const config: ChartConfiguration = {
        type: 'bar' as ChartType,
        data: {
          labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
          datasets: [
            {
              label: 'Review Ratings',
              data: ratingCounts,
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
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
              title: {
                display: true,
                text: 'Number of Reviews',
              },
            },
          },
        },
      };

      this.ratingChart = new Chart(ctx, config);
    }
  }

  initializeDistributionChart() {
    if (this.distributionChartRef) {
      const ctx = this.distributionChartRef.nativeElement.getContext('2d');

      const distributionData = [
        this.reviews.filter((r) => r.rating <= 2).length,
        this.reviews.filter((r) => r.rating > 2 && r.rating <= 3).length,
        this.reviews.filter((r) => r.rating > 3 && r.rating <= 4).length,
        this.reviews.filter((r) => r.rating > 4).length,
      ];

      const config: ChartConfiguration = {
        type: 'pie' as ChartType,
        data: {
          labels: [
            'Poor (1-2)',
            'Average (2-3)',
            'Good (3-4)',
            'Excellent (4-5)',
          ],
          datasets: [
            {
              data: distributionData,
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Review Distribution',
            },
          },
        },
      };

      this.distributionChart = new Chart(ctx, config);
    }
  }
  initializeTimeChart() {
    if (this.timeChartRef) {
      const ctx = this.timeChartRef.nativeElement.getContext('2d');

      // Create a map to store review counts for each year
      const reviewsByYear = new Map<string, number>();

      // Process reviews and count them by year
      this.reviews.forEach((review) => {
        const date = new Date(review.reviewDate);
        const yearKey = `${date.getFullYear()}`; // Chỉ lấy năm
        reviewsByYear.set(yearKey, (reviewsByYear.get(yearKey) || 0) + 1);
      });

      // Sort years chronologically
      const sortedYears = Array.from(reviewsByYear.keys()).sort(
        (a, b) => parseInt(a, 10) - parseInt(b, 10)
      );

      // Configuring the chart
      const config: ChartConfiguration = {
        type: 'line' as ChartType,
        data: {
          labels: sortedYears, // Chỉ sử dụng năm làm nhãn
          datasets: [
            {
              label: 'Reviews per Year',
              data: sortedYears.map((year) => reviewsByYear.get(year) || 0), // Dữ liệu theo năm
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.1,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Reviews',
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: 'Reviews Over Years',
            },
          },
        },
      };

      this.timeChart = new Chart(ctx, config);
    }
  }

  changePage(delta: number) {
    this.currentPage = Math.max(0, this.currentPage + delta);
    this.fetchReviews();
  }

  goToPage() {
    if (this.pageInput > 0 && this.pageInput <= this.totalPages) {
      this.currentPage = this.pageInput - 1;
      this.fetchReviews();
    } else {
      this.pageInput = this.currentPage + 1;
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.pageInput = this.currentPage + 1;
      this.fetchReviews();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.pageInput = this.currentPage + 1;
      this.fetchReviews();
    }
  }
  

  deleteReview(reviewId: number) {
    this.reviewService.deleteReview(reviewId).subscribe({
      next: () => {
        this.fetchReviews();
      },
      error: (err) => {
        console.error('Failed to delete review', err);
      },
    });
  }
}
