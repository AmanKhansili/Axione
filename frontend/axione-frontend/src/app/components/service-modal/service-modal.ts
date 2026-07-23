import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-service-modal',
  imports: [RouterLink],
  templateUrl: './service-modal.html',
  styleUrl: './service-modal.scss',
})
export class ServiceModalComponent {
  @Input() title = '';

  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
