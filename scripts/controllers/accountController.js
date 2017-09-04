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

    return {
        getRegisterPage,
        getLoginPage
    }
})();


