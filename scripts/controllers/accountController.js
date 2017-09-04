
let accountController = (() => {
    function getRegisterPage(ctx) {
        ctx.loadPartials({
            header: './templates/header.hbs',
            footer: './templates/footer.hbs'
        }).then(function()  {
            ctx.isAdmin = true; //FOR TESTNG
            ctx.isLoggedIn = false;
            this.partial('./templates/register.hbs');
        })
    }

    function getLoginPage(ctx) {
        ctx.loadPartials({
            header: './templates/header.hbs',
            footer: './templates/footer.hbs'
        }).then(function()  {

            this.partial('./templates/login.hbs');
        })
    }

    function getLoggedIn(ctx) {
        let username=ctx.params.username;
        let password=ctx.params.password;
        authenticator.login(username,password)
            .then(function (userInfo) {
                authenticator.saveSession(userInfo);
                homeController.getHomePage(ctx);

            }).catch(authenticator.handleError);
    }

    function getRegistered(ctx) {
        let name = ctx.params.Name;
        let username = ctx.params.Username;
        let email = ctx.params.Email;
        let phoneNumber = ctx.params.PhoneNumber;
        let password = ctx.params.Password;
        let repeatedPass = ctx.params.ConfirmPassword;

            authenticator.register(name, username, email, phoneNumber, password)
                .then(function (userInfo) {
                    authenticator.saveSession(userInfo);
                    homeController.getHomePage(ctx);
                    auth.showInfo('Successfully registered.');
                    homeController.getHomePage(ctx);

                }).catch(authenticator.handleError);
    }

    return {
        getRegisterPage,
        getLoginPage,
        getLoggedIn,
        getRegistered

    }
})();


