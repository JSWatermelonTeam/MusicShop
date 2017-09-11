let accountController = (() => {

    function getRegisterPage(ctx) {
        ctx.loadPartials({
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs'
        }).then(function () {
            this.partial('./templates/register.hbs');
        })
    }

    function getLoginPage(ctx) {
        ctx.loadPartials({
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs'
        }).then(function () {
            this.partial('./templates/login.hbs');
        })
    }

    function getLoggedIn(ctx) {
        let username = ctx.params.username;
        let password = ctx.params.password;
        authenticator.login(username, password)
            .then(function (userInfo) {
                authenticator.saveSession(userInfo);
                authenticator.showInfo('Successfully logged in.');
                ctx.redirect("#/home");

            }).catch(authenticator.handleError);
    }

    function getRegistered(ctx) {
        let name = ctx.params.Name;
        let username = ctx.params.Username;
        let email = ctx.params.Email;
        let phoneNumber = ctx.params.PhoneNumber;
        let password = ctx.params.Password;
        let repeatedPass = ctx.params.ConfirmPassword;

        if (password !== repeatedPass) {
            authenticator.showError("Passwords don't match!");
            return;
        }

        authenticator.register(name, username, email, phoneNumber, password)
            .then(function (userInfo) {
                authenticator.saveSession(userInfo);
                authenticator.showInfo('Successfully registered.');
                ctx.redirect("#/home");
            }).catch(authenticator.handleError);
    }

    function logout(ctx) {
        authenticator.logout()
            .then(function () {
                authenticator.clearSession();
                ctx.redirect("#/home");
                authenticator.showInfo('Successfully logged out.');
            }).catch(authenticator.handleError);
    }

    function userProfile(ctx) {
        let userId = ctx.params.id.substring(1);
        requester.get('user', userId, 'kinvey')
            .then(loadSuccess)
            .catch(authenticator.handleError);

        function loadSuccess(user) {
            ctx.isLoggedIn = authenticator.isAuth();
            ctx.isAdmin = authenticator.isAdmin();
            ctx.username = sessionStorage.getItem("username");
            ctx.userId = sessionStorage.getItem("userId");

            ctx.user = user;
            ctx.isUserProfileOwner = true;

            if (ctx.userId !== ctx.user._id) {
                ctx.isUserProfileOwner = false;
            }
                console.log(ctx.isUserProfileOwner);
            console.log(ctx.userId);


            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial("./templates/userProfile.hbs")
            })
        }
    }
    function loadEditUserProfileView(ctx) {
        let userId = ctx.params.id.substring(1);
        requester.get("user", userId, "kinvey")
            .then(loadSuccess)
            .catch(authenticator.handleError);
        function loadSuccess(user) {
            ctx.user = user;
            ctx.isLoggedIn = authenticator.isAuth();
            ctx.isAdmin = authenticator.isAdmin();
            ctx.username = sessionStorage.getItem("username");
            ctx.userId = sessionStorage.getItem("userId");

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial("./templates/editUserProfile.hbs")
            })
        }
    }
    function editUserProfile(ctx) {
        let userId = ctx.params.id.substring(1);
        requester.get("user", userId, "kinvey")
            .then(loadSuccess)
            .catch(authenticator.handleError);
        function loadSuccess(user) {


            user.name = ctx.params.name;
            user.email = ctx.params.email;
            user.phoneNumber = ctx.params.phoneNumber;
            user.username = user.username;


            requester.update("user", userId, "kinvey", user)
                .then(editSuccess)
                .catch(authenticator.handleError);

            function editSuccess(userInfo) {
                console.log(userInfo);
                sessionStorage.clear();
                authenticator.saveSession(userInfo);
                ctx.redirect("#/viewAds");
                authenticator.showInfo(`${userInfo.username} profile successfully edited!`);
                console.log(userInfo);
            }

        }
    }

    return {
        getRegisterPage,
        getLoginPage,
        getLoggedIn,
        getRegistered,
        logout,
        userProfile,
        loadEditUserProfileView,
        editUserProfile
    }
})();


