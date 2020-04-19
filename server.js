const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cookieParser = require('cookie-parser')


app.use(express.static(__dirname + '/script'));
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/img'));
app.use(express.static(__dirname + '/music'));

app.use(cookieParser())


app.get('/', (req, res)=> {

    res.sendFile(__dirname + '/vue/waiting.html');

});

app.get('/champSelect', (req, res) => {

    res.sendFile(__dirname + '/vue/champSelect.html');

});


//Liste des comptes en attentes
let accountCreated = [];



io.on('connection', (socket) => {

    // -----------------Waiting Side ---------------------

    socket.emit('listAccount', accountCreated);



    socket.on('disconnect', () => {
        const index = accountCreated.findIndex(element => element.pseudo === socket.pseudo);

        if(index > 0) {
            accountCreated.splice(index, 1);
            socket.broadcast.emit('listAccount', accountCreated);
        }

    });
    

    socket.on('pseudo', (content) => {

        let check = _checkTeam();

        if(check === 0){

            socket.pseudo = content.pseudo; //STOCKAGE SOCKET PSEUDO
            socket.team = content.team; // STOCKAGE SOCKET TEAM

            accountCreated.push({pseudo: content.pseudo, team: content.team}); //AJOUT DANS LISTE DES JOUEURS EN ATTENTE


            socket.emit('listAccount', accountCreated);
            socket.broadcast.emit('listAccount', accountCreated);

            socket.emit('saveSession', {pseudo: socket.pseudo, team: socket.team, allAccount: accountCreated});


        }

        else if(check === 1 && content.team === 'Red Side') {

            socket.pseudo = content.pseudo; //STOCKAGE SOCKET PSEUDO
            socket.team = content.team; // STOCKAGE SOCKET TEAM

            accountCreated.push({pseudo: content.pseudo, team: content.team}); //AJOUT DANS LISTE DES JOUEURS EN ATTENTE


            socket.emit('listAccount', accountCreated);
            socket.broadcast.emit('listAccount', accountCreated);

            socket.emit('saveSession', {pseudo: socket.pseudo, team: socket.team, allAccount: accountCreated});

        }
        
        else if(check === 2 && content.team === 'Blue Side'){

            socket.pseudo = content.pseudo; //STOCKAGE SOCKET PSEUDO
            socket.team = content.team; // STOCKAGE SOCKET TEAM

            accountCreated.push({pseudo: content.pseudo, team: content.team}); //AJOUT DANS LISTE DES JOUEURS EN ATTENTE


            socket.emit('listAccount', accountCreated);
            socket.broadcast.emit('listAccount', accountCreated);

            socket.emit('saveSession', {pseudo: socket.pseudo, team: socket.team, allAccount: accountCreated});

        }

        else{
            socket.emit('errorTeam', 'Equipe selectionnee en surnombre');
        }
       

    });

    // -----------------CHAMPION SELECTION ---------------------
    

    socket.emit('champSelect');

    socket.on('launchSelection', (players, listL, listR) => {
        
        const nbL = listL.length;
        const nbR = listR.length;
        let allL = 0;
        let allR = 0;

        while(allL != nbL || allR != nbR){
            if(allL === allR){
                socket.emit('yourTurn', listL[allL]);
                socket.broadcast.emit('yourTurn', listL[allL]);
                    
                 allL++;
            }
            else if(allL > allR){
                socket.emit('yourTurn', listR[allR]);
                socket.broadcast.emit('yourTurn', listR[allR]);

                allR++;
            }
        }

    })


});




function _checkTeam(){



    let nbR = 0;
    let nbB = 0;

    accountCreated.forEach(element => {
        
        if(element.team === 'Red Side'){
            nbR++;
        }
        else {
            nbB++;
        }
    });

    if(nbR > nbB){
        return 2;
    }
    else if(nbR<nbB){
        return 1;
    }
    else if(nbR == nbB) {
        return 0;
    }
}



server.listen(8080, '0.0.0.0' ,() => {console.log('Server started at port : 8080')});