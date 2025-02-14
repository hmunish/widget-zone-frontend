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
import { Advertisement } from '../../../core/interfaces/widgets/advertisement.interface';
import { PropertiesModalComponent } from '../modals/properties-modal/propertiesModal.component';
import { UserWidgetCodeModalComponent } from '../modals/code/user-widget-code-modal.component';

@Component({
  selector: 'app-advertisement',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule, MatDialogModule],
  templateUrl: './advertisement.component.html',
  styleUrl: '../styles/user-widget.scss',
})
export class AdvertisementComponent implements OnInit {
  widgetDetail: Widget | undefined;
  widgetFormGroup!: FormGroup;
  userWidgetList: Advertisement[] = [];
  widgetFormMode = FormMode.Add;
  imageFile: File | undefined;

  @ViewChild('widgetFormElement') widgetFormElement!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

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
      image: [null, Validators.required],
      color: ['#000000', [Validators.required]],
      backgroundColor: ['#000000', [Validators.required]],
      id: [''],
      properties: [null],
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

      // Max file size (5MB)
      const maxSize = 5 * 1024 * 1024;

      if (!allowedTypes.includes(file.type)) {
        this.notifyService.openSnackBar(
          'Invalid file type. Only JPG, JPEG, and PNG are allowed.'
        );
        return;
      }

      // Validate file size
      if (file.size > maxSize) {
        this.notifyService.openSnackBar(
          'File size exceeds 5MB. Please select a smaller file.'
        );
        return;
      }

      if (this.widgetFormMode === FormMode.Add) {
        this.widgetFormGroup.patchValue({ image: true });
      }

      this.widgetFormGroup.updateValueAndValidity();

      this.imageFile = file;
    }
  }

  getWidgetDetail() {
    this.widgetService.detail(WidgetType.Advertisement).subscribe((res) => {
      this.widgetDetail = res.data;
    });
  }

  listUserWidget() {
    this.service.list(WidgetType.Advertisement).subscribe((res) => {
      this.userWidgetList = res.data as Advertisement[];
    });
  }

  handleCreateWidget() {
    if (this.widgetFormGroup.invalid) return;
    const payload = {
      type: {
        id: this.widgetDetail?._id || '',
        name: WidgetType.Advertisement,
      },
      data: {
        title: this.widgetFormGroup.get('title')?.value,
        ...(this.widgetFormMode === FormMode.Edit && {
          image: this.widgetFormGroup.get('image')?.value,
        }),
        styles: {
          color: this.widgetFormGroup.get('color')?.value,
          bgColor: this.widgetFormGroup.get('backgroundColor')?.value,
        },
      },
      ...(this.widgetFormMode === FormMode.Edit && {
        properties: this.widgetFormGroup.get('properties')?.value,
      }),
    };

    if (this.widgetFormMode === FormMode.Add) {
      this.service.create(payload).subscribe((res) => {
        setTimeout(() => {
          this.handleUploadImage(res.widget.insertedId);
        });
      });
    } else {
      const widgetId = this.widgetFormGroup.get('id')?.value;
      this.service.edit(widgetId, payload).subscribe(() => {
        if (this.imageFile) {
          setTimeout(() => {
            this.handleEditImage();
          });
        } else {
          this.listUserWidget();
          this.handleCancelEditWidget();
          this.notifyService.openSnackBar(
            'Widget have been successfully edited.'
          );
        }
      });
    }
  }

  handleEditWidget(userWidget: Advertisement) {
    this.widgetFormMode = FormMode.Edit;
    this.widgetFormGroup.patchValue({
      title: userWidget.widget.data.title,
      image: {
        url: userWidget.widget.data.image.url,
        publicId: userWidget.widget.data.image.publicId,
      },
      color: userWidget.widget.data.styles.color,
      backgroundColor: userWidget.widget.data.styles.bgColor,
      id: userWidget._id,
      properties: userWidget.widget.properties,
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

  handleUploadImage(id: string) {
    const formData = new FormData();
    formData.append('file', this.imageFile || '');
    this.service.uploadImage(id, formData).subscribe(() => {
      this.initWidgetForm();
      this.listUserWidget();
      this.fileInput.nativeElement.value = '';
      this.notifyService.openSnackBar('Widget have been successfully created.');
    });
  }

  handleEditImage() {
    const id = this.widgetFormGroup.get('id')?.value;
    const formData = new FormData();
    formData.append('file', this.imageFile || '');
    this.service.editImage(id, formData).subscribe(() => {
      this.listUserWidget();
      this.handleCancelEditWidget();
      this.fileInput.nativeElement.value = '';
      this.imageFile = undefined;
      this.notifyService.openSnackBar('Widget have been successfully edited.');
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

  openCodeModal(userWidget: Advertisement) {
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
