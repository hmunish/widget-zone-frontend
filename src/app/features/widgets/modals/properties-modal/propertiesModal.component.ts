import { Component, Inject, OnInit } from '@angular/core';
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
import { UserWidgetPropertiesModalService } from '../../../../core/services/widgets/userWidgetPropertiesModal.service';

@Component({
  selector: 'app-propertiesModal',
  templateUrl: './propertiesModal.component.html',
  styleUrls: ['./propertiesModal.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, ReactiveFormsModule],
})
export class PropertiesModalComponent implements OnInit {
  propertyForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<PropertiesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PropertiesModalData,
    private fb: FormBuilder,
    private service: UserWidgetPropertiesModalService
  ) {
    this.propertyForm = this.fb.group({
      property: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/),
        ],
      ],
    });
  }

  ngOnInit(): void {
    if (!this.data.properties) {
      this.data.properties = [];
    }
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
    this.service.delete(this.data.widgetId, property).subscribe(() => {
      this.data.properties.splice(index, 1);
      this.data.refreshWidgetList();
    });
  }
}
