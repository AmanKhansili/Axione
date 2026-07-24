import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  scrollToServices(): void {
    const element = document.getElementById('services');
    element?.scrollIntoView({
      behavior: 'smooth',
    });
  }

  selectedService: any = null;
}
