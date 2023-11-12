let	board;
let	score = 0;
let rows = 4;
let columns = 4;

let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

let startX = 0; 
let startY = 0;
//we're declaring these start X & Y as the touch input for mobile or tablet and mouseclick input

function setGame(){

	/*	test board
	board = [
		[4, 256, 512, 0],
		[4, 128, 1024, 0],
		[8, 64, 2048, 2],
		[16, 32, 4096, 8192]
	]; 
	*/

	board = [
	        [0, 0, 0, 0],
	        [0, 0, 0, 0],
	        [0, 0, 0, 0],
	        [0, 0, 0, 0]
	];

	for(let r=0; r < rows; r++){
		for(let c=0; c < columns; c++){

			let tile = document.createElement("div");

			tile.id = r.toString() + "-" + c.toString();
			// 0-0, 0-1, 0-2, 0-3 eto yung values para maindicate which tiles
			// 1-0, 1-1, 1-2, 1-3 so eto if nasa second row, showing all columns

			let num = board[r][c];

			updateTile(tile, num);

			document.getElementById("board").append(tile);

		}
	}
	setTwo();
	setTwo();
}

function updateTile(tile, num){

	    tile.innerText = ""; 
	    
	    tile.classList.value = ""; 
	   
	    tile.classList.add("tile");

	   
	    if(num > 0) {
	    	tile.innerText = num.toString(); //para magkavalue ung tiles
	        if (num <= 4096){
	            tile.classList.add("x"+num.toString());
	        } else {
	            tile.classList.add("x8192");
	        }
	    }
	}

window.onload = function(){
	setGame();
}

function handleSlide(e){
	
	console.log(e.code);

	if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.code)){
		
		e.preventDefault();

		if (e.code == "ArrowLeft" && canMoveLeft()) {
            slideLeft();
            setTwo();
        } else if (e.code == "ArrowRight" && canMoveRight()) {
            slideRight();
            setTwo();
        } else if (e.code == "ArrowUp" && canMoveUp()) {
            slideUp();
            setTwo();
        } else if (e.code == "ArrowDown" && canMoveDown()) {
            slideDown();
            setTwo();
        }
	}
	document.getElementById("score").innerText=score;
	checkWin(); //this is here to add prompt to the game when you get the scores 2048, 4096 and 8192
	
	if(hasLost()){
		setTimeout(()=>{
			alert("Game Over! You have lost the game. Game will restart.");
			restartGame();
			alert("Click any arrow key to restart.");
		},100)
	}
}

document.addEventListener("keydown", handleSlide);

function filterZero(row){
//here we remove the zeroes. only those greater than 0 are needed to show up in the screen. so if it's 0 it's not gonna show. => doesn't need to include 0 in this case since it's automatically taken as =>0 in this function
	return row.filter(num => num != 0)
}

function slide(row){
	    row = filterZero(row);
	    // originally it appears [0,2,2,2]
	    // but with the filter it will appear as [2,2,2]

	    for(let i = 0; i < row.length - 1; i++){
	    	//we use -1 here because we took out 0
	        if(row[i] == row[i+1]){
	            
	            row[i] *= 2;    
	            
	            row[i+1] = 0; //so if [4,0,2] yun row      
	        	
	        	score += row[i] //the score would just be added to the variable so we use +=
	        } 
	    }
	    row = filterZero(row); //magiging [4,2] sya after ng filter

	    while(row.length < columns){
	        row.push(0);
	    } //so lalabas na [4,2,0,0] after matulak

	    return row;
	}

function slideLeft(){

	for (let r=0; r < rows; r++){
		
		let row = board[r];
		
		let originalRow = row.slice(); //this is to separate the tiles	
		row = slide(row);
		
		board[r] = row;
		
		for(let c=0; c < columns; c++){
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];

			updateTile(tile, num);

			if (originalRow[c] !== num && num !== 0) { 
	                tile.style.animation = "slide-from-right 0.3s";
	                setTimeout(() => {
	                    tile.style.animation = "";
	                }, 300);
	            }
		}
	}
}

