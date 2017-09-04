let homeController = (() => {
    function getHome(ctx) {
        ctx.loadPartials({
            header: './templates/header.hbs',
            footer: './templates/footer.hbs'
        }).then(function()  {
            this.partial('./templates/home.hbs');
        })
    }

    return {
        
    getHome
    }
})();


