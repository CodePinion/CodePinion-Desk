// Create a map with key as category and value as list of recerved word
const reserved_words = new Map();
reserved_words.set('keyword', ['False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield']);
reserved_words.set('operator',['+','-', '*','/','%','<','=','>','!'])
reserved_words.set('punctuation', [',', '.', ';', ':', '(', '[', '{', ')', ']', '}'])


// Create a class editor

// Define the focus index
let focusIndex = null;
// Define focus status
let FocusStatus = false

// The Class
class CodePinionEditor {

    // Constructor
    constructor(container) {
        this.container = container;
    }

    // Initialize the editor
    init(index,line_number) {

        // Clear the editor
        this.container.innerHTML = "";

        // Create first line
        this.new_line(index,line_number);

        // call the line theme
        this.line_theme();

        // Call on enter method
        this.on_enter();

        // Call on backspace method
        this.on_backspace();

    }

    // Create a method on enter
    on_enter() {

        // When enter is pressed
        document.addEventListener('keydown', function(event) {

            if (event.key === 'Enter') {
        
                event.preventDefault();
        
                // Check if any line has a class called is_focused
                if(FocusStatus == true) {
                    
                    // Create a new line
                    index = editor.at_focus_click() + 1;
                    line_number = index + 1;
                    editor.new_line(index,line_number);
        
                }
                else{
                    return;
                }
        
            }
        });
    }

    // Create new span
    new_span(content, className){
        let newSpan = document.createElement('span');
        newSpan.classList.add(className);
        newSpan.textContent = content;
        newSpan.setAttribute("id", "active");

        return newSpan;
    }

    // Activate clicked span
    activate_clicked_span(){

        // get the editor container
        let editor_container = document.getElementById("the_editor");

        editor_container.addEventListener("mouseup", function(event) {

            if (event.button === 0) {

                // Remove the id from the active span
                let activeSpan = document.querySelector("span[id='active']");
                activeSpan.removeAttribute("id");

                if(event.target.localName == 'span'){
                    // Add the id to the clicked span
                    event.target.setAttribute("id", "active");

                }
                else if(event.target.localName == 'div' && event.target.classList.contains('editor_code_line')){
                    // Add id to the last span
                    event.target.lastChild.setAttribute("id", "active");

                }
            
            }

        });

    }

    // Create a new line
    new_line(index,line_number) {

        let line_number_elements = null;

        // This is the single line
        let single_line = `
            <div class="editor_number_code">

                <div class="editor_number">
                    <div class="editor_number_line">
                        <p class="line_number" ></p>
                    </div>
                </div>

                <div class="editor_code">
                    <div class="editor_code_line" contenteditable="True"></div>
                </div>

            </div>
            `
        
        // Check if the editor is empty
        const hasLines = this.container.hasChildNodes();

        // If the editor has lines
        if(!hasLines) {
            // Create the first line
            this.container.innerHTML = single_line;
            
        }
        else {    
            // Remove the id from the active span
            let activeSpan = document.querySelector("span[id='active']");
            activeSpan.removeAttribute("id");

            // Insert the new line after the previous line
            this.container.children[index - 1].insertAdjacentHTML('afterend', single_line);
        }

        // Get the line number
        line_number_elements = document.getElementsByClassName("line_number");

        // Call the monitor line number
        this.monitor_line_number(line_number_elements,index,line_number,);

        // call the focus on the new line
        this.at_focus_line(index);

        // Call at focus line
        this.at_focus_click();

        // Create a new span in the new line
        let line_inputs = document.querySelectorAll('.editor_code_line');
        let newSpan = this.new_span('','regular');
        line_inputs[index].appendChild(newSpan);

        // call activate_clicked_span function
        this.activate_clicked_span();
        
    }

