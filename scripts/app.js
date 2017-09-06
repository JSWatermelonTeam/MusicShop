$(() => {

    const app = Sammy('#mainContainer', function () {
        this.use('Handlebars', 'hbs');


        //TODO: CREATE DIFFERENT CONTROLLERS FOR DIFFERENT TYPES OF VIEWS!!!!
        //Example: not this.get('index.html', function(){...}); but: this.get('index.html', homeController.getWelcomePage);

        // Home & Default routes
        this.get('index.html', homeController.getHomePage);
        this.get('#/home', homeController.getHomePage);
        this.get('#/register', accountController.getRegisterPage);
        this.get('#/login', accountController.getLoginPage);
        this.post('#/login', accountController.getLoggedIn);
        this.get('#/logout', accountController.logout);
        this.post('#/register', accountController.getRegistered)
    });

    app.run();
});