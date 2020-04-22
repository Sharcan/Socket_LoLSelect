window.addEventListener("DOMContentLoaded", (e) => {
    var socket = io();

    var app = new Vue({
        el: "#app",
        vuetify: new Vuetify(),
        data: {
            
            messageTop: '',
            waitingOther:'',
            reduceTime: '',
            timeOut: '',
            
            account: '',
            players: [],
            listLeft: [],
            listRight: [],
            playerSelection: '',

            
            displayChamp: false,
            champions: [],
            selectedChampion: '',
            imgSelectedChampion: '',

            timer: 0,
            valueProgress: 1,

            
            
        },

        methods: {

            
            // waitingAll: function() {
                
            //     if(this.timer === 0) {
                    
            //         if(this.players[0].pseudo === this.account.pseudo){
            //             setTimeout(() => {
            //                 socket.emit('launchSelection', this.listLeft, this.listRight);
            //             }, 1000);
            //         }

            //         document.getElementById('progressBar').classList.remove('reduceProgressBar');
            //         clearInterval(this.waitingOther);

            //         this.displayChamp = true;
            //     }
            //     else {
            //         this.timer--;
            //     }
            // },

            getAllChamp: function() {

                var myInit = { method: 'GET',
                mode: 'cors',
                cache: 'default' };

                fetch('http://ddragon.leagueoflegends.com/cdn/10.8.1/data/fr_FR/champion.json', myInit)
                    .then((response) => response.json())
                    .then((data) => {
                        const listChamp = Object.values(data.data);
                        let index = 0;
                        listChamp.forEach(champion => {

                            this.champions.push({index: index, name: champion.name, avatar: 'http://ddragon.leagueoflegends.com/cdn/10.8.1/img/champion/' + champion.image.full});
                            index++;
                        });

                    });
            },




            setTimerFunctionSelection: function() {
                
                clearInterval(this.reduceTime);
                this.timer = 30;
                

                this.reduceTime = setInterval(() => {
                    this.timerReducerSelection();
                }, 1000);
            },






            timerReducerSelection: function() {
                
                if(this.timer === 1){
                    document.getElementById('progressBar').classList.remove('reduceProgressBarSelection');
                    clearInterval(this.reduceTime);
                }
                else{
                    this.timer--;
                }
            },






            playerSelectionFunction: function() {

                socket.emit('confirmChamp', this.selectedChampion, this.account);
            },






            thisChamp: function(id, name, avatar) {

                let selectChamp = document.getElementById('selectChamp');
                selectChamp.play();

                this.selectedChampion = {
                    id: id,
                    name: name,
                    avatar: avatar
                };
                socket.emit('thinkChamp', this.selectedChampion, this.account);
            },


            

        },

        created: function() {




            socket.on('champSelect', () => {
                
                this.getAllChamp();
                
                let pseudo = sessionStorage.getItem('pseudo');
                let team = sessionStorage.getItem('team');
                let accountsJSON= localStorage.getItem('accounts');
                
                this.players = JSON.parse(accountsJSON);

                this.account = {
                    pseudo: pseudo,
                    team: team
                };
                

                this.players.forEach(element => {
                    if(element.team === "Red Side") {
                        this.listRight.push({id: this.players.findIndex(player => player.pseudo == element.pseudo), pseudo: element.pseudo, champion: '', avatar: ''});
                    }
                    else if(element.team === "Blue Side") {
                        this.listLeft.push({id: this.players.findIndex(player => player.pseudo == element.pseudo), pseudo: element.pseudo, champion: '', avatar: ''});
                    }

                });
                
                this.messageTop = 'En attentes des joueurs';
                socket.emit('loaded', this.players);

            });






            socket.on('allLoaded', () => {
                socket.emit('launchSelection', this.listLeft, this.listRight);
            });





            socket.on('yourTurn', (content, index) => {

                this.messageTop = 'En attente de selection de ' + content.pseudo;

                document.getElementById('progressBar').classList.add('reduceProgressBarSelection');
                this.setTimerFunctionSelection();

                this.playerSelection = content.id;

                if(content.pseudo === this.account.pseudo){
                    this.displayChamp = true;
                    index.index++;

                    this.timeOut = setTimeout(() => {
                        this.displayChamp = false;
                        socket.emit('finishTurn', this.listLeft, this.listRight, {team: index.team, index: index.index});
                    }, 32000);
                }
            
            });






            socket.on('thinkChamp', (champion, account) => {
                
                

                if(account.team === 'Red Side'){
                    let index = this.listRight.findIndex(player => player.pseudo == account.pseudo);
                    
                    this.listRight[index].champion = champion.name;
                    this.listRight[index].avatar = champion.avatar;
                }
                else if(account.team === 'Blue Side'){
                    let index = this.listLeft.findIndex(player => player.pseudo == account.pseudo); 

                    this.listLeft[index].champion = champion.name;
                    this.listLeft[index].avatar = champion.avatar;
                }


            });


            socket.on('confirmChamp', (champion, account) => {
               
                this.imgSelectedChampion = "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + champion.name + "_0.jpg";
                document.getElementById('imgSelectedChampion').classList.add('animationImgSelectedChampion');

                setTimeout(() => {
                    clearTimeout(this.timeOut);
                    this.imgSelectedChampion = "";
                    document.getElementById('imgSelectedChampion').classList.remove('animationImgSelectedChampion');
                }, 2000);
                
            });



            socket.on('FINISH', ()=> {
                this.messageTop = "Lancement de la partie";
                setTimeout(() => {
                    window.location.href = 'http://192.168.1.129:8080/game';
                }, 2000);
            });
        },


    });
});