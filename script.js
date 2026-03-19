const clickSound = new Audio("sounds/click.mp3")
const winSound = new Audio("sounds/win.mp3")
const drawSound = new Audio("sounds/draw.mp3")

let avatarX="😎"
let avatarO="🤖"

let playerXName = "Player X"
let playerOName = "Player O"

let turn = "X"
let isgameover = false

let scoreX = 0
let scoreO = 0
let draw = 0

let history = []

// DARK MODE
let btn = document.getElementById("theme")

btn.addEventListener("click",()=>{
document.body.classList.toggle("dark")

btn.innerText = document.body.classList.contains("dark") ? "Light Mode" : "Dark Mode"
})

// CHANGE TURN
const changeTurn = () => turn === "X" ? "O" : "X"

// ✅ FIXED CHECK WIN
const checkWin = () => {

let boxtext = document.querySelectorAll(".boxtext")

let wins = [
[0,1,2],[3,4,5],[6,7,8],
[0,3,6],[1,4,7],[2,5,8],
[0,4,8],[2,4,6]
]

for(let e of wins){

if(
boxtext[e[0]].innerText &&
boxtext[e[0]].innerText === boxtext[e[1]].innerText &&
boxtext[e[0]].innerText === boxtext[e[2]].innerText
){

let winner = boxtext[e[0]].innerText

if(winner === "X"){
document.querySelector(".info").innerText = avatarX + " " + playerXName + " Won"
scoreX++
document.getElementById("scoreX").innerText = scoreX
history.push(playerXName + " won")
}
else{
document.querySelector(".info").innerText = avatarO + " " + playerOName + " Won"
scoreO++
document.getElementById("scoreO").innerText = scoreO
history.push(playerOName + " won")
}

winSound.play()
celebrate()

boxtext[e[0]].classList.add("win")
boxtext[e[1]].classList.add("win")
boxtext[e[2]].classList.add("win")

updateHistory()

isgameover = true
return true
}

}

return false
}

// CHECK DRAW
const checkDraw = () => {

let boxtexts = document.querySelectorAll(".boxtext")

let filled = true

boxtexts.forEach(e => {
if(e.innerText === "") filled = false
})

if(filled && !isgameover){
document.querySelector(".info").innerText = "Draw"

 drawSound.play() 

draw++
document.getElementById("draw").innerText = draw

history.push("Draw")
updateHistory()

isgameover = true


}
}

// UPDATE HISTORY
function updateHistory(){
let list = document.getElementById("historyList")
list.innerHTML = ""

history.slice(-5).forEach(item => {
let li = document.createElement("li")
li.innerText = item
list.appendChild(li)
})
}

// GAME LOGIC
let boxes = document.querySelectorAll(".box")

boxes.forEach(box => {

let boxtext = box.querySelector(".boxtext")

box.addEventListener("click", () => {

    clickSound.play()
if(isgameover) return

if(boxtext.innerText === ""){

// PLAYER MOVE
boxtext.innerText = turn

checkWin()
checkDraw()

if(!isgameover){

turn = changeTurn()

// UPDATE TURN TEXT
document.querySelector(".info").innerText =
(turn === "X")
? avatarX + " " + playerXName + "'s Turn"
: avatarO + " " + playerOName + "'s Turn"

// 🤖 AI MOVE
if(aiMode && turn==="O"){

setTimeout(()=>{

if(isgameover) return

aiMove()

// ✅ IMPORTANT FIX
checkWin()
checkDraw()

if(!isgameover){
turn = "X"
document.querySelector(".info").innerText =
avatarX + " " + playerXName + "'s Turn"
}

},500)

}

}

}

})

})

// RESET BUTTON

document.getElementById("reset").addEventListener("click", () => {

let board = document.querySelector(".container")
board.classList.add("restartAnim")

setTimeout(()=>{

document.querySelectorAll(".boxtext").forEach(e => {
e.innerText = ""
e.classList.remove("win")
})

isgameover = false
turn = "X"

document.querySelector(".info").innerText =
avatarX + " " + playerXName + "'s Turn"

board.classList.remove("restartAnim")

},500)

})


