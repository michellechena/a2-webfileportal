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
var core_1 = require("@angular/core");
var email_service_1 = require("../Service/email.service");
var forms_1 = require("@angular/forms");
var ng2_bs3_modal_1 = require("ng2-bs3-modal/ng2-bs3-modal");
var enum_1 = require("../Shared/enum");
var global_1 = require("../Shared/global");
var pager_service_1 = require("../Service/pager.service");
var EmailComponent = (function () {
    function EmailComponent(fb, _emailService, pagerService) {
        this.fb = fb;
        this._emailService = _emailService;
        this.pagerService = pagerService;
        this.indLoading = false;
        //pagedItems: any[];
        this.pager = {};
    }
    EmailComponent.prototype.ngOnInit = function () {
        this.emailFrm = this.fb.group({
            FolderId: [''],
            MailboxId: [''],
            FolderName: ['', forms_1.Validators.required],
            TypeId: [''],
            StatusId: ['']
        });
        this.LoadUserMailboxes();
    };
    EmailComponent.prototype.LoadUserMailboxes = function () {
        var _this = this;
        this._emailService.get(global_1.Global.BASE_USER_ENDPOINT + "Email/GetAllUserMailboxes")
            .subscribe(function (UserMailboxes) {
            if (UserMailboxes.length !== undefined) {
                _this.UserMailboxes = UserMailboxes;
                _this.MailboxId = _this.UserMailboxes[0].MailboxId;
                _this.UserMailboxesId = _this.UserMailboxes[0].MailboxId;
                _this.LoadMailboxesUserWise();
            }
            else {
                _this.errorMessage = "There isn't any user mailboxes.";
            }
        }, function (error) { return _this.errorMessage = error; });
    };
    EmailComponent.prototype.LoadMailboxesUserWise = function () {
        var _this = this;
        //this.UserMailboxesId = UserMailboxesId;
        this._emailService.get(global_1.Global.BASE_USER_ENDPOINT + "Email/GetFolderByUserMailbox?UserMailboxId=" + this.UserMailboxesId)
            .subscribe(function (Userfolder) {
            if (Userfolder.length !== undefined) {
                _this.Userfolder = Userfolder;
                //this.UserMailboxesId = UserMailboxesId;
                _this.searchUserFolder = '';
                _this.GetUserFolderByMailboxes();
            }
            else {
                _this.errorMessage = "There isn't any folder.";
            }
        }, function (error) { return _this.errorMessage = error; });
    };
    EmailComponent.prototype.LoadFolderWithDetails = function () {
        var _this = this;
        this._emailService.get(global_1.Global.BASE_USER_ENDPOINT + "Email/GetFolderWithDetails?UserMailboxId=" + this.UserMailboxesId)
            .subscribe(function (UserfolderWithDetails) {
            if (UserfolderWithDetails.length !== undefined) {
                _this.UserfolderWithDetails = UserfolderWithDetails;
                _this.UsermailboxList = UserfolderWithDetails[0].UsermailboxList;
                _this.UserFolderList = UserfolderWithDetails[0].UsermailboxList[0].UserFolderList;
            }
            else {
                _this.UserfilesDetails = null;
                _this.errorMessage = "There isn't any details available.";
            }
        }, function (error) { return _this.errorMessage = error; });
    };
    EmailComponent.prototype.GetUserFolderByMailboxes = function () {
        var _this = this;
        this._emailService.get(global_1.Global.BASE_USER_ENDPOINT + "Email/GetUserFolder?UserMailboxId=" + this.UserMailboxesId + "&searchUserFolder=" + this.searchUserFolder)
            .subscribe(function (UserEmailFolderList) {
            if (UserEmailFolderList.length !== undefined) {
                _this.UserEmailFolderList = UserEmailFolderList;
                if (UserEmailFolderList.length > 0) {
                    _this.GetFilesByFolder(_this.UserEmailFolderList[0].FolderId);
                }
                else {
                    _this.UserfilesDetails = null;
                    _this.errorMessage = "There isn't any folder related to this mailbox.";
                }
            }
            else {
                _this.errorMessage = "There isn't any folder related to this mailbox.";
            }
        }, function (error) { return _this.errorMessage = error; });
    };
    EmailComponent.prototype.SearchUserFolder = function () {
        var _this = this;
        this._emailService.get(global_1.Global.BASE_USER_ENDPOINT + "Email/GetUserFolder?UserMailboxId=" + this.UserMailboxesId + "&searchUserFolder=" + this.searchUserFolder)
            .subscribe(function (UserEmailFolderList) {
            if (UserEmailFolderList.length !== undefined) {
                _this.UserEmailFolderList = UserEmailFolderList;
                if (UserEmailFolderList.length > 0) {
                }
                else {
                    _this.UserfilesDetails = null;
                    _this.errorMessage = "There isn't any folder related to this mailbox.";
                }
            }
            else {
                _this.errorMessage = "There isn't any folder related to this mailbox.";
            }
        }, function (error) { return _this.errorMessage = error; });
    };
    EmailComponent.prototype.GetFilesByFolder = function (folderId) {
        var _this = this;
        this.selectedItem = folderId;
        console.log("call");
        this._emailService.get(global_1.Global.BASE_USER_ENDPOINT + "Email/GetFilesByFolder?folderId=" + folderId)
            .subscribe(function (UserAllfiles) {
            if (UserAllfiles.length !== undefined) {
                _this.UserAllfiles = UserAllfiles;
                _this.setPage(1);
            }
            else {
                _this.UserAllfiles = null;
                _this.UserfilesDetails = null;
                _this.errorMessage = "There isn't any files related to this mailbox folder.";
            }
        }, function (error) { return _this.errorMessage = error; });
    };
    EmailComponent.prototype.setPage = function (page) {
        if (this.UserAllfiles.length !== undefined) {
            this.pager = this.pagerService.getPager(this.UserAllfiles.length, page);
            this.UserfilesDetails = this.UserAllfiles.slice(this.pager.startIndex, this.pager.endIndex + 1);
        }
    };
    EmailComponent.prototype.MoveFilesToOtherFolder = function (FolderId) {
        var _this = this;
        var files = this.UserfilesDetails.filter(function (x) { return x.IsSelect == true; });
        if (files != null) {
            this._emailService.post(global_1.Global.BASE_USER_ENDPOINT + "Email/MoveFilesIntoFolder?FolderId=" + FolderId, files).subscribe(function (data) {
                _this.successMessage = data;
                _this.LoadUserMailboxes();
                _this.MailboxId = _this.MailboxId;
            }, function (error) {
                _this.errorMessage = error;
            });
        }
        else {
            this.errorMessage = "There is some issue in moving files, please contact to system administrator!";
        }
    };
    EmailComponent.prototype.onUsermailboxSelect = function () {
        this.successMessage = "";
        this.errorMessage = "";
        this.MailboxId = this.MailboxId;
        this.UserMailboxesId = this.MailboxId;
        this.LoadMailboxesUserWise();
    };
    EmailComponent.prototype.SetFilesToDisable = function () {
        var _this = this;
        var files = this.UserfilesDetails.filter(function (x) { return x.IsSelect == true; });
        if (files != null) {
            this._emailService.post(global_1.Global.BASE_USER_ENDPOINT + "Email/SetFilesToDisable", files).subscribe(function (data) {
                _this.successMessage = data;
                _this.LoadUserMailboxes();
            }, function (error) {
                _this.errorMessage = error;
            });
        }
        else {
            this.errorMessage = "There is some issue in disabling files, please contact to system administrator!";
        }
    };
    EmailComponent.prototype.SetFilesToEnable = function () {
        var _this = this;
        var files = this.UserfilesDetails.filter(function (x) { return x.IsSelect == true; });
        if (files != null) {
            this._emailService.post(global_1.Global.BASE_USER_ENDPOINT + "Email/SetFilesToEnable", files).subscribe(function (data) {
                _this.successMessage = data;
                _this.LoadUserMailboxes();
            }, function (error) {
                _this.errorMessage = error;
            });
        }
        else {
            this.errorMessage = "There is some issue in enabling files, please contact to system administrator!";
        }
    };
    EmailComponent.prototype.DeleteFiles = function () {
        var _this = this;
        var files = this.UserfilesDetails.filter(function (x) { return x.IsSelect == true; });
        if (files) {
            this._emailService.post(global_1.Global.BASE_USER_ENDPOINT + "Email/DeleteFiles", files).subscribe(function (data) {
                _this.successMessage = data;
                _this.LoadUserMailboxes();
            }, function (error) {
                _this.errorMessage = error;
            });
        }
        else {
            this.errorMessage = "There is some issue in deleting files, please contact to system administrator!";
        }
    };
    EmailComponent.prototype.checkAll = function (ev) {
        this.UserfilesDetails.forEach(function (x) { return x.IsSelect = ev.target.checked; });
    };
    EmailComponent.prototype.isAllChecked = function () {
        return this.UserfilesDetails.every(function (_) { return _.IsSelect; });
    };
    EmailComponent.prototype.addFolder = function () {
        this.dbops = enum_1.DBOperation.create;
        console.log(this.UserMailboxesId);
        this.SetControlsState(true);
        this.modalTitle = "Add New Folder";
        this.modalBtnTitle = "Add";
        this.ModelAddUsermailbox = null;
        this.ModelFoldername = null;
        this.ModelAddType = null;
        this.ModelAddStatus = null;
        this.ModelAddUsermailbox = this.UserMailboxesId;
        this.ModelAddType = 1;
        this.ModelAddStatus = 1;
        this.modal.open();
    };
    EmailComponent.prototype.editFolder = function (FolderId) {
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Folder";
        this.modalBtnTitle = "Update";
        this.folder = this.Userfolder.filter(function (x) { return x.FolderId == FolderId; })[0];
        this.emailFrm.setValue(this.folder);
        this.modal.open();
    };
    EmailComponent.prototype.deleteFoler = function (FolderId) {
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(false);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.folder = this.Userfolder.filter(function (x) { return x.FolderId == FolderId; })[0];
        this.emailFrm.setValue(this.folder);
        this.modal.open();
    };
    EmailComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.emailFrm.enable() : this.emailFrm.disable();
    };
    EmailComponent.prototype.onSubmit = function (formData) {
        var _this = this;
        this.successMessage = "";
        this.errorMessage = "";
        switch (this.dbops) {
            case enum_1.DBOperation.create:
                this._emailService.post(global_1.Global.BASE_USER_ENDPOINT + "Email/AddFolder", formData._value).subscribe(function (data) {
                    _this.successMessage = data;
                    //this.LoadUserMailboxes();
                    _this.LoadMailboxesUserWise();
                    _this.modal.dismiss();
                }, function (error) {
                    _this.errorMessage = error;
                });
                break;
            case enum_1.DBOperation.update:
                console.log(formData._value.FolderId, formData._value);
                this._emailService.put(global_1.Global.BASE_USER_ENDPOINT + "Email/", formData._value.FolderId, formData._value).subscribe(function (data) {
                    _this.successMessage = data;
                    //this.LoadUserMailboxes();
                    _this.LoadMailboxesUserWise();
                    _this.modal.dismiss();
                }, function (error) {
                    _this.errorMessage = error;
                });
                break;
            case enum_1.DBOperation.delete:
                this._emailService.delete(global_1.Global.BASE_USER_ENDPOINT + "Email/", formData._value.FolderId).subscribe(function (data) {
                    _this.successMessage = data;
                    _this.modal.dismiss();
                    //this.LoadUserMailboxes();
                    _this.LoadMailboxesUserWise();
                }, function (error) {
                    _this.errorMessage = error;
                });
                break;
        }
    };
    __decorate([
        core_1.ViewChild('modal'),
        __metadata("design:type", ng2_bs3_modal_1.ModalComponent)
    ], EmailComponent.prototype, "modal", void 0);
    EmailComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/Components/email.component.html',
            styleUrls: ['app/Components/email.component.css'],
            providers: [email_service_1.EmailService, pager_service_1.PagerService]
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder, email_service_1.EmailService, pager_service_1.PagerService])
    ], EmailComponent);
    return EmailComponent;
}());
exports.EmailComponent = EmailComponent;
//# sourceMappingURL=email.component.js.map