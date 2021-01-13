window.addEventListener('DOMContentLoaded', () => {
    
    //Get select elements
    let selCat = document.getElementById("select-cat"),   //Select cathegory
        selSize = document.querySelector("#select-size"), //Select size
        reloadBtn = document.querySelector('#reload'),    //Restart
        minField = document.querySelector('#minutes'),     //Timer min's
        secField = document.querySelector('#seconds');     //Timer sec's
    
    let frame = document.querySelector('#frame');

    let size,               //Get chosen size
        rows = [],          //All rows with .card elements 
        cards = [],         //All .card elements
        canClick,           //Boolean
        lastImage,          //Last showed image
        firstClick,         //Boolean 
        imagePath,          //Path to the images folder
        openedImages,       //Opened images         
        clickCounter,       //Number of click
        cardPosition = [];  //Position of images array
    
    let minutes,
        seconds,
        timerid;

    setBasicParams();

    selCat.addEventListener('change', setBasicParams);
    selSize.addEventListener('change', setBasicParams);
    reloadBtn.addEventListener('click',setBasicParams);

    ///////////////////////////////////////////////////	   
    function setClock() {
        if (++seconds > 59) {
            minutes++;
            seconds = 0;
            minField.textContent = minutes;
        }

        if (seconds / 10 < 1) {
            secField.textContent = `0${seconds}`;
        } else {
            secField.textContent = seconds;
        }
    }

    function changingState() {
        
        frame.addEventListener('click', (e) => {
            //Check target 
            if (e && e.target.classList.contains('card')) {
                let element = e.target;
                let state = element.dataset.state;

                //Start timer on first click
                if (firstClick) {
                    firstClick = false;
                    timerid = setInterval(setClock, 1000);
                }

                //Check the state and possibility of click
                if (state == 0 && canClick) {
                   
                    //First click on closed card
                    if (clickCounter == 0) { 
                        
                        clickCounter++;
                        lastImage = getNum(element);
                     
                        element.setAttribute('data-state', 1);
                        element.dataset.state = '1';
                        element.style.backgroundImage = `url(${imagePath}${lastImage}.jpg)`;
                    } else {
                        
                        //If the pictures match
                        if (lastImage == getNum(element)) {
                            //Get all images with the same class number
                            let imgs = document.querySelectorAll(`[class*=num${lastImage}]`);
            
                            //Changing state of the elements
                            imgs.forEach( img => {
                                img.dataset.state = 2;
                                img.setAttribute('data-state', 2);
                                let source = `url(${imagePath}${lastImage}.jpg)`;
                                img.style.backgroundImage = source;
                            });
                            openedImages += 2;
                            
                            if (openedImages == (size ** 2)) {
                                clearInterval(timerid);
                                clearGameData();
                                let img = document.createElement('img');
                                img.setAttribute('src','img/win.jpg');
                                frame.appendChild(img);
                                console.log('Youre win!'); //WIIIIIIIIIIIIIIIIIIN
                            }
                        } else {
                            //If the pictures doesnt match
                            element.dataset.state = 1;
                            element.setAttribute('data-state', 1);
                            let classNumber = getNum(element);
                            element.style.backgroundImage = `url(${imagePath}${classNumber}.jpg)`;
                            
                            canClick = false;
                            
                            // Make delay
                            setTimeout(hideImage, 700);
                        }
                        clickCounter = 0;
                    }
                }
            }
        });
    }

    function hideImage() {
        cards.forEach( card => {
            if (card.dataset.state == 1) {
                card.dataset.state = 0;
                card.setAttribute('data-state', 0);
                card.style.backgroundImage = "url(img/0.jpg)";
            }   
        });
        canClick = true;
    }

    function setBasicParams() {
        //If select params changed we need to clear last data
            clearGameData();
            rows = [];
            cards = [];
            cardPosition = [];
            clearInterval(timerid);

        //Set selected size and cathegory
            size = selSize.options[selSize.selectedIndex].value;
            let cathegory = selCat.options[selCat.selectedIndex].value;
            imagePath = `img/${cathegory}/`;
            
        //Create array of position and mixing
            createPosArray(cardPosition, size);
            shuffle(cardPosition); 

        //Creating game field with card elements
            createGameField(size);

        //Get all rows and card elements
            rows = document.querySelectorAll('.row');
            cards = document.querySelectorAll('.card');
        
        //Event listener
            changingState();
            
        //Set basic parameters for each card
            cards.forEach( (card,index) => {
                card.dataset.state = 0;
                card.style.backgroundImage = "url(img/0.jpg)";
                let number = cardPosition[index] / 10 < 1 ? `0${cardPosition[index]}`: cardPosition[index];
                card.setAttribute('class',`card num${number}`);
                card.setAttribute('data-state', 0);
            });

        //Set variables values
            openedImages = 0;
            canClick = true;
            firstClick = true;
            clickCounter = 0;
            minutes = 0;
            seconds = 0;
            minField.textContent = '0';
            secField.textContent = '00';
    }

    function clearGameData() {
        try {
            if (rows.length != 0) {
                rows.forEach( row => {
                        row.parentNode.removeChild(row);   
                });  
            }
        } catch (error) {
            console.log('theres no rows');
        }

        try {
            frame.removeChild(frame.firstChild);
        } catch (error) {
            console.log('theres no image on frame');
        }
    }

    function createPosArray(array, size) {
        let length = (size ** 2) / 2;
        for (let i = 1; i <= length ; i++) {
            array.push(i);
            array.push(i);
        }
    }
    
    //Find number in the class of the element
    function getNum(element) {
        let reg = /\d\d/g; 
        return element.getAttribute('class').match(reg)[0];
        
    }
    
    function shuffle(array) {
        //Fisher–Yates shuffle
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createGameField(size) {
        
        for (let i = 0; i < size; i++) {
            //Create row  
            let row = document.createElement('div');
            row.classList.add('row');
            
            //Create elements in the row
            for (let j = 0; j < size; j++) {
                let element = document.createElement('div');
                element.classList.add('card');
                row.appendChild(element);
            }
            frame.appendChild(row);
        }
    }  
});