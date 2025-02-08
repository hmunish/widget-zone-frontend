import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserWidgetService } from '../../../core/services/widgets/userWidget.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';
import {
  Newsletter,
  NewsletterListResponse,
  NewsletterPayload,
} from '../../../core/interfaces/widgets/newsletter.interface';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { WidgetService } from '../../../core/services/widgets/widgets.service';
import { Widget } from '../../../core/interfaces/widgets/widgets.interface';
import { FormMode, WidgetType } from '../../../core/interfaces/common.enums';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PropertiesModalComponent } from '../modals/properties-modal/propertiesModal.component';
import { UserWidgetCodeModalComponent } from '../modals/code/user-widget-code-modal.component';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule, MatDialogModule],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.scss',
})
export class NewsletterComponent implements OnInit {
  widgetDetail: Widget | undefined;
  widgetFormGroup!: FormGroup;
  userWidgetList: Newsletter[] = [];
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
    });
  }

  getWidgetDetail() {
    this.widgetService.detail(WidgetType.Newsletter).subscribe((res) => {
      this.widgetDetail = res.data;
    });
  }

  listUserWidget() {
    this.service.list(WidgetType.Newsletter).subscribe((res) => {
      this.userWidgetList = (res as NewsletterListResponse).data;
    });
  }

  handleCreateWidget() {
    if (this.widgetFormGroup.invalid) return;
    const payload = {
      type: {
        id: this.widgetDetail?._id || '',
        name: 'newsletter',
      },
      data: {
        title: this.widgetFormGroup.get('title')?.value,
        message: this.widgetFormGroup.get('message')?.value,
        styles: {
          color: this.widgetFormGroup.get('color')?.value,
          bgColor: this.widgetFormGroup.get('backgroundColor')?.value,
        },
        ...(this.widgetFormMode === FormMode.Edit && {
          properties: this.widgetFormGroup.get('properties')?.value,
        }),
        ...(this.widgetFormMode === FormMode.Edit && {
          subscribers: this.widgetFormGroup.get('subscribers')?.value,
        }),
      },
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

  handleEditWidget(newsletter: Newsletter) {
    this.widgetFormMode = FormMode.Edit;
    this.widgetFormGroup.patchValue({
      title: newsletter.widget.data.title,
      color: newsletter.widget.data.styles.color,
      backgroundColor: newsletter.widget.data.styles.bgColor,
      message: newsletter.widget.data.message,
      id: newsletter._id,
      properties: newsletter.widget.properties,
      subscribers: newsletter.widget.subscribers,
    });
    this.widgetFormElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  handleCancelEditWidget() {
    this.widgetFormMode = FormMode.Add;
    this.initWidgetForm();
  }

  handleDeleteWidget(id: string) {
    this.widgetService.delete(id).subscribe((res) => {
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

  openCodeModal(userWidget: Newsletter) {
    const code = this.widgetDetail?.code
      .replace(/__WIDGET_ID__/g, userWidget._id)
      .replace('__BG_COLOR__', userWidget.widget.data.styles.bgColor)
      .replace('__COLOR__', userWidget.widget.data.styles.color);

    this.dialog.open(UserWidgetCodeModalComponent, {
      width: '500px',
      data: {
        code,
      },
    });
  }
}
