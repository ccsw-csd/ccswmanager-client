import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { _ } from 'ag-grid-community';
import { DialogComponent } from 'src/app/core/dialog/dialog.component';
import { Usuario } from 'src/app/core/to/Usuario';
import { UserService } from '../users.service';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {

  dataUser !: boolean;
  usuario = {} as Usuario;
  usuarioCurrent = {} as Usuario;
  userForm !: FormGroup;
  allUsername !: string[];
  isloading !: boolean;
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  allCustomer : string [] = [];

  constructor(
    private formBuilder : FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    public dialogUser: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
    }

  ngOnInit(): void {

    this.getAllCustomer();
    if (this.data.user != null) {
      this.usuario = Object.assign({}, this.data.user);
      this.usuarioCurrent =  Object.assign({}, this.data.user);
      this.dataUser = true;
    }
    else
      this.dataUser = false;
  
    console.log(this.usuario);
    this.userForm = this.formBuilder.group({
      username : ['', [Validators.required, Validators.pattern(/^\S*$/), Validators.maxLength(10)]],
      name : [this.usuario.name],
      lastname : [this.usuario.name],
      rol : [this.usuario.role, Validators.required],
      customer : ['']
    })
  }

  getAllCustomer()
  {
    this.userService.getDistinctCustomer().subscribe(res =>{
      this.allCustomer = res.filter(item => item != null);
      this.usuario.customers = this.allCustomer;
      console.log(res);
    })
  }

  getUsernameErrors() : string
  {
    let messag = "";

    if(this.userForm.get('username')?.hasError('required'))
      messag = "Es un campo requerido";
    else if(this.userForm.get('username')?.hasError('pattern'))
      messag = "Introduce un usuario sin espacios en blanco.";
    else if(this.userForm.get('username')?.hasError('error'))
      messag = "El usuario que has introducido ya existe. Prueba con otro"; 
    else
      messag = "El usuarios debe tener como máximo 10 carácteres."; 
    
    return messag;
  }

  onSave()
  {
    
    if(!this.userForm.invalid)
    {
      if(this.usuario.username === this.usuarioCurrent.username && this.usuario.role.toUpperCase() === this.usuarioCurrent.role.toUpperCase())
      {
        this.onClose();
      }
      else
      {
        this.isloading = true;
        this.userService.saveUser(this.usuario).subscribe(res =>{
          this.isloading = false;
          if(res)
          {
            this.userForm.controls['username'].setErrors({'error': true});
          }
          else
            this.onClose();

        });
        
      }  
    }
  }

  onClose()
  {
    this.dialogRef.close();
  }

}

