import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../Service/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { IUser } from '../Models/user';
import { DBOperation } from '../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../Shared/global';

@Component({
    templateUrl: 'app/Components/user.component.html',
    providers: [UserService]
})

export class UserComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    users: IUser[];
    user: IUser;
    msg: string;
    indLoading: boolean = false;
    userFrm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;

    constructor(private fb: FormBuilder, private _userService: UserService) { }

    ngOnInit(): void {
        console.log("UserComponent");
        this.userFrm = this.fb.group({
            UserId: [''],
            FirstName: ['', Validators.required],
            LastName: [''],
            Email: [''],
            IsActive:['']
        });

        this.LoadUsers();
    }

    LoadUsers(): void {
        this.indLoading = true;
        this._userService.get(Global.BASE_USER_ENDPOINT + "User")
            .subscribe(users => { this.users = users; this.indLoading = false; },
            error => this.msg = <any>error);

    }

    addUser() {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add New User";
        this.modalBtnTitle = "Add";
        this.userFrm.reset();
        this.modal.open();
    }

    editUser(UserId: number) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit User";
        this.modalBtnTitle = "Update";
        this.user = this.users.filter(x => x.UserId == UserId)[0];
        this.userFrm.setValue(this.user);
        this.modal.open();
    }

    deleteUser(UserId: number) {       
        this._userService.delete(Global.BASE_USER_ENDPOINT + "User/", UserId).subscribe(
            data => {
                this.msg = "Data successfully deleted.";
                this.modal.dismiss();
                this.LoadUsers();
            },
            error => {
                this.msg = error;
            }
        );
    }

    SetControlsState(isEnable: boolean) {
        isEnable ? this.userFrm.enable() : this.userFrm.disable();
    }

    onSubmit(formData: any) {
        this.msg = "";

        switch (this.dbops) {
            case DBOperation.create:
                this._userService.post(Global.BASE_USER_ENDPOINT + "User/", formData._value).subscribe(
                    data => {                       
                        this.msg = "Data successfully added.";
                        this.LoadUsers();                      
                        this.modal.dismiss();
                    },
                    error => {
                        this.msg = error;
                    }
                );
                break;
            case DBOperation.update:
                this._userService.put(Global.BASE_USER_ENDPOINT + "User/", formData._value.Id, formData._value).subscribe(
                    data => {                       
                        this.msg = "Data successfully updated.";
                        this.LoadUsers();                      
                        this.modal.dismiss();
                    },
                    error => {
                        this.msg = error;
                    }
                );
                break;
            case DBOperation.delete:
                this._userService.delete(Global.BASE_USER_ENDPOINT + "User/", formData._value.Id).subscribe(
                    data => {
                        this.msg = "Data successfully deleted.";
                        this.modal.dismiss();
                        this.LoadUsers();
                    },
                    error => {
                        this.msg = error;
                    }
                );
                break;
        }
    }
}

