$(() => {

    const app = Sammy('#mainContainer', function () {
        this.use('Handlebars', 'hbs');


        //TODO: CREATE DIFFERENT CONTROLLERS FOR DIFFERENT TYPES OF VIEWS!!!!
        //Example: not this.get('index.html', function(){...}); but: this.get('index.html', homeController.getWelcomePage);

        // Home & Default routes
        this.get('index.html', function (ctx) {
            ctx.loadPartials({
                header: './templates/header.hbs',
                footer: './templates/footer.hbs'
            }).then(function()  {
                console.log('yes');
                ctx.isAdmin = true; //FOR TESTNG
                ctx.isLoggedIn = false;
                this.partial('./templates/home.hbs');
            })
        });
        this.get('#/home', homeController.getHomePage);
        this.get('#/register', accountController.getRegisterPage);
        this.get('#/login', accountController.getLoginPage);
        this.post('#/login', accountController.getLoggedIn);
    });

    app.run();
});