// window.addEventListener('DOMContentLoaded', () => {

    var socket = io();
    
    var app = new Vue({
        el: "#app",
        vuetify: new Vuetify(),
        data: {
            
            account: '',
            messageTop: '',
            waitingOther:'',
            
            players: [],
            listLeft: [],
            listRight: [],

            champions: [
                {
                    id: "1",
                    avatar: "champ/Aatrox.jpg",
                    name: "Aatrox"
                },
                {
                    id: "1",
                    avatar: "champ/Aatrox.jpg",
                    name: "Aatrox"
                },
                {
                    id: "1",
                    avatar: "champ/Aatrox.jpg",
                    name: "Aatrox"
                },
                {
                    id: "1",
                    avatar: "champ/Aatrox.jpg",
                    name: "Aatrox"
                },
                {
                    id: "1",
                    avatar: "champ/Aatrox.jpg",
                    name: "Aatrox"
                },
                {
                    id: "1",
                    avatar: "champ/Aatrox.jpg",
                    name: "Aatrox"
                },
                {
                    id: "1",
                    avatar: "champ/Aatrox.jpg",
                    name: "Aatrox"
                },
                {
                    id: "1",
                    avatar: "champ/Aatrox.jpg",
                    name: "Aatrox"
                },
                {
                    id: "1",
                    avatar: "champ/Aatrox.jpg",
                    name: "Aatrox"
                },
                {
                    id: "1",
                    avatar: "champ/Aatrox.jpg",
                    name: "Aatrox"
                },
                {
                    id: "1",
                    avatar: "champ/Aatrox.jpg",
                    name: "Aatrox"
                },
                {
                    id: "1",
                    avatar: "champ/Aatrox.jpg",
                    name: "Aatrox"
                },
            ],

            timer: 0,
            valueProgress: 1,
            
        },

        methods: {
            
            waitingAll: function() {
                this.messageTop = 'En attentes des joueurs';
                if(this.timer === 0) {
                    

                    if(this.players[0].pseudo === this.account.pseudo){
                        setTimeout(() => {
                            socket.emit('launchSelection', this.players, this.listLeft, this.listRight);
                        }, 1000);
                    }

                    document.getElementById('progressBar').classList.remove('reduceProgressBar');
                    clearInterval(this.waitingOther);
                }
                else {
                    this.timer--;
                }
            },


        },

        created: function() {
            socket.on('champSelect', () => {
                
                
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
                        this.listRight.push(element.pseudo);
                    }
                    else if(element.team === "Blue Side") {
                        this.listLeft.push(element.pseudo);
                    }
                });
                
                this.timer = 5;
                document.getElementById('progressBar').classList.add('reduceProgressBar');
                this.waitingOther = setInterval(() => {
                   this.waitingAll();
                }, 1000);

            });



            socket.on('yourTurn', (content) => {
                console.log('c au tour de ' + content);
                if(content === this.account.pseudo){
                    console.log('MAIS C MOI !');
                }
            })


        },


    });
// });