    // Create a method on backspace
    on_backspace() {
        // When backspace is pressed
        document.addEventListener('keydown', function(event) {

            if (event.key === 'Backspace') {
                
                index = editor.at_focus_click();

                // Get all the line inputs
                let all_lines = document.querySelectorAll(".editor_code_line");

                // Get the active span
                let activeSpan = all_lines[index].querySelector("span[id='active']");

                // Get all the spans in all_lines
                let all_spans = all_lines[index].querySelectorAll("span");
                let spanArray = $(all_spans);
                // Find the index of the span with the id of active
                let spanIndex = spanArray.index($("#active"));

                //const cursorPosition = window.getSelection().getRangeAt(0).startOffset;

                if(index < 1 && spanIndex < 1 ) {

                    if(activeSpan.textContent.length == 0){
                        event.preventDefault();
                    }
                }

                // Here remove the line
                else if(index >= 1 && spanIndex < 1) {

                    if(activeSpan.textContent.length == 0){

                        event.preventDefault();

                        // Remove the line
                        editor.remove_line(index);

                    }

                }

                else {

                    if(activeSpan.textContent.length == 1){

                        event.preventDefault();

                        // Move active span to the previous span
                        if(spanIndex > 0) {
                            let previousSpan = all_spans[spanIndex - 1];
                            previousSpan.setAttribute("id", "active");
                        }

                        all_lines[index].removeChild(activeSpan);

                    }

                }
        
            }
        });
    }

    // Remove a line
    remove_line(index) {

        // Get all the line containers
        let all_line_containers = document.querySelectorAll(".editor_number_code");
        // Check if removing a line at the end or in between
        let all_lines = document.querySelectorAll(".editor_code_line");
        // Define index of previous line
        let previous_line_index = index - 1;
        // Define the new line number
        let new_line_number = index + 1;
        // Update the line number
        let line_number_elements = document.getElementsByClassName("line_number");
        // Remove active class from all the spans in all_lines_container[index - 1]
        let activeSpan = document.querySelector("span[id='active']");
        activeSpan.removeAttribute("id");
        // Add active id to the last span in all_lines_container[index - 1]
        let all_spans = all_lines[index - 1].querySelectorAll("span");
        all_spans[all_spans.length - 1].setAttribute("id", "active");

        // Remove the line in between
        all_line_containers[index].remove();
        
        // Call the monitor line number
        this.monitor_line_number(line_number_elements,previous_line_index,new_line_number);
        // Call at focus new line
        this.at_focus_line(previous_line_index);
        // Call at focus line to renew the focus
        this.at_focus_click();

    }

    // Monitore the current line being edited
    at_focus_click() {

        // Get all the new line containers
        let all_line_containers = document.querySelectorAll(".editor_number_code");

        // Get all the lines
        let all_lines = document.querySelectorAll(".editor_code_line");

        // Create a focus event on all_lines
        for (let i = 0; i < all_lines.length; i++) {
            all_lines[i].addEventListener('click', function(event) {

                // Remove the class is_focused from all lines
                for (let i = 0; i < all_lines.length; i++) {
                    // Check if any line has a class called is_focused
                    if(all_lines[i].classList.contains("is_focused")) {
                        // Remove the class
                        all_lines[i].classList.remove("is_focused");

                        // Remove the focusing color
                        all_line_containers[i].classList.remove("show_focused");

                        // Change the focus status to false
                        FocusStatus = false;

                    }
                }

                // Get the index of the clicked div
                focusIndex = i;
                // Change the focus status to true
                FocusStatus = true;

                // Remove the focusing color
                all_line_containers[focusIndex].classList.add("show_focused");

                // Add to that line class called is_focused
                all_lines[focusIndex].classList.add("is_focused");
              
            });
        }

        return focusIndex;

    }

    // Focus on the new line
    at_focus_line(index) {

        // Get all the lines
        let all_lines = document.querySelectorAll(".editor_code_line");

        // click the new line after 1 second
        setTimeout(function() {
            all_lines[index].click();

        }, 1);

        // Add Typing cursor at the end of the line
        let range = document.createRange(); // create a range object
        range.selectNodeContents(all_lines[index]); // select the entire content of the div
        range.collapse(false); // collapse the range to the end point
        let sel = window.getSelection(); // get the selection object
        sel.removeAllRanges(); // remove any existing selections
        sel.addRange(range);

    }

