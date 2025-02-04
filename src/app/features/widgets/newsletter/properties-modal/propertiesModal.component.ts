import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PropertiesModalData } from './propertiesModal.interface';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NewsletterPropertiesModalService } from '../../../../core/services/widgets/newsletterPropertiesModal.service';

@Component({
  selector: 'app-propertiesModal',
  templateUrl: './propertiesModal.component.html',
  styleUrls: ['./propertiesModal.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, ReactiveFormsModule],
})
export class PropertiesModalComponent {
  propertyForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<PropertiesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PropertiesModalData,
    private fb: FormBuilder,
    private service: NewsletterPropertiesModalService
  ) {
    this.propertyForm = this.fb.group({
      property: [
        '',
        [
          Validators.required,
          Validators.pattern(/^https?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/),
        ],
      ],
    });
  }

  close(): void {
    this.dialogRef.close(true);
  }

  handlePropertyFormSubmit() {
    if (this.propertyForm.valid) {
      this.service
        .add(this.data.widgetId, this.propertyForm.get('property')?.value)
        .subscribe(() => {
          this.data.properties.push();
          if (
            !this.data.properties.includes(
              this.propertyForm.get('property')?.value
            )
          ) {
            this.data.properties.push(this.propertyForm.get('property')?.value);
          }
          this.data.refreshWidgetList();
          this.propertyForm.reset();
        });
    }
  }

  handlePropertyDelete(property: string, index: number) {
    console.log('//////////////');
    this.service.delete(this.data.widgetId, property).subscribe(() => {
      this.data.properties.splice(index, 1);
      this.data.refreshWidgetList();
    });
  }
}
