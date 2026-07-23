import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-service-modal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './service-modal.html',
  styleUrl: './service-modal.scss',
})
export class ServiceModalComponent {
  @Input() service: any;

  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
