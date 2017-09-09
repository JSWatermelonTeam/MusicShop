let messagesController =  (() => {
    function getMessagesPage(ctx) {
        ctx.isLoggedIn = authenticator.isAuth();
        ctx.isAdmin = authenticator.isAdmin();
        ctx.username = sessionStorage.getItem("username");
        ctx.loadPartials({
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs'
        }).then(function()  {
            this.partial('./templates/messages/messages.hbs');
        });
    }

    function getComposeMessagePage(ctx) {
        let recieverId = ctx.params.id.substring(1);

        ctx.recieverId = recieverId;
        ctx.isLoggedIn = authenticator.isAuth();
        ctx.isAdmin = authenticator.isAdmin();
        ctx.username = sessionStorage.getItem("username");
        ctx.loadPartials({
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs'
        }).then(function()  {
            this.partial('./templates/messages/composeMessage.hbs');
        });
    }

    function sendMessage(ctx) {
        let recieverId = ctx.params.id.substring(1);

        let message = {
            topic: ctx.params.topic,
            description: ctx.params.description,
            senderId: sessionStorage.getItem("userId"),
            recieverId: recieverId,
            datePosted: Date.now()
        };

        ctx.recieverId = recieverId;
        ctx.isLoggedIn = authenticator.isAuth();
        ctx.isAdmin = authenticator.isAdmin();
        ctx.username = sessionStorage.getItem("username");

        requester.post("appdata", "messages", "kinvey", message)
            .then(createSuccess)
            .catch(authenticator.handleError);

        function createSuccess() {
            ctx.redirect("#/messages");
            authenticator.showInfo("Message sent!");
        }
    }

    function getRecievedMessages(ctx) {
        ctx.isLoggedIn = authenticator.isAuth();
        ctx.isAdmin = authenticator.isAdmin();
        ctx.username = sessionStorage.getItem("username");
        ctx.showingRecieved = true;

        loadSentOrRecievedMessages(ctx, "reciever");
    }

    function getSentMessages(ctx) {
        ctx.isLoggedIn = authenticator.isAuth();
        ctx.isAdmin = authenticator.isAdmin();
        ctx.username = sessionStorage.getItem("username");

        loadSentOrRecievedMessages(ctx, "sender");
    }

    function loadSentOrRecievedMessages(ctx, type) {
        let typeId = type + "Id";

        let endPoint = `messages?query={"${typeId}":"${sessionStorage.getItem("userId")}"}`;
        requester.get("appdata", endPoint, "kinvey")
            .then(loadSuccess)
            .catch(authenticator.handleError);

        function loadSuccess(data) {
            ctx.messageHasPartial = true;
            data.forEach(msg => {
                let nameTypeNeeded = '';
                if (typeId === "senderId"){
                    nameTypeNeeded = "recieverId";
                } else {
                    nameTypeNeeded = "senderId";
                }

                requester.get('user', msg[nameTypeNeeded], "kinvey").then(function (userInfo) {
                        msg.name = userInfo.name;
                    }
                )
            });

            // ADDED NAME TO ALL OF THE MESSAGE OBJECT BUT THEY DONT SHOW UP IN THE TEMPLATE
            //NOT WORKING PROBABLY BECAUSE OF ASYNCHRONOUS THINGS, WILL FIX IT BY JUST ADDING THE NAMES AS COLUMNS IN KINVEY
            //shows in console.log tho
            console.log(data);

            ctx.messages = data;

            ctx.loadPartials({
                    header: './templates/common/header.hbs',
                    footer: './templates/common/footer.hbs',
                    messagesTable: './templates/messages/messagesTable.hbs',
                    shortRowMessage: "./templates/messages/shortRowMessage.hbs"
                }).then(function () {
                this.partial("./templates/messages/messages.hbs");
            });
        }
    }

    function loadDetailedMessagePage(ctx) {
        ctx.isLoggedIn = authenticator.isAuth();
        ctx.isAdmin = authenticator.isAdmin();
        ctx.username = sessionStorage.getItem("username");

        let msgId = ctx.params.id.substring(1);

        requester.get('appdata', "messages/" + msgId, 'kinvey')
            .then(loadSuccess).catch(authenticator.handleError);

        function loadSuccess(msgData) {
            console.log(msgData)
            ctx.date = new Date(Number(msgData.datePosted)).toDateString();
            ctx.topic = msgData.topic;
            ctx.description = msgData.description;
            //WILL WORK AFTER WE ADD COLUMNS IN KINVEY
            ctx.senderName = msgData.senderName;
            ctx.recieverName = msgData.recieverName;
            ctx.senderId = msgData.senderId;
            ctx.recieverId = msgData.recieverId;
            let remessageId = '';
            if(msgData.senderId === sessionStorage.getItem('userId')){
                remessageId = msgData.recieverId;
            } else {
                remessageId = msgData.senderId;
            }

            ctx.remessageId = remessageId;

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial("./templates/messages/detailedMessage.hbs");
            });
        }
    }


    return { getMessagesPage, getComposeMessagePage, sendMessage, getSentMessages, getRecievedMessages, loadDetailedMessagePage }
})();