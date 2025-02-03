import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NewsletterService } from '../../../core/services/widgets/newsletter.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';
import { Newsletter } from '../../../core/interfaces/widgets/newsletter.interface';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { WidgetService } from '../../../core/services/widgets/widgets.service';
import { Widget } from '../../../core/interfaces/widgets/widgets.interface';
import { FormMode } from '../../../core/interfaces/common.enums';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule, MatDialogModule],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.scss',
})
export class NewsletterComponent implements OnInit {
  widgetDetail: Widget | undefined;
  widgetFormGroup: FormGroup;
  userNewsletterList: Newsletter[] = [];
  widgetFormMode = FormMode.Add;

  @ViewChild('widgetFormElement') widgetFormElement!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private service: NewsletterService,
    private notifyService: NotificationService,
    private widgetService: WidgetService
  ) {
    this.widgetFormGroup = this.fb.group({
      title: [null, [Validators.required, Validators.maxLength(100)]],
      color: ['#000000', [Validators.required]],
      backgroundColor: ['#000000', [Validators.required]],
      message: ['', [Validators.required, Validators.maxLength(500)]],
      id: [''],
    });
  }

  ngOnInit(): void {
    this.getWidgetDetail();
    this.listUserWidget();
  }

  getWidgetDetail() {
    this.widgetService.detail('newsletter').subscribe((res) => {
      this.widgetDetail = res.data;
    });
  }

  listUserWidget() {
    this.service.list().subscribe((res) => {
      this.userNewsletterList = res.data;
    });
  }

  handleCreateWidget() {
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
      },
    };
    if (this.widgetFormMode === FormMode.Add) {
      this.service.create(payload).subscribe(() => {
        this.widgetFormGroup.reset();
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
    });
    this.widgetFormElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  handleCancelEditWidget() {
    this.widgetFormMode = FormMode.Add;
    this.widgetFormGroup.reset();
  }

  handleDeleteWidget(id: string) {
    this.widgetService.delete(id).subscribe((res) => {
      this.notifyService.openSnackBar('Widget have been successfully deleted.');
      this.listUserWidget();
    });
  }
}
