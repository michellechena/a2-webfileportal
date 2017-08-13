//import { Component } from "@angular/core";
import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { EmailService } from '../Service/email.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { IUserMailboxes } from '../Models/email';
import { IUserfolder } from '../Models/email';
import { IUserEmailFolderList } from '../Models/email';
import { IUserfolderWithDetails } from '../Models/email';
import { IUsermailboxList } from '../Models/email';
import { IUserFolderList } from '../Models/email';
import { IUserFileList } from '../Models/email';
import { IUserfiles } from '../Models/email';
import { IUserSelectedFiles } from '../Models/email';
import { DBOperation } from '../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../Shared/global';

@Component({
    templateUrl: 'app/Components/email.component.html',
    styleUrls: ['app/Components/email.component.css'],
    providers: [EmailService]
})

export class EmailComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    UserMailboxes: IUserMailboxes[];
    Userfolder: IUserfolder[];
    folder: IUserfolder;
    UsermailboxList: IUsermailboxList[];
    UserEmailFolderList: IUserEmailFolderList[];
    UserFolderList: IUserFolderList[];
    UserFileList: IUserFileList[];
    UserfolderWithDetails: IUserfolderWithDetails[];
    UserfilesDetails: IUserfiles[];
    UserMailboxesId: number;
    errorMessage: string;
    successMessage: string;
    selectedItem: number;
    indLoading: boolean = false;
    emailFrm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    MailboxId: number;
    UpdatedCheckboxValues: IUserSelectedFiles[];

    constructor(private fb: FormBuilder, private _emailService: EmailService) { }

    ngOnInit(): void {
        this.emailFrm = this.fb.group({
            FolderId: [''],
            MailboxId: [''],
            FolderName: ['', Validators.required],
            TypeId: [''],
            StatusId: ['']
        });
        this.LoadUserMailboxes();
    }
    LoadUserMailboxes(): void {
        this._emailService.get(Global.BASE_USER_ENDPOINT + "Email/GetAllUserMailboxes")
            .subscribe(UserMailboxes => {
                if (UserMailboxes.length !== undefined) {
                    this.UserMailboxes = UserMailboxes;
                    this.MailboxId = this.UserMailboxes[0].MailboxId;
                    this.LoadMailboxesUserWise(this.UserMailboxes[0].MailboxId);
                } else {
                    this.errorMessage = "There isn't any user mailboxes.";
                }
            },
            error => this.errorMessage = <any>error);
    }

    LoadMailboxesUserWise(UserMailboxesId: number): void {
        this.UserMailboxesId = UserMailboxesId;
        this._emailService.get(Global.BASE_USER_ENDPOINT + "Email/GetFolderByUserMailbox?UserMailboxId=" + UserMailboxesId)
            .subscribe(Userfolder => {
                if (Userfolder.length !== undefined) {
                    this.Userfolder = Userfolder;
                    this.GetUserFolderByMailboxes(UserMailboxesId);
                } else {
                    this.errorMessage = "There isn't any folder.";
                }
            },
            error => this.errorMessage = <any>error);
    }

    LoadFolderWithDetails(UserMailboxesId: number): void {
        this._emailService.get(Global.BASE_USER_ENDPOINT + "Email/GetFolderWithDetails?UserMailboxId=" + UserMailboxesId)
            .subscribe(UserfolderWithDetails => {
                if (UserfolderWithDetails.length !== undefined) {
                    this.UserfolderWithDetails = UserfolderWithDetails;
                    this.UsermailboxList = UserfolderWithDetails[0].UsermailboxList;
                    this.UserFolderList = UserfolderWithDetails[0].UsermailboxList[0].UserFolderList;
                } else {
                    this.UserfilesDetails = null;
                    this.errorMessage = "There isn't any details available.";
                }

            },
            error => this.errorMessage = <any>error);

    }

    GetUserFolderByMailboxes(UserMailboxesId: number) {
        this._emailService.get(Global.BASE_USER_ENDPOINT + "Email/GetUserFolder?UserMailboxId=" + UserMailboxesId)
            .subscribe(UserEmailFolderList => {
                if (UserEmailFolderList.length !== undefined) {
                    this.UserEmailFolderList = UserEmailFolderList;
                    if (UserEmailFolderList.length > 0) {
                        this.GetFilesByFolder(this.UserEmailFolderList[0].FolderId);
                    } else {
                        this.UserfilesDetails = null;
                        this.errorMessage = "There isn't any folder related to this mailbox.";
                    }
                } else {
                    this.errorMessage = "There isn't any folder related to this mailbox.";
                }
            },
            error => this.errorMessage = <any>error);
    }
    GetFilesByFolder(folderId: number) {
        this.selectedItem = folderId;
        this._emailService.get(Global.BASE_USER_ENDPOINT + "Email/GetFilesByFolder?folderId=" + folderId)
            .subscribe(UserfilesDetails => {
                if (UserfilesDetails.length !== undefined) {
                    this.UserfilesDetails = UserfilesDetails;
                } else {
                    this.UserfilesDetails = null;
                    this.errorMessage = "There isn't any files related to this mailbox folder.";
                }
            },
            error => this.errorMessage = <any>error);
    }
    MoveFilesToOtherFolder(FolderId: number) {
        var files = this.UserfilesDetails.filter(x => x.IsSelect == true);
        if (files != null) {
            this._emailService.post(Global.BASE_USER_ENDPOINT + "Email/MoveFilesIntoFolder?FolderId=" + FolderId, files).subscribe(
                data => {
                    this.successMessage = data;
                    this.LoadUserMailboxes();
                    this.MailboxId = this.MailboxId;
                },
                error => {
                    this.errorMessage = error;
                });
        } else {
            this.errorMessage = "There is some issue in moving files, please contact to system administrator!";
        }
    }
    onUsermailboxSelect(): void {
        this.successMessage = "";
        this.errorMessage = "";
        this.MailboxId = this.MailboxId;
        this.LoadMailboxesUserWise(this.MailboxId);
    }
    SetFilesToDisable() {
        var files = this.UserfilesDetails.filter(x => x.IsSelect == true);
        if (files != null) {
            this._emailService.post(Global.BASE_USER_ENDPOINT + "Email/SetFilesToDisable", files).subscribe(
                data => {
                    this.successMessage = data;
                    this.LoadUserMailboxes();
                },
                error => {
                    this.errorMessage = error;
                });
        } else {
            this.errorMessage = "There is some issue in disabling files, please contact to system administrator!";
        }
    }

    SetFilesToEnable() {
        var files = this.UserfilesDetails.filter(x => x.IsSelect == true);
        if (files != null) {
            this._emailService.post(Global.BASE_USER_ENDPOINT + "Email/SetFilesToEnable", files).subscribe(
                data => {
                    this.successMessage = data;
                    this.LoadUserMailboxes();
                },
                error => {
                    this.errorMessage = error;
                });
        } else {
            this.errorMessage = "There is some issue in enabling files, please contact to system administrator!";
        }
    }

    DeleteFiles() {
        var files = this.UserfilesDetails.filter(x => x.IsSelect == true);
        if (files) {
            this._emailService.post(Global.BASE_USER_ENDPOINT + "Email/DeleteFiles", files).subscribe(
                data => {
                    this.successMessage = data;
                    this.LoadUserMailboxes();
                },
                error => {
                    this.errorMessage = error;
                });
        } else {
            this.errorMessage = "There is some issue in deleting files, please contact to system administrator!";
        }
    }
    checkAll(ev) {
        this.UserfilesDetails.forEach(x => x.IsSelect = ev.target.checked)
    }

    isAllChecked() {
        return this.UserfilesDetails.every(_ => _.IsSelect);
    }
    addFolder() {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add New Folder";
        this.modalBtnTitle = "Add";
        this.emailFrm.reset();
        this.modal.open();
    }

    editFolder(FolderId: number) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Folder";
        this.modalBtnTitle = "Update";
        this.folder = this.Userfolder.filter(x => x.FolderId == FolderId)[0];
        this.emailFrm.setValue(this.folder);
        this.modal.open();
    }

    deleteFoler(FolderId: number) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(false);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.folder = this.Userfolder.filter(x => x.FolderId == FolderId)[0];
        this.emailFrm.setValue(this.folder);
        this.modal.open();    
    }

    SetControlsState(isEnable: boolean) {
        isEnable ? this.emailFrm.enable() : this.emailFrm.disable();
    }

    onSubmit(formData: any) {
        this.successMessage = "";
        this.errorMessage = "";
        switch (this.dbops) {
            case DBOperation.create:
                this._emailService.post(Global.BASE_USER_ENDPOINT + "Email/AddFolder", formData._value).subscribe(
                    data => {
                        this.successMessage = data;
                        this.LoadUserMailboxes();
                        this.modal.dismiss();
                    },
                    error => {
                        this.errorMessage = error;
                    }
                );
                break;
            case DBOperation.update:
                console.log(formData._value.FolderId, formData._value);
                this._emailService.put(Global.BASE_USER_ENDPOINT + "Email/", formData._value.FolderId, formData._value).subscribe(
                    data => {
                        this.successMessage = data;
                        this.LoadUserMailboxes();
                        this.modal.dismiss();
                    },
                    error => {
                        this.errorMessage = error;
                    }
                );
                break;
            case DBOperation.delete:
                this._emailService.delete(Global.BASE_USER_ENDPOINT + "Email/", formData._value.FolderId).subscribe(
                    data => {
                        this.successMessage = data;
                        this.modal.dismiss();
                        this.LoadUserMailboxes();
                    },
                    error => {
                        this.errorMessage = error;
                    }
                );
                break;
        }
    }
}