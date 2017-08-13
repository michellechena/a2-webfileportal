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
var dropdown_config_1 = require("./dropdown-config");
/**
 * Transforms a node into a dropdown.
 */
var NgbDropdown = (function () {
    function NgbDropdown(config) {
        /**
         *  Defines whether or not the dropdown-menu is open initially.
         */
        this._open = false;
        /**
         *  An event fired when the dropdown is opened or closed.
         *  Event's payload equals whether dropdown is open.
         */
        this.openChange = new core_1.EventEmitter();
        this.up = config.up;
        this.autoClose = config.autoClose;
    }
    /**
     * Checks if the dropdown menu is open or not.
     */
    NgbDropdown.prototype.isOpen = function () { return this._open; };
    /**
     * Opens the dropdown menu of a given navbar or tabbed navigation.
     */
    NgbDropdown.prototype.open = function () {
        if (!this._open) {
            this._open = true;
            this.openChange.emit(true);
        }
    };
    /**
     * Closes the dropdown menu of a given navbar or tabbed navigation.
     */
    NgbDropdown.prototype.close = function () {
        if (this._open) {
            this._open = false;
            this.openChange.emit(false);
        }
    };
    /**
     * Toggles the dropdown menu of a given navbar or tabbed navigation.
     */
    NgbDropdown.prototype.toggle = function () {
        if (this.isOpen()) {
            this.close();
        }
        else {
            this.open();
        }
    };
    NgbDropdown.prototype.closeFromOutsideClick = function ($event) {
        if (this.autoClose && $event.button !== 2 && !this._isEventFromToggle($event)) {
            this.close();
        }
    };
    NgbDropdown.prototype.closeFromOutsideEsc = function () {
        if (this.autoClose) {
            this.close();
        }
    };
    Object.defineProperty(NgbDropdown.prototype, "toggleElement", {
        /**
         * @internal
         */
        set: function (toggleElement) { this._toggleElement = toggleElement; },
        enumerable: true,
        configurable: true
    });
    NgbDropdown.prototype._isEventFromToggle = function ($event) { return !!this._toggleElement && this._toggleElement.contains($event.target); };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], NgbDropdown.prototype, "up", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], NgbDropdown.prototype, "autoClose", void 0);
    __decorate([
        core_1.Input('open'),
        __metadata("design:type", Object)
    ], NgbDropdown.prototype, "_open", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], NgbDropdown.prototype, "openChange", void 0);
    NgbDropdown = __decorate([
        core_1.Directive({
            selector: '[ngbDropdown]',
            exportAs: 'ngbDropdown',
            host: {
                '[class.dropdown]': '!up',
                '[class.dropup]': 'up',
                '[class.show]': 'isOpen()',
                '(keyup.esc)': 'closeFromOutsideEsc()',
                '(document:click)': 'closeFromOutsideClick($event)'
            }
        }),
        __metadata("design:paramtypes", [dropdown_config_1.NgbDropdownConfig])
    ], NgbDropdown);
    return NgbDropdown;
}());
exports.NgbDropdown = NgbDropdown;
/**
 * Allows the dropdown to be toggled via click. This directive is optional.
 */
var NgbDropdownToggle = (function () {
    function NgbDropdownToggle(dropdown, elementRef) {
        this.dropdown = dropdown;
        dropdown.toggleElement = elementRef.nativeElement;
    }
    NgbDropdownToggle.prototype.toggleOpen = function () { this.dropdown.toggle(); };
    NgbDropdownToggle = __decorate([
        core_1.Directive({
            selector: '[ngbDropdownToggle]',
            host: {
                'class': 'dropdown-toggle',
                'aria-haspopup': 'true',
                '[attr.aria-expanded]': 'dropdown.isOpen()',
                '(click)': 'toggleOpen()'
            }
        }),
        __metadata("design:paramtypes", [NgbDropdown, core_1.ElementRef])
    ], NgbDropdownToggle);
    return NgbDropdownToggle;
}());
exports.NgbDropdownToggle = NgbDropdownToggle;
//# sourceMappingURL=dropdown.js.map