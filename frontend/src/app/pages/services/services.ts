import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SERVICES } from './services-data';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  services = SERVICES;

  scrollToServices(): void {
    const element = document.getElementById('services');

    element?.scrollIntoView({
      behavior: 'smooth',
    });
  }
}