// CONFETTI
function celebrate(){
for(let i=0;i<100;i++){
let c=document.createElement("div")

c.style.position="fixed"
c.style.width="10px"
c.style.height="10px"
c.style.background="hsl("+Math.random()*360+"deg,100%,50%)"
c.style.left=Math.random()*100+"vw"
c.style.top="-10px"

document.body.appendChild(c)

let fall=Math.random()*3+2

c.animate(
[{transform:"translateY(0)"},{transform:"translateY(100vh)"}],
{duration:fall*1000}
)

setTimeout(()=>c.remove(),fall*1000)
}
}

// GAME MODE
let aiMode = false

document.getElementById("gameMode").addEventListener("change",(e)=>{

if(e.target.value === "ai"){
aiMode = true

playerOName = "Computer"
avatarO = "🤖"

document.getElementById("nameO").innerText = "Computer"
document.getElementById("avatarOBoard").innerText = "🤖"

document.getElementById("playerO").value = "Computer"
document.getElementById("playerO").disabled = true

}
else{
aiMode = false

playerOName = "Player O"
avatarO = "🤖"

document.getElementById("nameO").innerText = "Player O"
document.getElementById("avatarOBoard").innerText = "🤖"

document.getElementById("playerO").value = ""
document.getElementById("playerO").disabled = false

}

})

// 🤖 AI (MINIMAX)
function aiMove(){

let boxes = document.querySelectorAll(".boxtext")
let board = []

boxes.forEach(b=>{
board.push(b.innerText === "" ? null : b.innerText)
})

let bestScore = -Infinity
let move

for(let i=0;i<board.length;i++){
if(board[i] === null){
board[i] = "O"
let score = minimax(board,0,false)
board[i] = null

if(score > bestScore){
bestScore = score
move = i
}
}
}

boxes[move].innerText = "O"
}

// MINIMAX
function minimax(board,depth,isMaximizing){

let result = checkWinnerAI(board)

if(result !== null){
let scores = { O:10, X:-10, draw:0 }
return scores[result]
}

if(isMaximizing){
let bestScore = -Infinity

for(let i=0;i<board.length;i++){
if(board[i] === null){
board[i] = "O"
let score = minimax(board,depth+1,false)
board[i] = null
bestScore = Math.max(score,bestScore)
}
}

return bestScore
}
else{
let bestScore = Infinity

for(let i=0;i<board.length;i++){
if(board[i] === null){
board[i] = "X"
let score = minimax(board,depth+1,true)
board[i] = null
bestScore = Math.min(score,bestScore)
}
}

return bestScore
}

}

// ✅ RENAMED (IMPORTANT)
function checkWinnerAI(board){

let wins = [
[0,1,2],[3,4,5],[6,7,8],
[0,3,6],[1,4,7],[2,5,8],
[0,4,8],[2,4,6]
]

for(let combo of wins){
let [a,b,c] = combo

if(board[a] && board[a] === board[b] && board[a] === board[c]){
return board[a]
}
}

if(board.every(cell => cell !== null)){
return "draw"
}

return null
}

// SET PLAYERS
document.getElementById("setPlayers").addEventListener("click",()=>{

let x=document.getElementById("playerX").value
let o=document.getElementById("playerO").value

if(x!=="") playerXName=x
if(o!=="") playerOName=o


// Keep default avatars or remove completely
avatarX = "X"
avatarO = "O"

document.getElementById("nameX").innerText=playerXName
document.getElementById("nameO").innerText=playerOName

document.getElementById("avatarXBoard").innerText=avatarX
document.getElementById("avatarOBoard").innerText=avatarO

})


clickSound.volume = 0.5
winSound.volume = 0.7
drawSound.volume = 0.6
