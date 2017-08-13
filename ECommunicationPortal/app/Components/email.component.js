"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
//import { Component } from "@angular/core";
var core_1 = require("@angular/core");
var email_service_1 = require("../Service/email.service");
var forms_1 = require("@angular/forms");
var ng2_bs3_modal_1 = require("ng2-bs3-modal/ng2-bs3-modal");
var global_1 = require("../Shared/global");
var EmailComponent = (function () {
    function EmailComponent(fb, _emailService) {
        this.fb = fb;
        this._emailService = _emailService;
        this.indLoading = false;
    }
    EmailComponent.prototype.ngOnInit = function () {
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
    };
    EmailComponent.prototype.LoadUserMailboxes = function () {
        var _this = this;
        this._emailService.get(global_1.Global.BASE_USER_ENDPOINT + "Email/GetAllUserMailboxes")
            .subscribe(function (UserMailboxes) { _this.UserMailboxes = UserMailboxes; }, function (error) { return _this.msg = error; });
    };
    EmailComponent.prototype.LoadMailboxesUserWise = function (UserMailboxesId) {
        var _this = this;
        console.log(UserMailboxesId);
        this.UserMailboxesId = UserMailboxesId;
        this._emailService.get(global_1.Global.BASE_USER_ENDPOINT + "Email/GetFolderByUserMailbox?UserMailboxId=" + UserMailboxesId)
            .subscribe(function (Userfolder) { _this.Userfolder = Userfolder; }, function (error) { return _this.msg = error; });
    };
    EmailComponent.prototype.LoadFolderWithDetails = function (UserMailboxesId) {
        var _this = this;
        this._emailService.get(global_1.Global.BASE_USER_ENDPOINT + "Email/GetFolderWithDetails?UserMailboxId=" + UserMailboxesId)
            .subscribe(function (UserfolderWithDetails) {
            _this.UserfolderWithDetails = UserfolderWithDetails;
            _this.UsermailboxList = UserfolderWithDetails[0].UsermailboxList;
            _this.UserFolderList = UserfolderWithDetails[0].UsermailboxList[0].UserFolderList;
        }, function (error) { return _this.msg = error; });
    };
    EmailComponent.prototype.GetUserFolderByMailboxes = function (UserMailboxesId) {
        var _this = this;
        this._emailService.get(global_1.Global.BASE_USER_ENDPOINT + "Email/GetUserFolder?UserMailboxId=" + UserMailboxesId)
            .subscribe(function (UserEmailFolderList) {
            _this.UserEmailFolderList = UserEmailFolderList;
        }, function (error) { return _this.msg = error; });
    };
    EmailComponent.prototype.GetFilesByFolder = function (folderId) {
        var _this = this;
        this.selectedItem = folderId;
        this._emailService.get(global_1.Global.BASE_USER_ENDPOINT + "Email/GetFilesByFolder?folderId=" + folderId)
            .subscribe(function (UserfilesDetails) {
            _this.UserfilesDetails = UserfilesDetails;
            console.log(JSON.stringify(UserfilesDetails));
        }, function (error) { return _this.msg = error; });
    };
    EmailComponent.prototype.MoveFilesToOtherFolder = function (FolderId) {
        var _this = this;
        for (var i = 0; i < this.UserfilesDetails.length; i++) {
            var files = this.UserfilesDetails.filter(function (x) { return x.IsSelect == true; })[i];
            if (files && files.IsSelect) {
                this._emailService.post(global_1.Global.BASE_USER_ENDPOINT + "Email/MoveFilesIntoFolder?FolderId=" + FolderId, files).subscribe(function (data) {
                    _this.msg = "Files moved successfully.";
                    _this.LoadUserMailboxes();
                    _this.LoadMailboxesUserWise(8);
                    _this.GetUserFolderByMailboxes(8);
                    _this.GetFilesByFolder(1);
                }, function (error) {
                    _this.msg = error;
                });
            }
            else {
                this.msg = "There is some issue in moving files, please contact to system administrator!";
            }
        }
    };
    EmailComponent.prototype.SetFilesToDisable = function () {
        var _this = this;
        for (var i = 0; i < this.UserfilesDetails.length; i++) {
            var files = this.UserfilesDetails.filter(function (x) { return x.IsSelect == true; })[i];
            if (files && files.IsSelect) {
                this._emailService.post(global_1.Global.BASE_USER_ENDPOINT + "Email/SetFilesToDisable?FilesId=" + files.FileId, files).subscribe(function (data) {
                    _this.msg = "Files disabled successfully.";
                    _this.LoadUserMailboxes();
                    _this.LoadMailboxesUserWise(8);
                    _this.GetUserFolderByMailboxes(8);
                    _this.GetFilesByFolder(1);
                }, function (error) {
                    _this.msg = error;
                });
            }
            else {
                this.msg = "There is some issue in disabling files, please contact to system administrator!";
            }
        }
    };
    EmailComponent.prototype.SetFilesToEnable = function () {
        var _this = this;
        for (var i = 0; i < this.UserfilesDetails.length; i++) {
            var files = this.UserfilesDetails.filter(function (x) { return x.IsSelect == true; })[i];
            if (files && files.IsSelect) {
                this._emailService.post(global_1.Global.BASE_USER_ENDPOINT + "Email/SetFilesToEnable?FilesId=" + files.FileId, files).subscribe(function (data) {
                    _this.msg = "Files enabled successfully.";
                    _this.LoadUserMailboxes();
                    _this.LoadMailboxesUserWise(8);
                    _this.GetUserFolderByMailboxes(8);
                    _this.GetFilesByFolder(1);
                }, function (error) {
                    _this.msg = error;
                });
            }
            else {
                this.msg = "There is some issue in enabling files, please contact to system administrator!";
            }
        }
    };
    EmailComponent.prototype.DeleteFiles = function () {
        var _this = this;
        for (var i = 0; i < this.UserfilesDetails.length; i++) {
            var files = this.UserfilesDetails.filter(function (x) { return x.IsSelect == true; })[i];
            if (files && files.IsSelect) {
                this._emailService.delete(global_1.Global.BASE_USER_ENDPOINT + "Email/", files.FileId).subscribe(function (data) {
                    _this.msg = "File has been deleted successfully.";
                    _this.LoadUserMailboxes();
                    _this.LoadMailboxesUserWise(8);
                    _this.GetUserFolderByMailboxes(8);
                    _this.GetFilesByFolder(1);
                }, function (error) {
                    _this.msg = error;
                });
            }
            else {
                this.msg = "There is some issue in deleting files, please contact to system administrator!";
            }
        }
    };
    EmailComponent.prototype.checkAll = function (ev) {
        this.UserfilesDetails.forEach(function (x) { return x.IsSelect = ev.target.checked; });
    };
    EmailComponent.prototype.isAllChecked = function () {
        return this.UserfilesDetails.every(function (_) { return _.IsSelect; });
    };
    __decorate([
        core_1.ViewChild('modal'),
        __metadata("design:type", ng2_bs3_modal_1.ModalComponent)
    ], EmailComponent.prototype, "modal", void 0);
    EmailComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/Components/email.component.html',
            styleUrls: ['app/Components/email.component.css'],
            providers: [email_service_1.EmailService]
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder, email_service_1.EmailService])
    ], EmailComponent);
    return EmailComponent;
}());
exports.EmailComponent = EmailComponent;
//# sourceMappingURL=email.component.js.map