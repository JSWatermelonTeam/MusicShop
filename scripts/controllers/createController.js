let createController = (() => {
    function getNewAdPage(ctx) {
        ctx.isLoggedIn = authenticator.isAuth();
        ctx.isAdmin = authenticator.isAdmin();
        ctx.username = sessionStorage.getItem("username");
        ctx.loadPartials({
            header: './templates/header.hbs',
            footer: './templates/footer.hbs'
        }).then(function()  {
            this.partial('./templates/newAd.hbs');
        })
    }
    return {
        getNewAdPage
    }
})();