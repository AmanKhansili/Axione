import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServiceModalComponent } from '../../components/service-modal/service-modal';

@Component({
  selector: 'app-services',
  imports: [RouterLink, ServiceModalComponent],
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

  showModal = false;

  selectedTitle = '';

  openModal(title: string) {
    this.selectedTitle = title;

    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}
