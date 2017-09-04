let homeController = (() => {
    function getHomePage(ctx) {
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


