var socket = io();

var app = new Vue({
    el: "#app",
    vuetify: new Vuetify(),
    data: {

        pseudo: '',
        team: '',
        accounts: [],

        disabled: false,
        showErrorMessage: false,
        showErrorTeamMessage: '',
        showBeginMessage: false,

        message: 'Choisissez votre pseudo !',
        items: ['Red Side', 'Blue Side'],

        timer: 5,
        maxPlayer: 4,

    },

    methods: {

        addPseudo: function() {

            // ON REGARDE TAILLE DE LA LISTE
            if(this.accounts.length > 0) {
                
                let inArray = this.checkInArray();

                
                // SI LE PSEUDO EXISTE
                if(inArray){
                    this.showErrorMessage = true;
                }
                
                // SI LE PSEUDO N'EXISTE PAS 
                else{

                    // SI L'INPUT EST VIDE
                    if(this.pseudo === '' || this.team === ''){
                        this.showErrorMessage = true;
                    }

                    // SINON
                    else{

                        socket.emit('pseudo', {pseudo: this.pseudo, team: this.team});
      
                        this.pseudo = '';
                        this.team = '';

                        this.disabled = true;
                        this.showErrorMessage = false;
                        this.showErrorTeamMessage = '';
                    }
                }

            }
            else {

                if(this.pseudo === '' || this.team === ''){
                    this.showErrorMessage = true;
                }
                else {
                    socket.emit('pseudo', {pseudo: this.pseudo, team: this.team});
                    
                    this.pseudo = '';
                    this.team = '';

                    this.disabled = true;
                    this.showErrorMessage = false;
                }
            }


            
        },

        checkInArray: function() {

            let check = false;

            this.accounts.forEach(element => {
                    
                if(element.pseudo === this.pseudo){
                    check = true;
                }
                
            });

            return check;
        },

        timerFunction: function(dirname) {

            if(this.timer === 0){
                window.location.href = 'http://192.168.1.129:8080/champSelect';
            }
            else {
                this.timer--;
            }
        },

    },

    created: function() {
        socket.on('listAccount', (listAccount) => {
            
            this.accounts = listAccount;

            if(this.accounts.length === this.maxPlayer){

                this.disabled = true;
                this.showBeginMessage = true;

                setInterval(() => {
                    this.timerFunction();
                }, 1000);

            }
            else{
                this.showBeginMessage = false;
            }

        });



        socket.on('errorTeam', (content) => {

            this.showErrorTeamMessage = content;
            this.disabled = false;
        });


        socket.on('saveSession', (content) => {

            sessionStorage.setItem('pseudo', content.pseudo);
            sessionStorage.setItem('team', content.team);
            ;

        });

        socket.on('saveLocal', (content) => {
            localStorage.setItem('accounts', JSON.stringify(content));
        });
        
    },
});
