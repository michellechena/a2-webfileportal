import { Component } from "@angular/core"
@Component({
    selector: "ecommunication-app",
    template: `
                <header class="main-header">                    
                        <nav class="navbar navbar-default">
                            <div class="navbar-header">
                                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#app-navigation" aria-expanded="false"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button>
                                <a href="#" class="logo large-screen"> <img src="Content/assest/images/emaillogo.png" alt="E-mail Communication"></a>
                                <a href="#" class="logo small-screen"> <img src="Content/assest/images/emaillogo.png" alt="E-mail Communication"></a>
                            </div>
                            <!-- Collect the nav links, forms, and other content for toggling -->
                            <div class="navbar-collapse collapse" role="navigation" aria-expanded="true" id="app-navigation">
                                <ul class="nav navbar-nav navbar-right">
                                 <!--  <li [class.active]="homeClicked" class='active'><a [routerLink]="['home']" (click)="setActiveTab('home')">Home</a></li>    
                                   <li><a [routerLink]="['user']">Users Management</a></li> [class.active]="emailClicked"-->
                                   <li class='active'><a [routerLink]="['email']" (click)="setActiveTab('email')">Home</a></li>
                                </ul>
                            </div>                            
                        </nav>                  
                </header>               
                        
                 <div class='container'>                         
                    <router-outlet></router-outlet>   
                </div>          
`
})

export class AppComponent {
    homeClicked = true;
    emailClicked = false;
    setActiveTab(val) {        
        if (val === 'home') {
            this.homeClicked = true;
            this.emailClicked = false;
        } else if (val === 'email') {
            this.homeClicked = false;
            this.emailClicked = true;
        }       
    }
}