    // Monitor line number
    monitor_line_number(number_element,line_index,line_number) {

        // Get the last line index
        const all_lines = document.querySelectorAll(".editor_code_line");

        const lastDivIndex = all_lines.length - 1;

        // Check if numbering is at the middle or end
        if(line_index == lastDivIndex + 1){
            // Set the line number at the end
            number_element[line_index].innerHTML = line_number;
        }
        else {

            // Set the line number at the end
            number_element[line_index].innerHTML = line_number;

            // Update the line number
            for (let i = line_index; i < number_element.length; i++) {
                number_element[i].innerHTML = i + 1;
            }

        }

    }

    // Move cursor to the required position
    moveCursorToPosition(createSpanStatus) {

        let all_lines = document.querySelectorAll(".editor_code_line");

        let lineIndex = this.at_focus_click();

        let activeSpan = all_lines[lineIndex].querySelector("span[id='active']");

        if(createSpanStatus == true) {
            let range = document.createRange(); // create a range object
            range.selectNodeContents(activeSpan); // select the entire content of the div
            range.collapse(false); // collapse the range to the end point
            let sel = window.getSelection(); // get the selection object
            sel.removeAllRanges(); // remove any existing selections
            sel.addRange(range);
        }

    }

    // Compare textContent and map members
    getKeyByValueArray(map, member) { 
        for (let [key, value] of map.entries()) { 
            if (Array.isArray(value) && value.includes(member)) return key; 
        }
        return null;
    }

