let homeController = (() => {
    function getHomePage(ctx) {
        ctx.isLoggedIn = authenticator.isAuth();
        ctx.isAdmin = authenticator.isAdmin();
        ctx.username = sessionStorage.getItem("username");
        ctx.loadPartials({
            header: './templates/header.hbs',
            footer: './templates/footer.hbs'
        }).then(function()  {
            this.partial('./templates/home.hbs');
        })
    }

    return {

    getHomePage
    }
})();

