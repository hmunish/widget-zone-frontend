import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UserWidgetService } from '../../../core/services/widgets/userWidget.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscriber } from '../../../core/interfaces/widgets/subscriber-list.interface';

@Component({
  selector: 'app-subscriber-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './subscriber-list.component.html',
  styleUrl: './subscriber-list.component.scss',
})
export class SubscriberListComponent implements OnInit {
  subscriberList: { _id: string; subscriber: Subscriber }[] = [];
  constructor(private userWidgetService: UserWidgetService) {}

  ngOnInit(): void {
    this.getSubscriberList();
  }

  getSubscriberList() {
    this.userWidgetService.getSubscribers().subscribe((res) => {
      this.subscriberList = res.data;
    });
  }
}