    // Monitor the theme
    line_theme() {

        // New span initialization
        let newSpan = null;
        // Get the id of the code editor
        let editor_id = document.getElementById("the_editor");

        // Add event listener to the line inputs
        editor_id.addEventListener('input', (event) => {

            let activeSpan = event.target.querySelector("span[id='active']")

            const text = activeSpan.textContent;

            // Get the length of the sentence.
            // Get the last character in the sentence. (help in getting panctuations)
            let length = text.length;
            let lastLetter = text[length - 1];

            // When space is created in a special span
            if(lastLetter == "\u00A0" && !activeSpan.classList.contains('regular')) {

                // Remove the space from text
                activeSpan.textContent = text.slice(0, -1);
                // Remove active id
                activeSpan.removeAttribute("id");

                // call new span function
                newSpan = this.new_span('\u00A0','regular');

                activeSpan.insertAdjacentElement('afterend', newSpan);

                // Call move cursor to end function
                this.moveCursorToPosition(true);

            }

            // When user continues typing after a punctuation
            else if(activeSpan.classList.contains('punctuation')) {

                if(text == ''){
                    // change class to regular
                    activeSpan.setAttribute('class', 'regular');

                }
                else if(lastLetter != "\u00A0"){
                    
                    // Remove active id
                    activeSpan.removeAttribute("id");

                    // Split the first and last letter in text
                    let firstLetter = text.slice(0, -1);
                    activeSpan.textContent = firstLetter;

                    // call new span function
                    newSpan = this.new_span(lastLetter,'regular');

                    activeSpan.insertAdjacentElement('afterend', newSpan);

                    // Call move cursor to end function
                    this.moveCursorToPosition(true);
                
                }
            }

            // When user continues typing after an operator
            else if(activeSpan.classList.contains('operator')) {
                        
                if(text == ''){
                    // change class to regular
                    activeSpan.setAttribute('class', 'regular');
                }
                else if(lastLetter != "\u00A0" && this.getKeyByValueArray(reserved_words,lastLetter) != 'operator'){
                    // Remove active id
                    activeSpan.removeAttribute("id");
    
                    // Split the first and last letter in text
                    let firstLetter = text.slice(0, -1);
                    activeSpan.textContent = firstLetter;

                    // call new span function
                    newSpan = this.new_span(lastLetter,'regular');

                    activeSpan.insertAdjacentElement('afterend', newSpan);
    
                    // Call move cursor to end function
                    this.moveCursorToPosition(true);
                }
            }

            // When a user continues to type after creating a keyword
            else if(activeSpan.classList.contains('keyword') && this.getKeyByValueArray(reserved_words,text) != 'keyword' ) {

                // Word before last letter
                let if_keyword_check = text.slice(0, -1);
                // check if last letter is in the reserved words
                let is_member = this.getKeyByValueArray(reserved_words,lastLetter);
                // Get the span before the active span
                let previousSpan = activeSpan.previousElementSibling;
                // Get the class after the active span
                let nextSpan = activeSpan.nextElementSibling;


                if(this.getKeyByValueArray(reserved_words,if_keyword_check) == 'keyword' && is_member ){

                    // remove id from the active span
                    activeSpan.removeAttribute("id");
                    // set text content of the active span to if_keyword_check
                    activeSpan.textContent = if_keyword_check;
                    // create a new span with last letter
                    let newSpan = this.new_span(lastLetter, is_member);
                    // insert the new span after the active span
                    activeSpan.insertAdjacentElement('afterend', newSpan);

                    // Call move cursor to end function
                    this.moveCursorToPosition(true);

                }
                else{

                    // when the previous span is a regular span
                    if(previousSpan && previousSpan.classList.contains('regular') && (!nextSpan || !nextSpan.classList.contains('regular'))) {

                        // Append text to the previous span text content
                        previousSpan.textContent += text;

                        // Remove active id from the active span
                        activeSpan.removeAttribute("id");
                        // Add active id to the previous span
                        previousSpan.setAttribute("id", "active");

                        // Remove the active span
                        activeSpan.remove();

                    }

                    else if(nextSpan && nextSpan.classList.contains('regular') && (!previousSpan || !previousSpan.classList.contains('regular'))){
                        
                        // Append text to the previous span text content
                        nextSpan.textContent = text + nextSpan.textContent;

                        // Remove active id from the active span
                        activeSpan.removeAttribute("id");
                        // Add active id to the previous span
                        nextSpan.setAttribute("id", "active");

                        // Remove the active span
                        activeSpan.remove();

                    }

                    else if (previousSpan && previousSpan.classList.contains('regular') && nextSpan && nextSpan.classList.contains('regular')){

                        // Append text to the previous span text content
                        previousSpan.textContent += text + nextSpan.textContent;

                        // Remove active id from the active span
                        activeSpan.removeAttribute("id");
                        // Add active id to the previous span
                        previousSpan.setAttribute("id", "active");

                        // Remove the active span
                        activeSpan.remove();

                        // Remove the next span
                        nextSpan.remove();

                    }

                    else{
                        // Return the span class to regular
                        activeSpan.setAttribute('class', 'regular');
                    }

                }

            }

            else {

                // Define span create
                let spanCreate = false;

                // Get the cursor position
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
                const cursorPosition = range.startOffset;

                if(cursorPosition != length) {

                    let words = text.trim().split(/\s+/);

                    let wordLen = words.length;
                    for (let i = 0; i < wordLen; i++) {

                        let memberType = this.getKeyByValueArray(reserved_words,words[i]);

                        // Check if word if in the reserved words
                        if (memberType){

                            // Create two new empty arrays to store the new sentences
                            const newSentences = [[], []];

                            // Iterate over the array of words and add each word to the corresponding new sentence array
                            let currentSentenceIndex = 0;
                            for (const word of words) {
                                if (word == words[i]) {
                                    // If the current word is a punctuation mark, start a new sentence
                                    currentSentenceIndex++;
                                } else {
                                    // If the current word is not a punctuation mark, add it to the current sentence
                                    newSentences[currentSentenceIndex].push(word);
                                }
                            }

                            // change text content of the active span to the first sentence#
                            activeSpan.textContent = newSentences[0].join(' ') + '\u00A0';
                            // remove id from the active span
                            activeSpan.removeAttribute("id");

                            // create a new span with call of member type
                            let memberClass = this.new_span(words[i], memberType);
                            // insert the new span after the active span
                            activeSpan.insertAdjacentElement('afterend', memberClass);

                            // create a new span with the second sentence
                            let secondSentence = this.new_span('\u00A0' + newSentences[1].join(' '), 'regular');
                            // remove id from second sentence
                            secondSentence.removeAttribute("id");
                            // insert the new span after the member class span
                            memberClass.insertAdjacentElement('afterend', secondSentence);

                            // set span create to true
                            spanCreate = true;
                            
                        }

                    }

                }
                else{

                    // lets check for punctualtions
                    if (this.getKeyByValueArray(reserved_words,lastLetter) == 'punctuation') {

                        if(text == lastLetter) {
                            // Change class to punctuation
                            activeSpan.setAttribute('class', 'punctuation');
                        }
                        else{

                            // Remove the last character and update text content
                            let secondLastLetter = text[length - 2];
                            if(secondLastLetter == " ") {
                                // Remove the last character and update text content
                                activeSpan.textContent = text.slice(0, -2) + '\u00A0';
                            }   
                            else {
                                activeSpan.textContent = text.slice(0, -1);
                            }
                            // Remove active id 
                            activeSpan.removeAttribute("id");

                            // Create a new punctuation span
                            let spanPunc = document.createElement('span');
                            spanPunc.classList.add('punctuation');
                            spanPunc.textContent = lastLetter;
                            spanPunc.setAttribute("id", "active");
                            activeSpan.insertAdjacentElement('afterend', spanPunc);

                            // Change create span to true
                            spanCreate = true;

                        }
                    }
                    else{ 

                        // Now lets check for operators
                        if (this.getKeyByValueArray(reserved_words,lastLetter) == 'operator') {

                            if(text == lastLetter && activeSpan.classList.contains('regular')) {
                                // Simply change the class to operator
                                activeSpan.setAttribute('class', 'operator');
                            }
                            else{

                                if(!activeSpan.classList.contains('operator')){

                                    // Check if the second last charater is a space
                                    let secondLastLetter = text[length - 2];
                                    if(secondLastLetter == " ") {
                                        // Remove the last character and update text content
                                        activeSpan.textContent = text.slice(0, -2) + '\u00A0';
                                    }   
                                    else {
                                        activeSpan.textContent = text.slice(0, -1);
                                    }
                                    
                                    // Remove active id 
                                    activeSpan.removeAttribute("id");

                                    // Create a new operator span
                                    let spanOperator = this.new_span(lastLetter, 'operator')
                                    activeSpan.insertAdjacentElement('afterend', spanOperator);

                                    // Change create span to true
                                    spanCreate = true;

                                }
                                
                            }
                        }
                        else {

                            let words = text.trim().split(/\s+/);
                            let lastWord = words[words.length - 1];

                            // Now lets check for if last word is a keyword
                            if (this.getKeyByValueArray(reserved_words,lastWord)){

                                // Check if length of text and keyword is same
                                if(text.length == lastWord.length) {

                                    // Change the color of the keyword
                                    activeSpan.setAttribute('class', 'keyword');

                                }
                                else {

                                    let restOfText = text.replace(/\S*$/, "");
                                    let newRestOfText = restOfText.replaceAll(" ", "\u00A0");
                                    activeSpan.textContent = newRestOfText;
                                    // remove id from the active span
                                    activeSpan.removeAttribute("id");

                                    // call new span function
                                    newSpan = this.new_span(lastWord, 'keyword');

                                    activeSpan.insertAdjacentElement('afterend', newSpan);

                                    // Change create span to true
                                    spanCreate = true;

                                }

                            }

                        }

                    }

                }

                // Call move cursor to end function
                this.moveCursorToPosition(spanCreate);

            }

        });
        
    }

}



// Get the Editor container
const the_editor = document.getElementById("the_editor");

// Initialise the class
const editor = new CodePinionEditor(the_editor);

// define current line indwx and numbering
let index = 0;
let line_number = 1;

// Initialize the editor
editor.init(index,line_number);
