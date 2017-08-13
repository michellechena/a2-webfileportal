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
    UsermailboxList: IUsermailboxList[];
    UserEmailFolderList: IUserEmailFolderList[];
    UserFolderList: IUserFolderList[];
    UserFileList: IUserFileList[];
    UserfolderWithDetails: IUserfolderWithDetails[];
    UserfilesDetails: IUserfiles[];
    UserMailboxesId: number;
    msg: string;
    selectedItem: number;
    indLoading: boolean = false;
    emailfrm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    UpdatedCheckboxValues: IUserSelectedFiles[];

    constructor(private fb: FormBuilder, private _emailService: EmailService) { }
    ngOnInit(): void {
        console.log("EmailComponent");
        this.emailfrm = this.fb.group({
            MailboxId: [''],
            UserMailBoxId: [''],
            UserId: [''],
            ShortName: [''],
            FullName: [''],
            IsMainContact: [''],
            IsDefaultMailbox: [''],
            StatusId: ['']
        });

        this.LoadUserMailboxes();
        this.LoadMailboxesUserWise(8);
        this.GetUserFolderByMailboxes(8);
        this.GetFilesByFolder(1);
        //this.LoadFolderWithDetails(8);
    }
    LoadUserMailboxes(): void {
        this._emailService.get(Global.BASE_USER_ENDPOINT + "Email/GetAllUserMailboxes")
            .subscribe(UserMailboxes => { this.UserMailboxes = UserMailboxes; },
            error => this.msg = <any>error);

    }

    LoadMailboxesUserWise(UserMailboxesId: number): void {
        console.log(UserMailboxesId);
        this.UserMailboxesId = UserMailboxesId;
        this._emailService.get(Global.BASE_USER_ENDPOINT + "Email/GetFolderByUserMailbox?UserMailboxId=" + UserMailboxesId)
            .subscribe(Userfolder => { this.Userfolder = Userfolder; },
            error => this.msg = <any>error);

    }

    LoadFolderWithDetails(UserMailboxesId: number): void {
        this._emailService.get(Global.BASE_USER_ENDPOINT + "Email/GetFolderWithDetails?UserMailboxId=" + UserMailboxesId)
            .subscribe(UserfolderWithDetails => {
                this.UserfolderWithDetails = UserfolderWithDetails;
                this.UsermailboxList = UserfolderWithDetails[0].UsermailboxList;
                this.UserFolderList = UserfolderWithDetails[0].UsermailboxList[0].UserFolderList;
            },
            error => this.msg = <any>error);

    }

    GetUserFolderByMailboxes(UserMailboxesId: number) {
        this._emailService.get(Global.BASE_USER_ENDPOINT + "Email/GetUserFolder?UserMailboxId=" + UserMailboxesId)
            .subscribe(UserEmailFolderList => {
                this.UserEmailFolderList = UserEmailFolderList;
            },
            error => this.msg = <any>error);
    }
    GetFilesByFolder(folderId: number) {
        this.selectedItem = folderId;
        this._emailService.get(Global.BASE_USER_ENDPOINT + "Email/GetFilesByFolder?folderId=" + folderId)
            .subscribe(UserfilesDetails => {
                this.UserfilesDetails = UserfilesDetails;
                console.log(JSON.stringify(UserfilesDetails));
            },
            error => this.msg = <any>error);
    }
    MoveFilesToOtherFolder(FolderId: number) {
        for (var i = 0; i < this.UserfilesDetails.length; i++) {
            var files = this.UserfilesDetails.filter(x => x.IsSelect == true)[i];
            if (files && files.IsSelect) {
                this._emailService.post(Global.BASE_USER_ENDPOINT + "Email/MoveFilesIntoFolder?FolderId=" + FolderId, files).subscribe(
                    data => {
                        this.msg = "Files moved successfully.";
                        this.LoadUserMailboxes();
                        this.LoadMailboxesUserWise(8);
                        this.GetUserFolderByMailboxes(8);
                        this.GetFilesByFolder(1);
                    },
                    error => {
                        this.msg = error;
                    });
            } else {
                this.msg = "There is some issue in moving files, please contact to system administrator!";
            }
        }
    }

    SetFilesToDisable() {
        for (var i = 0; i < this.UserfilesDetails.length; i++) {
            var files = this.UserfilesDetails.filter(x => x.IsSelect == true)[i];
            if (files && files.IsSelect) {
                this._emailService.post(Global.BASE_USER_ENDPOINT + "Email/SetFilesToDisable?FilesId=" + files.FileId, files).subscribe(
                    data => {
                        this.msg = "Files disabled successfully.";
                        this.LoadUserMailboxes();
                        this.LoadMailboxesUserWise(8);
                        this.GetUserFolderByMailboxes(8);
                        this.GetFilesByFolder(1);
                    },
                    error => {
                        this.msg = error;
                    });
            } else {
                this.msg = "There is some issue in disabling files, please contact to system administrator!";
            }
        }
    }

    SetFilesToEnable() {
        for (var i = 0; i < this.UserfilesDetails.length; i++) {
            var files = this.UserfilesDetails.filter(x => x.IsSelect == true)[i];
            if (files && files.IsSelect) {
                this._emailService.post(Global.BASE_USER_ENDPOINT + "Email/SetFilesToEnable?FilesId=" + files.FileId, files).subscribe(
                    data => {
                        this.msg = "Files enabled successfully.";
                        this.LoadUserMailboxes();
                        this.LoadMailboxesUserWise(8);
                        this.GetUserFolderByMailboxes(8);
                        this.GetFilesByFolder(1);
                    },
                    error => {
                        this.msg = error;
                    });
            } else {
                this.msg = "There is some issue in enabling files, please contact to system administrator!";
            }
        }
    }

    DeleteFiles() {
        for (var i = 0; i < this.UserfilesDetails.length; i++) {
            var files = this.UserfilesDetails.filter(x => x.IsSelect == true)[i];
            if (files && files.IsSelect) {
                this._emailService.delete(Global.BASE_USER_ENDPOINT + "Email/", files.FileId).subscribe(
                    data => {
                        this.msg = "File has been deleted successfully.";
                        this.LoadUserMailboxes();
                        this.LoadMailboxesUserWise(8);
                        this.GetUserFolderByMailboxes(8);
                        this.GetFilesByFolder(1);
                    },
                    error => {
                        this.msg = error;
                    });
            } else {
                this.msg = "There is some issue in deleting files, please contact to system administrator!";
            }
        }
    }
    checkAll(ev) {
        this.UserfilesDetails.forEach(x => x.IsSelect = ev.target.checked)
    }

    isAllChecked() {
        return this.UserfilesDetails.every(_ => _.IsSelect);
    }
}