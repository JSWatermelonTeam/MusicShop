$(() => {

    const app = Sammy('#mainContainer', function () {
        this.use('Handlebars', 'hbs');


        //TODO: CREATE DIFFERENT CONTROLLERS FOR DIFFERENT TYPES OF VIEWS!!!!
        //Example: not this.get('index.html', function(){...}); but: this.get('index.html', homeController.getWelcomePage);

        // Home & Default routes
        this.get('index.html', homeController.getHomePage);
        this.get('#/home', homeController.getHomePage);

        this.get('#/register', accountController.getRegisterPage);
        this.post('#/register', accountController.getRegistered);

        this.get('#/login', accountController.getLoginPage);
        this.post('#/login', accountController.getLoggedIn);

        this.get('#/logout', accountController.logout);

        this.get('#/newAd', advertsController.getNewAdPage);
        this.post("#/newAd", advertsController.createAdvert);

        this.get("#/viewAds", advertsController.loadAdverts);

        this.get("#/editAd/:id", advertsController.loadAdvertEditView);
        this.post("#/editAd/:id", advertsController.editAdvert);

        this.get("#/deleteAd/:id", advertsController.deleteAdvert);
    });

    app.run();
});