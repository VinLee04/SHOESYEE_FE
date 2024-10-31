import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../common/service/auth.service';

interface TeamMember {
  name: string;
  position: string;
  bio: string;
  photo: string;
}

interface Service {
  name: string;
  description: string;
}

interface CompanyInfo {
  name: string;
  foundedYear: number;
  mission: string;
  vision: string;
  team: TeamMember[];
  services: Service[];
}

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class AboutUsComponent implements OnInit {
  authService = inject(AuthService);


  companyInfo: CompanyInfo = {
    name: 'ShoesYee',
    foundedYear: 2010,
    mission:
      'Mang đến cho khách hàng những sản phẩm giày thời trang với chất lượng tốt nhất.',
    vision:
      'Trở thành thương hiệu giày hàng đầu tại Việt Nam và vươn tầm quốc tế.',
    team: [
      {
        name: 'Nguyễn Minh Thuận',
        position: 'Giám đốc điều hành',
        bio: 'Với hơn 15 năm kinh nghiệm trong ngành giày dép, ông A đã lãnh đạo ShoesYee từ những ngày đầu thành lập.',
        photo: 'ourteam/thuan.png',
      },
      {
        name: 'Trần Vĩnh Lợi',
        position: 'Trưởng phòng Kinh doanh',
        bio: 'Bà B là người đã xây dựng chiến lược phát triển kinh doanh giúp ShoesYee đạt được nhiều thành tựu.',
        photo: 'ourteam/loi.png',
      },
      {
        name: 'Ngô Trí Long',
        position: 'Trưởng phòng Thiết kế',
        bio: 'Ông C đảm nhận vai trò chính trong việc phát triển sản phẩm, mang đến các thiết kế mới mẻ và phong cách.',
        photo: 'ourteam/long.png',
      },
      {
        name: 'Lê Đăng Bảo',
        position: 'Trưởng phòng Thiết kế',
        bio: 'Ông C đảm nhận vai trò chính trong việc phát triển sản phẩm, mang đến các thiết kế mới mẻ và phong cách.',
        photo: 'ourteam/bao.png',
      },
      {
        name: 'Phạm Khải Đăng',
        position: 'Trưởng phòng Thiết kế',
        bio: 'Ông C đảm nhận vai trò chính trong việc phát triển sản phẩm, mang đến các thiết kế mới mẻ và phong cách.',
        photo: 'ourteam/dang.png',
      },
      {
        name: 'Nguyễn Đạt Sang',
        position: 'Trưởng phòng Thiết kế',
        bio: 'Ông C đảm nhận vai trò chính trong việc phát triển sản phẩm, mang đến các thiết kế mới mẻ và phong cách.',
        photo: 'ourteam/sang.png',
      },
    ],
    services: [
      {
        name: 'Bán lẻ giày dép',
        description:
          'Cung cấp các sản phẩm giày dép đa dạng từ thể thao, thời trang đến giày công sở với chất lượng tốt nhất.',
      },
      {
        name: 'Thiết kế và sản xuất theo yêu cầu',
        description:
          'Dịch vụ thiết kế và sản xuất giày theo yêu cầu của khách hàng, phù hợp với các doanh nghiệp và tổ chức.',
      },
      {
        name: 'Bảo hành và sửa chữa',
        description:
          'Dịch vụ bảo hành và sửa chữa giày, giúp khách hàng yên tâm hơn khi sử dụng sản phẩm của chúng tôi.',
      },
    ],
  };

  constructor() {}

  ngOnInit(): void {
    this.authService.scrollToTop();
  }
}
