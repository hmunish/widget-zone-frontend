import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UserWidgetService } from '../../../core/services/widgets/userWidget.service';
import { Ticket } from '../../../core/interfaces/widgets/ticket-list.interface';
import { TicketStatus } from '../../../core/interfaces/common.enums';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.scss',
})
export class TicketListComponent implements OnInit {
  ticketList: { _id: string; ticket: Ticket }[] = [];
  status: string | null = null;
  constructor(
    private route: ActivatedRoute,
    private notifyService: NotificationService,
    private userWidgetService: UserWidgetService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.status = params.get('status'); // Assign query param to the variable
      this.getTicketList();
    });
  }

  getTicketList() {
    this.userWidgetService.getTickets(this.status).subscribe((res) => {
      this.ticketList = res.data;
    });
  }

  handleUpdateStatus(widgetId: string, ticketId: string, status: TicketStatus) {
    this.userWidgetService
      .updateTicketStatus(widgetId, ticketId, status)
      .subscribe(() => {
        this.getTicketList();
      });
  }

  getStatusText(status: TicketStatus) {
    switch (status) {
      case TicketStatus.Open:
        return 'Open';
      case TicketStatus.Pending:
        return 'Pending';
      default:
        return 'Closed';
    }
  }
}
