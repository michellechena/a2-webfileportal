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
var user_service_1 = require("../Service/user.service");
var forms_1 = require("@angular/forms");
var ng2_bs3_modal_1 = require("ng2-bs3-modal/ng2-bs3-modal");
var enum_1 = require("../Shared/enum");
var global_1 = require("../Shared/global");
var pager_service_1 = require("../Service/pager.service");
var UserComponent = (function () {
    function UserComponent(fb, _userService, pagerService) {
        this.fb = fb;
        this._userService = _userService;
        this.pagerService = pagerService;
        this.indLoading = false;
        this.pager = {};
        this.sortByWordLength = function (a) {
            return a.UserId.length;
        };
    }
    UserComponent.prototype.ngOnInit = function () {
        this.userFrm = this.fb.group({
            UserId: [''],
            FirstName: ['', forms_1.Validators.required],
            LastName: [''],
            Email: [''],
            IsActive: ['']
        });
        this.LoadUsers();
    };
    UserComponent.prototype.toInt = function (num) {
        return +num;
    };
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
    UserComponent.prototype.LoadUsers = function () {
        var _this = this;
        this.indLoading = true;
        this._userService.get(global_1.Global.BASE_USER_ENDPOINT + "User")
            .subscribe(function (users) {
            _this.allItems = users;
            _this.indLoading = false;
            _this.setPage(1);
        }, function (error) { return _this.msg = error; });
    };
    UserComponent.prototype.setPage = function (page) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this.pagerService.getPager(this.allItems.length, page, 7);
        this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    };
    UserComponent.prototype.addUser = function () {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add New User";
        this.modalBtnTitle = "Add";
        this.userFrm.reset();
        this.modal.open();
    };
    UserComponent.prototype.editUser = function (UserId) {
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit User";
        this.modalBtnTitle = "Update";
        this.user = this.pagedItems.filter(function (x) { return x.UserId == UserId; })[0];
        this.userFrm.setValue(this.user);
        this.modal.open();
    };
    UserComponent.prototype.deleteUser = function (UserId) {
        var _this = this;
        this._userService.delete(global_1.Global.BASE_USER_ENDPOINT + "User/", UserId).subscribe(function (data) {
            _this.msg = "Data successfully deleted.";
            _this.modal.dismiss();
            _this.LoadUsers();
        }, function (error) {
            _this.msg = error;
        });
    };
    UserComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.userFrm.enable() : this.userFrm.disable();
    };
    UserComponent.prototype.onSubmit = function (formData) {
        var _this = this;
        this.msg = "";
        switch (this.dbops) {
            case enum_1.DBOperation.create:
                this._userService.post(global_1.Global.BASE_USER_ENDPOINT + "User/", formData._value).subscribe(function (data) {
                    _this.msg = "Data successfully added.";
                    _this.LoadUsers();
                    _this.modal.dismiss();
                }, function (error) {
                    _this.msg = error;
                });
                break;
            case enum_1.DBOperation.update:
                this._userService.put(global_1.Global.BASE_USER_ENDPOINT + "User/", formData._value.Id, formData._value).subscribe(function (data) {
                    _this.msg = "Data successfully updated.";
                    _this.LoadUsers();
                    _this.modal.dismiss();
                }, function (error) {
                    _this.msg = error;
                });
                break;
            case enum_1.DBOperation.delete:
                this._userService.delete(global_1.Global.BASE_USER_ENDPOINT + "User/", formData._value.Id).subscribe(function (data) {
                    _this.msg = "Data successfully deleted.";
                    _this.modal.dismiss();
                    _this.LoadUsers();
                }, function (error) {
                    _this.msg = error;
                });
                break;
        }
    };
    __decorate([
        core_1.ViewChild('modal'),
        __metadata("design:type", ng2_bs3_modal_1.ModalComponent)
    ], UserComponent.prototype, "modal", void 0);
    UserComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/Components/user.component.html',
            providers: [user_service_1.UserService, pager_service_1.PagerService]
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder, user_service_1.UserService, pager_service_1.PagerService])
    ], UserComponent);
    return UserComponent;
}());
exports.UserComponent = UserComponent;
//# sourceMappingURL=user.component.js.map