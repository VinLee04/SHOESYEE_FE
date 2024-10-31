import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../common/service/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  authService = inject(AuthService);
  ngOnInit(): void {
    this.authService.scrollToTop();
}
}
