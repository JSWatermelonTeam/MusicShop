let adminController = (() => {
    function getAdminControllerSecretPage(ctx) {
        ctx.partial('./templates/admin/secret.hbs')
            .then(function () {
                $('.send-secret-btn').click(function (ev) {
                    let masterSecret = $('#master-secret').val();
                    sessionStorage.setItem('master-secret', masterSecret);
                });
            });
    }

    function getAdminHomePage(ctx) {
        ctx.isInAdminArea = sessionStorage.getItem('isAdmin');
        ctx.loadPartials({
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs'
        }).then(function()  {
            this.partial('./templates/admin/home.hbs');
        })
    }

    function getManageUsers(ctx) {
        ctx.isInAdminArea = sessionStorage.getItem('isAdmin');

        adminRequester.get('user', '')
            .then(function (usersData) {
                    ctx.users = usersData;
                    ctx.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs'
                    }).then(function()  {
                        this.partial('./templates/admin/users.hbs');
                    })
                }
            )
            .catch(authenticator.handleError);

    }

    function getSpecificUser(ctx) {
        let userId = ctx.params.id.substring(1);
        ctx.isInAdminArea = sessionStorage.getItem('isAdmin');
        adminRequester.get('user', userId)
            .then(function (userData) {
                ctx.user = userData;
                ctx.loadPartials({
                    header: './templates/common/header.hbs',
                    footer: './templates/common/footer.hbs'
                }).then(function()  {
                    this.partial('./templates/admin/specificUser.hbs');
                })
            })
            .catch(authenticator.handleError);
    }

    function lockUser(ctx) {
        let userId = ctx.params.id.substring(1);

        let data = {
            userId: userId,
            setLockdownStateTo: true
        };

        adminRequester.post('rpc', 'lockdown-user', data)
            .then(function (retrievedData) {
                ctx.redirect('#/users/:' + userId);
                authenticator.showInfo("User successfuly locked")
            })
            .catch(authenticator.handleError);
    }

    function unlockUser(ctx) {
        let userId = ctx.params.id.substring(1);

        let data = {
            userId: userId,
            setLockdownStateTo: true
        };

        adminRequester.post('rpc', 'lockdown-user', data)
            .then(function (retrievedData) {
                ctx.redirect('#/users/:' + userId);
                authenticator.showInfo("User successfuly unlocked")
            })
            .catch(authenticator.handleError);
    }

    return {
        getAdminControllerSecretPage,
        getAdminHomePage,
        getManageUsers,
        getSpecificUser,
        lockUser,
        unlockUser
    }
})();