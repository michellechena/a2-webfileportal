import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../Service/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { IUser } from '../Models/user';
import { DBOperation } from '../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../Shared/global';
import { Http } from "@angular/http";
import { PagerService } from '../Service/pager.service';

@Component({
    templateUrl: 'app/Components/user.component.html',
    providers: [UserService, PagerService]
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

    //public filterQuery = "";
    //public rowsOnPage = 10;
    //public activePage = 1;
    //public sortBy = "FirstName";
    //public sortOrder = "asc";
    //public itemsTotal = 0;
    private allItems: any[];
    pager: any = {};
    pagedItems: any[];

    constructor(private fb: FormBuilder, private _userService: UserService, private pagerService: PagerService) { }

    ngOnInit(): void {
        this.userFrm = this.fb.group({
            UserId: [''],
            FirstName: ['', Validators.required],
            LastName: [''],
            Email: [''],
            IsActive: ['']
        });

        this.LoadUsers();
    }

    public toInt(num: string) {
        return +num;
    }

    public sortByWordLength = (a: any) => {
        return a.UserId.length;
    }

    //public remove(item) {
    //    let index = this.users.indexOf(item);
    //    if (index > -1) {
    //        this.users.splice(index, 1);
    //    }
    //}
    //public onSortOrder(event) {
    //    this.LoadUsers();
    //}

    //public onPageChange(event) {
    //    this.rowsOnPage = event.rowsOnPage;
    //    this.activePage = event.activePage;
    //    this.LoadUsers();
    //}
    LoadUsers(): void {
        this.indLoading = true;
        this._userService.get(Global.BASE_USER_ENDPOINT + "User")
            .subscribe(users => {
                this.allItems = users; this.indLoading = false;
                this.setPage(1);
            },
            error => this.msg = <any>error);
    }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this.pagerService.getPager(this.allItems.length, page, 7);
        this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
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
        this.user = this.pagedItems.filter(x => x.UserId == UserId)[0];
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

