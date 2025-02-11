import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserWidgetService } from '../../../core/services/widgets/userWidget.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { WidgetService } from '../../../core/services/widgets/widgets.service';
import { Widget } from '../../../core/interfaces/widgets/widgets.interface';
import { FormMode, WidgetType } from '../../../core/interfaces/common.enums';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PropertiesModalComponent } from '../modals/properties-modal/propertiesModal.component';
import { UserWidgetCodeModalComponent } from '../modals/code/user-widget-code-modal.component';
import {
  TicketManagement,
  TicketManagementListResponse,
} from '../../../core/interfaces/widgets/ticket-management.interface';

@Component({
  selector: 'app-ticket-management',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule, MatDialogModule],
  templateUrl: './ticket-management.component.html',
  styleUrl: '../styles/user-widget.scss',
})
export class TicketManagementComponent implements OnInit {
  widgetDetail: Widget | undefined;
  widgetFormGroup!: FormGroup;
  userWidgetList: TicketManagement[] = [];
  widgetFormMode = FormMode.Add;

  @ViewChild('widgetFormElement') widgetFormElement!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private service: UserWidgetService,
    private notifyService: NotificationService,
    private widgetService: WidgetService,
    private dialog: MatDialog
  ) {
    this.initWidgetForm();
  }

  ngOnInit(): void {
    this.getWidgetDetail();
    this.listUserWidget();
  }

  initWidgetForm() {
    this.widgetFormGroup = this.fb.group({
      title: [null, [Validators.required, Validators.maxLength(100)]],
      color: ['#000000', [Validators.required]],
      backgroundColor: ['#000000', [Validators.required]],
      message: ['', [Validators.required, Validators.maxLength(500)]],
      id: [''],
      properties: [null],
      tickets: [null],
    });
  }

  getWidgetDetail() {
    this.widgetService.detail(WidgetType.TicketManagement).subscribe((res) => {
      this.widgetDetail = res.data;
    });
  }

  listUserWidget() {
    this.service.list(WidgetType.TicketManagement).subscribe((res) => {
      this.userWidgetList = (
        res as unknown as TicketManagementListResponse
      ).data;
    });
  }

  handleCreateWidget() {
    if (this.widgetFormGroup.invalid) return;
    const payload = {
      type: {
        id: this.widgetDetail?._id || '',
        name: WidgetType.TicketManagement,
      },
      data: {
        title: this.widgetFormGroup.get('title')?.value,
        message: this.widgetFormGroup.get('message')?.value,
        styles: {
          color: this.widgetFormGroup.get('color')?.value,
          bgColor: this.widgetFormGroup.get('backgroundColor')?.value,
        },
      },
      ...(this.widgetFormMode === FormMode.Edit && {
        properties: this.widgetFormGroup.get('properties')?.value,
      }),
      ...(this.widgetFormMode === FormMode.Edit && {
        tickets: this.widgetFormGroup.get('tickets')?.value,
      }),
    };
    if (this.widgetFormMode === FormMode.Add) {
      this.service.create(payload).subscribe(() => {
        this.initWidgetForm();
        this.listUserWidget();
        this.notifyService.openSnackBar(
          'Widget have been successfully created.'
        );
      });
    } else {
      const widgetId = this.widgetFormGroup.get('id')?.value;
      this.service.edit(widgetId, payload).subscribe((res) => {
        this.listUserWidget();
        this.handleCancelEditWidget();
        this.notifyService.openSnackBar(
          'Widget have been successfully edited.'
        );
      });
    }
  }

  handleEditWidget(ticketManagement: TicketManagement) {
    this.widgetFormMode = FormMode.Edit;
    this.widgetFormGroup.patchValue({
      title: ticketManagement.widget.data.title,
      color: ticketManagement.widget.data.styles.color,
      backgroundColor: ticketManagement.widget.data.styles.bgColor,
      message: ticketManagement.widget.data.message,
      id: ticketManagement._id,
      properties: ticketManagement.widget.properties,
      tickets: ticketManagement.widget.tickets,
    });
    this.widgetFormElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  handleCancelEditWidget() {
    this.widgetFormMode = FormMode.Add;
    this.initWidgetForm();
  }

  handleDeleteWidget(id: string) {
    this.widgetService.delete(id).subscribe(() => {
      this.notifyService.openSnackBar('Widget have been successfully deleted.');
      this.listUserWidget();
    });
  }

  handleManageProperties(widgetId: string, properties: string[]) {
    const dialogRef = this.dialog.open(PropertiesModalComponent, {
      width: '350px',
      data: {
        widgetId,
        properties,
        refreshWidgetList: () => this.listUserWidget(),
      },
    });
  }

  openCodeModal(userWidget: TicketManagement) {
    const code = this.widgetDetail?.code.replace(
      /__WIDGET_ID__/g,
      userWidget._id
    );
    this.dialog.open(UserWidgetCodeModalComponent, {
      width: '500px',
      data: {
        code,
      },
    });
  }
}
