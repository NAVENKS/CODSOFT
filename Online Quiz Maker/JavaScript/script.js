const configContainer=document.querySelector(".config-container")
const quizContainer=document.querySelector(".quiz-container")
const answerOptions=document.querySelector(".answer-options")
const nextQuestionBtn=document.querySelector(".next-question-btn")
const questionStatus=document.querySelector(".question-status")
const timerDisplay=document.querySelector(".time-duration")
const resultContainer=document.querySelector(".result-container");
//Quiz state variables
const QUIZ_TIME_LIMIT=15;
let currentTime=QUIZ_TIME_LIMIT;
let timer=null;
let quizCategory = "programming";
let numberOfQuestions=5;
let currentQuestion=null;
const questionsIndexHistory=[];
let correctAnswerCount=0;
//Display the quiz result and hide the quiz container
const showQuizresult=()=>{
    quizContainer.style.display="none";
    resultContainer.style.display="block";
    const resultText=`You answered <b>${correctAnswerCount}</b> out of <b>${numberOfQuestions}</b> Questions correctly.
                Great effort!`;
    document.querySelector(".result-message").innerHTML=resultText;
}
//Clear and reset the timer
const restTimer=()=>{
    clearInterval(timer);
    currentTime=QUIZ_TIME_LIMIT;
    timerDisplay.textContent=`${currentTime}s`;
}
//Initialize and start the timer for the current quiz
const startTimer=()=>{
    timer=setInterval(()=>{
        currentTime--;
        timerDisplay.textContent=`${currentTime}s`;
        if(currentTime<=0){
            clearInterval(timer);
            highlightCorrectAnswer();
            nextQuestionBtn.style.visibility="visible";
            quizContainer.querySelector(".quiz-timer").style.background="#c31406";
                //Disable all answer options after one opyion is selected
    answerOptions.querySelectorAll(".answer-option").forEach(option=> option.style.pointerEvents="none");
        }
    },1000);
}
//Fetch a ramdom question form based on the selected category
const getRamdomQuestion=()=>{
    const categoryQuestions = questions.find(cat=>cat.category.toLowerCase()=== 
    quizCategory.toLowerCase()).questions ||[];
    //Shows the result if all the questions have been used
    if(questionsIndexHistory.length>=Math.min(categoryQuestions.length,numberOfQuestions)){
        return showQuizresult();
        
    }
    //Filter out alraedy asked questions and choose a random question
    const availableQuestion=categoryQuestions.filter((_,index)=> !questionsIndexHistory.includes(index));
    const randomQuestion = availableQuestion[Math.floor(Math.random()*availableQuestion.length)];
    questionsIndexHistory.push(categoryQuestions.indexOf(randomQuestion));
    return (randomQuestion);
}
//Highlight the correct option and add icon
const highlightCorrectAnswer=()=>{
    const correctOption=answerOptions.querySelectorAll(".answer-option")[currentQuestion.correctAnswer];
    correctOption.classList.add("correct");
    const iconHTML =`<span class="material-symbols-rounded">check_circle</span>`;
    correctOption.insertAdjacentHTML("beforeend",iconHTML);
}
//Handle the user's answer selection
const handleAnswer=(option,answerIndex)=>{
    clearInterval(timer);
    const isCorrect = currentQuestion.correctAnswer===answerIndex;
    option.classList.add(isCorrect?'correct':'incorrect');
    !isCorrect ? highlightCorrectAnswer() :correctAnswerCount++;
    //Insert the icon based on correctness
    const iconHTML =`<span class="material-symbols-rounded">${isCorrect ? 'check_circle':'cancel'}</span>`;
    option.insertAdjacentHTML("beforeend",iconHTML);
    //Disable all answer options after one opyion is selected
    answerOptions.querySelectorAll(".answer-option").forEach(option=> option.style.pointerEvents="none");
    nextQuestionBtn.style.visibility="visible";
}
//render the currect question and its option in the quiz
const renderQuestion=()=>{
    currentQuestion=getRamdomQuestion();
    if(!currentQuestion) return;
    restTimer();
    startTimer();
    //update the UI
    answerOptions.innerHTML="";
    nextQuestionBtn.style.visibility="hidden";
    quizContainer.querySelector(".quiz-timer").style.background="#32313c";
    document.querySelector(".question-text").textContent=currentQuestion.question;
    questionStatus.innerHTML=`<b>${questionsIndexHistory.length}</b> of <b>${numberOfQuestions}</b> Questions`
    //create option <li> elements and append the,,and add click event listener
    currentQuestion.options.forEach((option,index) =>{
        const li=document.createElement("li");
        li.classList.add("answer-option");
        li.textContent=option;
        answerOptions.appendChild(li);
        li.addEventListener("click",()=> handleAnswer(li,index))
    });
}
//Start the quiz and render the random question.
const startQuiz=()=>{
    configContainer.style.display="none";
    quizContainer.style.display="block";
    //update the quiz category and number od questions
    quizCategory =configContainer.querySelector(".category-option.active").textContent;
    numberOfQuestions=parseInt(configContainer.querySelector(".question-option.active").textContent);
    renderQuestion();

}
// Highlight the Selected option on click - category or no. of question.
document.querySelectorAll(".category-option, .question-option").forEach(option=>{
    option.addEventListener("click",()=>{
        option.parentNode.querySelector(".active").classList.remove("active");
        option.classList.add("active");
    });
});
//Reset the quiz and return to the  configuration container.
const resetQuiz=()=>{
    restTimer();
    correctAnswerCount=0;
    questionsIndexHistory.length=0
    configContainer.style.display="block";
    resultContainer.style.display="none";
}
nextQuestionBtn.addEventListener("click",renderQuestion);
document.querySelector(".try-again-btn").addEventListener("click",resetQuiz);
document.querySelector(".start-quiz-btn").addEventListener("click",startQuiz);