function slideRight(){

	for (let r=0; r < rows; r++){
		
		let row = board[r];
		
		let originalRow = row.slice();

		row.reverse(); //to reverse the output of the elements. bale ung 0,2,2,2 magiging 0,0,2,4 instead of 4,2,0,0
		row = slide(row);
		row.reverse(); //and we reverse it back again after sliding

		board[r] = row;
		
		for(let c=0; c < columns; c++){
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];

			updateTile(tile, num);

			if (originalRow[c] !== num && num !== 0) { 
	                tile.style.animation = "slide-from-left 0.3s";
	                setTimeout(() => {
	                    tile.style.animation = "";
	                }, 300);
	            }
		}
	}
}

function slideUp(){

	for(let c=0; c < columns; c++){
//since we used row as the variable in function slide, we'll use row still even if sliding up and down are technically columns since we'll declare the array below anyway:
		let row = [
			board[0][c],
			board[1][c],
			board[2][c],
			board[3][c]	
			];
		
		let originalRow = row.slice();

		row = slide(row); //we make our columns like an array so it will look like this [4,2,0,0] from this perspective but
		/* it will appear from this
		[0,0,0,0],
		[0,0,0,2],
		[0,0,0,2],
		[0,0,0,2]
		to this
		[0,0,0,4],
		[0,0,0,2],
		[0,0,0,0],
		[0,0,0,0] 
		on the game */

        // This line is for animation
        let changedIndices = [];
        for (let r = 0; r < rows; r++) { 
            if (originalRow[r] !== row[r]) {
                changedIndices.push(r);
            }
        }
        
		for(let r=0; r < rows; r++){
			board[r][c] = row[r]

			let tile = document.getElementById(r.toString()+ "-" + c.toString());
			let num = board[r][c];
			updateTile(tile,num);

            if (changedIndices.includes(r) && num !== 0) {
                tile.style.animation = "slide-from-bottom 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
		}
	}
}

function slideDown(){

	for(let c=0; c < columns; c++){

		let row = [
			board[0][c],
			board[1][c],
			board[2][c],
			board[3][c]	
			];
		
		let originalRow = row.slice();

		row.reverse();
		//similar to slide right, we reverse the slideUp function so that the row (column in this case) is mirrored

		//so array would be like this board[3][c], board[2][c], board[1][c], board[0][c]

		row = slide(row); 

		row.reverse();
		//then after sliding, we reverse again to return the array back to normal 
		
		//like this: board[0][c], board[1][c], board[2][c], board[3][c]
    	
    	// This line is for animation
        let changedIndices = [];
        for (let r = 0; r < rows; r++) {
            if (originalRow[r] !== row[r]) {
                changedIndices.push(r);
            }
        } 
		for(let r=0; r < rows; r++){
			board[r][c] = row[r]

			let tile = document.getElementById(r.toString()+ "-" + c.toString());

			let num = board[r][c];

			updateTile(tile,num);

            if (changedIndices.includes(r) && num !== 0) {
                tile.style.animation = "slide-from-top 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }

		}
	}
}

function hasEmptyTile(){
	
	for (let r=0; r<rows; r++){
		for (let c=0; c<columns; c++){
			
			if(board[r][c]==0){
				return true
			}
		}
	}

	return false
}

function setTwo(){
    if(!hasEmptyTile()){
        return;
    }

    let found = false;
    
    while(!found){
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
//here we're getting random numbers for row # and column #
       
        if(board[r][c] == 0){
            //if the randomly selected tile is = 0 it will be changed from 0 to 2
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2")

            found = true; //this will break the loop since found is now declared as true and the loop only repeats if the tile is found=false
        }
    }
}

//the canMove left right up down functions are to prevent spawning of new "2" tiles if no existing tiles had moved. without these 4 functions, new tiles will continue to appear whenever the recognized input commands are detected even when the tiles aren't moving
function canMoveLeft() {
    for (let r = 0; r < rows; r++) {
        for (let c = 1; c < columns; c++) {
            console.log(`${r} - ${c}`);
            if (board[r][c] !== 0) {
                if (board[r][c - 1] === 0 || board[r][c - 1] === board[r][c]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveRight() {
    for (let r = 0; r < rows; r++) {
        for (let c = columns - 2; c >= 0; c--) {
            console.log(`${r} - ${c}`);
            if (board[r][c] !== 0) {
                if (board[r][c + 1] === 0 || board[r][c + 1] === board[r][c]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveUp() {
    for (let c = 0; c < columns; c++) {
        for (let r = 1; r < rows; r++) {
            console.log(`${c} - ${r}`);
            if (board[r][c] !== 0) {
                if (board[r - 1][c] === 0 || board[r - 1][c] === board[r][c]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveDown() {
    for (let c = 0; c < columns; c++) {

        for (let r = rows - 2; r >= 0; r--) {
            console.log(`${c} - ${r}`);
            if (board[r][c] !== 0) {
                if (board[r + 1][c] === 0 || board[r + 1][c] === board[r][c]) {
                    return true;
                }
            }
        }
    }
    return false;
}
function checkWin(){
    for(let r =0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            if(board[r][c] == 2048 && is2048Exist == false){
                alert('You Win! You got the 2048!! POGS'); 
                is2048Exist = true; 
            } else if(board[r][c] == 4096 && is4096Exist == false) {
                alert("You are unstoppable at 4096! You are fantastically unstoppable!");
                is4096Exist = true;
            } else if(board[r][c] == 8192 && is8192Exist == false) {
                alert("Victory!: You have reached 8192! You are incredibly awesome!");
                is8192Exist = true;
            }
        }
    }
}

function hasLost() {
	    for (let r = 0; r < rows; r++) {
	        for (let c = 0; c < columns; c++) {
	            if (board[r][c] === 0) {
	                return false;
	            }

	            const currentTile = board[r][c];

	            if (
	                r > 0 && board[r - 1][c] === currentTile ||
	                r < rows - 1 && board[r + 1][c] === currentTile ||
	                c > 0 && board[r][c - 1] === currentTile ||
	                c < columns - 1 && board[r][c + 1] === currentTile //triple equal sign (===) means strictly equal. means that it will also check the string type
	            ) {
	                return false;
	            }
	        }
	    }


	    return true;
}

function restartGame(){
	for (let r=0; r<rows;r++){
		for (let c=0; c<columns; c++){
			board[r][c]=0
		}
	}
	score=0
	setTwo();
}

//below will be our event listener for touch input for mobile & tablet or mouseclicks. e means event
document.addEventListener("touchstart", (e) => {
	startX = e.touches [0].clientX; 
	startY = e.touches [0].clientY; 
	//client X & Y are the detected touch. they go hand in hand to get the coordinate at the start of the touch
});

document.addEventListener("touchmove", (e) =>{
	//! is for no. so !e is for no event. the line below means that as long as no movement is detected, we just return to check again. this is to prevent default
	if (!e.target.className.includes("tile")){
		return
	}
	e.preventDefault();

}, {passive: false});

document.addEventListener("touchend", (e) =>{
	if (!e.target.className.includes("tile")){
		return
	}
	let diffX=startX - e.changedTouches[0].clientX;
	let diffY=startY - e.changedTouches[0].clientY;
	//we check for the horizontal and vertical movement by checking the difference in the two coordinates

	if(Math.abs(diffX) > Math.abs(diffY)){
	// we're using the abs(absolute value) and check the difference between the changes in position horizontally and vertically (cos finger swipes won't be perfectly horizonal and vertical)
	
		if(diffX>0){
			if (canMoveLeft()) {
				slideLeft();
				setTwo();
			}

		} else {
			if (canMoveRight()){
				slideRight();
				setTwo();				
			}

		}

	} else if((Math.abs(diffX) && Math.abs(diffY))==0){
		return;
	}

	else{
		
		if(diffY>0) {
			if (canMoveUp()){
				slideUp();
				setTwo();	
			}
			
		} else {
			if(canMoveDown()){
				slideDown();
				setTwo();			
			}

		}

	}

	document.getElementById("score").innerText=score;
	checkWin(); //this is here to add prompt to the game when you get the scores 2048, 4096 and 8192
	
	if(hasLost()){
		setTimeout(()=>{
			alert("Game Over! You have lost the game. Game will restart.");
			restartGame();
			alert("Click any arrow key to restart.");
		},100);
	}

});