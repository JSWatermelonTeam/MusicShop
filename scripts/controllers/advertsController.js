let advertsController = (() => {
    function getNewAdPage(ctx) {
        ctx.isLoggedIn = authenticator.isAuth();
        ctx.isAdmin = authenticator.isAdmin();
        ctx.username = sessionStorage.getItem("username");
        ctx.loadPartials({
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs'
        }).then(function()  {
            this.partial('./templates/newAd.hbs');
        })
    }

    function createAdvert(ctx) {
        let newAd = {
            title: ctx.params.title,
            description: ctx.params.description,
            price: Number(ctx.params.price),
            imageUrl: ctx.params.image,
            datePublished: Date.now(),
            publisher: sessionStorage.getItem("username")
        };

        requester.post("appdata", "ads", "kinvey", newAd)
            .then(createSuccess)
            .catch(authenticator.handleError);

        function createSuccess() {
            ctx.redirect("#/viewAds");
            authenticator.showInfo("Advert created!");
        }
    }

    function loadAdverts(ctx) {
        requester.get("appdata", "ads", "kinvey")
            .then(loadSuccess)
            .catch(authenticator.handleError);

        function loadSuccess(adverts) {
            adverts.forEach(ad => ad.isPublishedByCurrentUser = ad.publisher === sessionStorage.getItem("username"));
            ctx.adverts = adverts;
            ctx.isLoggedIn = authenticator.isAuth();
            ctx.isAdmin = authenticator.isAdmin();
            ctx.username = sessionStorage.getItem("username");
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                adBox: "./templates/viewAds/adBox.hbs"
            }).then(function () {
                this.partial("./templates/viewAds/viewAds.hbs");
            });
        }
    }

    function deleteAdvert(ctx) {
        let advertID = ctx.params.id.substring(1);
        requester.remove("appdata", "ads/" + advertID, "kinvey")
            .then(deleteSuccess)
            .catch(authenticator.handleError);

        function deleteSuccess() {
            ctx.redirect("#/viewAds");
            authenticator.showInfo("Advert deleted!");
        }
    }

    function loadAdvertEditView(ctx) {
        let advertID = ctx.params.id.substring(1);
        requester.get("appdata", "ads/" + advertID, "kinvey")
            .then(loadSuccess)
            .catch(authenticator.handleError);

        function loadSuccess(advert) {
            advert.date = new Date(Number(advert.datePublished)).toDateString();
            ctx.advert = advert;
            ctx.isLoggedIn = authenticator.isAuth();
            ctx.isAdmin = authenticator.isAdmin();
            ctx.username = sessionStorage.getItem("username");

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial("./templates/editAd.hbs");
            });
        }
    }

    function editAdvert(ctx) {
        let advertID = ctx.params.id.substring(1);
        requester.get("appdata", "ads/" + advertID, "kinvey")
            .then(loadSuccess)
            .catch(authenticator.handleError);

        function loadSuccess(advert) {
            advert.title = ctx.params.title;
            advert.description = ctx.params.description;
            advert.price = Number(ctx.params.price);
            advert.imageUrl = ctx.params.image;

            requester.update("appdata", "ads/" + advertID, "kinvey", advert)
                .then(editSuccess)
                .catch(authenticator.handleError);

            function editSuccess() {
                ctx.redirect("#/viewAds");
                authenticator.showInfo("Advert successfully edited!");
            }
        }
    }
    function loadAdDetails(ctx) {
        let advertId = ctx.params.id.substring(1);


        requester.get("appdata", "ads/" + advertId, "kinvey")
            .then(loadSuccess)
            .catch(authenticator.handleError);

        function loadSuccess(advert) {
            advert.date = new Date(Number(advert.datePublished)).toDateString();
            ctx.advert = advert;


            ctx.isLoggedIn = authenticator.isAuth();
            ctx.isAdmin = authenticator.isAdmin();
            ctx.username = sessionStorage.getItem("username");

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial("./templates/viewAdDetails.hbs")
            })
        }
    }

    return {
        getNewAdPage,
        createAdvert,
        loadAdverts,
        loadAdvertEditView,
        deleteAdvert,
        editAdvert,
        loadAdDetails
    }
})();