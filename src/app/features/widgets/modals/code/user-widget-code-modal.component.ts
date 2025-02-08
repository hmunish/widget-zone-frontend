import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-user-widget-code-modal',
  templateUrl: './user-widget-code-modal.component.html',
  styleUrls: ['./user-widget-code-modal.component.scss'],
  standalone: true,
})
export class UserWidgetCodeModalComponent {
  constructor(
    public dialogRef: MatDialogRef<UserWidgetCodeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { code: string },
    private notifyService: NotificationService
  ) {}

  close(): void {
    this.dialogRef.close(true);
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.data.code).then(() => {
      this.notifyService.openSnackBar(
        'Successfully copied! Use Ctrl + V to paste.'
      );
    });
  }
}
