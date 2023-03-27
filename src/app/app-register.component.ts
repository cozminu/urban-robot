import { Component, Inject, OnInit } from '@angular/core';
import { RegisterDialog } from './register-dialog';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
  FormBuilder,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './app-register.component.html',
  styleUrls: ['./app-register.component.css'],
})
export class AppRegisterComponent {
  registerForm: FormGroup<any>;
  fieldRequired: string = 'This field is required';
  pending = false;

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog) {
    let emailRegex: RegExp =
      /^(?:[1]{0,1}[2-9]{1}\d{9}|(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))$/;

    this.registerForm = this.formBuilder.group({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      username: new FormControl(null, [Validators.required]),
      emailOrNumber: new FormControl(null, [
        Validators.required,
        Validators.pattern(emailRegex),
      ]),
      password: new FormControl(null, [
        Validators.required,
        this.checkPassword,
      ]),
      confirmPassword: new FormControl(null, [this.checkPasswordConfirm(this)]),
      dob: new FormControl(null, [Validators.required]),
      gender: new FormControl(null, [Validators.required]),
      agree: new FormControl(null, [Validators.requiredTrue]),
    });
  }

  emailErrors() {
    return this.registerForm.get('email')?.hasError('required')
      ? 'This field is required'
      : this.registerForm.get('email')?.hasError('pattern')
      ? 'Not a valid email address'
      : '';
  }

  checkPassword(control: any) {
    let enteredPassword = control.value;
    let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/;
    return !passwordCheck.test(enteredPassword) && enteredPassword
      ? { requirements: true }
      : null;
  }

  checkPasswordConfirm(self: any) {
    return (control: any) => {
      let enteredPassword = self?.registerForm?.value?.password;
      let enteredPasswordConfirm = control.value;

      return enteredPasswordConfirm != enteredPassword
        ? { requirements: true }
        : null;
    };
  }

  getErrorPassword() {
    return this.registerForm.get('password')?.hasError('required')
      ? 'This field is required (The password must be at least six characters, one uppercase letter and one number)'
      : this.registerForm.get('password')?.hasError('requirements')
      ? 'Password needs to be at least six characters, one uppercase letter and one number'
      : '';
  }

  checkValidation(input: string) {
    const validation =
      this.registerForm.get(input)?.invalid &&
      (this.registerForm.get(input)?.dirty ||
        this.registerForm.get(input)?.touched);
    return validation;
  }

  async onSubmit(formData: FormGroup, formDirective: FormGroupDirective) {
    this.pending = true;

    await Promise.resolve(
      setTimeout(() => {
        this.pending = false;
        const dialogRef = this.dialog.open(RegisterDialog, {
          data: formData.value,
        });
        dialogRef.afterClosed().subscribe(() => {
          formDirective.resetForm();
          this.registerForm.reset();
        });
      }, 1000 + Math.random() * 1000)
    );
  }
}
