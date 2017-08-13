"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var AppComponent = (function () {
    function AppComponent() {
        this.homeClicked = true;
        this.emailClicked = false;
    }
    AppComponent.prototype.setActiveTab = function (val) {
        if (val === 'home') {
            this.homeClicked = true;
            this.emailClicked = false;
        }
        else if (val === 'email') {
            this.homeClicked = false;
            this.emailClicked = true;
        }
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: "ecommunication-app",
            template: "\n                <header class=\"main-header\">                    \n                        <nav class=\"navbar navbar-default\">\n                            <div class=\"navbar-header\">\n                                <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#app-navigation\" aria-expanded=\"false\"> <span class=\"sr-only\">Toggle navigation</span> <span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span> </button>\n                                <a href=\"#\" class=\"logo large-screen\"> <img src=\"Content/assest/images/emaillogo.png\" alt=\"E-mail Communication\"></a>\n                                <a href=\"#\" class=\"logo small-screen\"> <img src=\"Content/assest/images/emaillogo.png\" alt=\"E-mail Communication\"></a>\n                            </div>\n                            <!-- Collect the nav links, forms, and other content for toggling -->\n                            <div class=\"navbar-collapse collapse\" role=\"navigation\" aria-expanded=\"true\" id=\"app-navigation\">\n                                <ul class=\"nav navbar-nav navbar-right\">\n                                   <li [class.active]=\"homeClicked\" class='active'><a [routerLink]=\"['home']\" (click)=\"setActiveTab('home')\">Home</a></li>    \n                                   <li><a [routerLink]=\"['user']\">Users Management</a></li> \n                                   <li [class.active]=\"emailClicked\"><a [routerLink]=\"['email']\" (click)=\"setActiveTab('email')\">Email Management</a></li>\n                                </ul>\n                            </div>                            \n                        </nav>                  \n                </header>               \n                        \n                 <div class='container'>                         \n                    <router-outlet></router-outlet>   \n                </div>          \n"
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map