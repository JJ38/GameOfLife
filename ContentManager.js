
const parser = new DOMParser();

const contentManagerWindows = document.querySelectorAll('.window');
const draggableLeft = document.querySelector('.leftdraggable');
const draggableRight = document.querySelector('.rightdraggable');
const contentManagerWrapper = document.querySelector('.contentmanagerwrapper');
const content = document.querySelector('.content');
const head = document.querySelector('head');
const selectPage = document.getElementById("selectpage");
const selectPageForm = document.getElementById("selectpageform");
const selectedResolution= document.getElementById("selectresolution");
const saveButton = document.getElementById("savebutton");
const editableContentValue = document.getElementById("editabledocumentvalue");
const fontLinks = document.getElementById("fontlinks");
const fileNameValue = document.getElementById("filename");
const rightClickMenu = document.getElementById("rightclickmenu");
const beforeText = document.getElementById("beforetext");
const afterText = document.getElementById("aftertext");
const deleteOption = document.getElementById("deleteoption");


const leftBox = contentManagerWindows[0];
const midBox = contentManagerWindows[1];
const rightBox = contentManagerWindows[2];

let innerWidth = window.innerWidth;
let sidebarWidth = screen.width * 0.12;


draggableLeft.style.right = innerWidth - sidebarWidth + 'px';
draggableRight.style.right = sidebarWidth + 'px';


let leftHold = false;
let rightHold = false;
let x = 0;
let midBoxLeftClick = false
let initialXPos = 0;
let initialYPos = 0;
let initialAbsoluteRight = 0;
let initialAbsoluteTop = 0;
let contentScale = 0.55;
let links = [];
let fontFamilys = [];
let fontsInUse = [];
let lastFontInUse;
let selectedFileLinks = [];
let selectedElementRightClick;
let selectedObjectTreeElementRightClick;

let intitialDifferenceX = 0;
let intialDifferenceY = 0;
let initialDistanceDifference = 0;

let leftWidth = sidebarWidth;
let midWidth = innerWidth - (2 * sidebarWidth);
let rightWidth = sidebarWidth;

var allObjectTreeElements = [];
var allSelectedPageElements = [];
var allEditableDocumentElements = [];

var editableDocument; //select page as document
var contentHTML;   //selected page as string
var selectedFile = selectPage.value;

var labelFor;

var objectTreeDom = parser.parseFromString('<div class = root> </div>', "text/html").body.children[0];
const editableElements = ['H1', 'H2', 'H3', 'H4', 'P', 'A', 'LABEL'];


//Set object window, edit window and attribute window
contentManagerWrapper.style.gridTemplateColumns = sidebarWidth + 'px ' + (innerWidth - (2 * sidebarWidth)) + 'px ' + sidebarWidth + 'px';

//gets files of initialpage 

//getFile(selectedFile);

//sets content to content div
//content.innerHTML =  contentHTML;
console.log(selectedFile);
editableDocument = parser.parseFromString("<!DOCTYPE html><html><head><body></body></head></html>", "text/html");

//add body element to editable document


let inBody = false;

let editableDocumentBody = editableDocument.body;
let editableDocumentHead = editableDocument.head;

for(let i = 0; i < content.children.length; i++){
    if(content.children[i].tagName == "HEADER" || inBody){
        inBody = true;
        console.log(content.children[i]);
        editableDocumentBody.appendChild(getCopyOfElement(content.children[i]));

    }else{
        editableDocumentHead.appendChild(getCopyOfElement(content.children[i]));
    }
}

console.log(editableDocumentBody);
console.log(editableDocumentHead);
console.log(editableDocument.head);
console.log(editableDocument)
//find end of head tag in list of children

content.innerHTML = editableDocument.querySelector('body').innerHTML;

wrapDivTextInPTag(editableDocument);
generateObjectTree();
getCSSFiles();



content.style.transform = "matrix(" + (contentScale) + ",0,0," + (contentScale) + ",0,0)";
content.style.right = ((midBox.getBoundingClientRect().width - content.getBoundingClientRect().width) / 2) +'px';


//add event listeners to


//Event listeners


draggableLeft.addEventListener('pointerdown', (e) =>{
    x = e.clientX;
    leftHold = true;
});

draggableRight.addEventListener('touchstart', e =>{
   
    x = e.clientX;
    rightHold = true;
    
});

document.addEventListener('pointerup', (e) => {

    leftHold = false;
    rightHold = false;
    midBoxLeftClick = false;
});


document.addEventListener('pointermove', (e) => {
    
    if(leftHold){
     
        //check if sliders are within 100px of each other or mouse movement is to the left
        if((draggableLeft.getBoundingClientRect().right + 100) < draggableRight.getBoundingClientRect().right || (e.clientX < x && x < draggableRight.getBoundingClientRect().right - 100)){

           moveLeftSlider(e.clientX);
        }

        x = e.clientX;

    } 
    if(rightHold){
       
        //check if sliders are within 100px of each other or mouse movement is to the right
        if(((draggableRight.getBoundingClientRect().right - 100) > draggableLeft.getBoundingClientRect().right) || (e.clientX > x && x > (draggableLeft.getBoundingClientRect().right + 100))){
           moveRightSlider(e.clientX);
        }

        x = e.clientX;

    }   

});

onresize = (event) => {

    //change size of containers in proportion to change in inner width

    //get ratio of screen size taken up by each window
    let leftRatio = innerWidth/leftWidth;
    let midRatio = innerWidth/midWidth;
    let rightRatio = innerWidth/rightWidth;


    //change position of sliders
    let leftSliderOffset = draggableLeft.getBoundingClientRect().right;
    let rightSliderOffset = draggableRight.getBoundingClientRect().right;

    let leftSliderOffsetRatio = innerWidth / leftSliderOffset;
    let rightSliderOffsetRatio = innerWidth / rightSliderOffset;


    //update to new inner width
    innerWidth = window.innerWidth;

    leftWidth = innerWidth / leftRatio;
    midWidth = innerWidth / midRatio;
    rightWidth = innerWidth / rightRatio;


    contentManagerWrapper.style.gridTemplateColumns = leftWidth + 'px ' + midWidth + 'px ' + rightWidth + 'px';


    draggableLeft.style.right = rightWidth + midWidth + 'px';
    draggableRight.style.right = rightWidth + 'px';

};



midBox.addEventListener('pointerdown', (e) => {
    
    initialAbsoluteRight = midBox.getBoundingClientRect().right - content.getBoundingClientRect().right; 
    initialAbsoluteTop = content.getBoundingClientRect().top - midBox.getBoundingClientRect().top; 
    
    initialXPos = e.clientX;
    initialYPos = e.clientY;
    midBoxLeftClick = true;


});

//mobile
midBox.addEventListener('touchstart', (e) => {
    console.log("touchstart");
    
    initialAbsoluteRight = midBox.getBoundingClientRect().right - content.getBoundingClientRect().right; 
    initialAbsoluteTop = content.getBoundingClientRect().top - midBox.getBoundingClientRect().top; 
    
    initialXPos = e.touches[0].clientX;
    initialYPos = e.touches[0].clientY;
    midBoxLeftClick = true;


});

midBox.addEventListener('pointermove', (e) => {
    
    if(midBoxLeftClick){
    
        let differenceX = initialXPos - e.clientX;   
        let differenceY = e.clientY - initialYPos;

        content.style.right = (initialAbsoluteRight + differenceX) +'px';
        content.style.top = (initialAbsoluteTop + differenceY)  + 'px';

    }
    
});

midBox.addEventListener('touchmove', (e) => {
    console.log("touchmove");
    if(midBoxLeftClick){
        console.log("true");
        console.log(initialXPos);
        console.log(e.touches[0].clientX);

        let differenceX = initialXPos - e.touches[0].clientX;   
        let differenceY = e.touches[0].clientY - initialYPos;

        console.log(differenceX);
        console.log(differenceY);

        content.style.right = (initialAbsoluteRight + differenceX) +'px';
        content.style.top = (initialAbsoluteTop + differenceY)  + 'px';

    }
    
});

midBox.addEventListener('wheel', (e) =>{


    if(e.deltaY > 0){//mwheeldown
        scaleAmount = -0.02;
        
    }else{//mwheelup
        scaleAmount = 0.02;

    }

    var matrix = "matrix(" + (contentScale + scaleAmount) + ",0,0," + (contentScale + scaleAmount) + ",0,0)";
    contentScale = contentScale + scaleAmount;
    content.style.transform = matrix;

});

midBox.addEventListener('touchstart', e =>{

    if(e.touches.length == 2){

        intitialDifferenceX = e.touches[0].clientX - e.touches[1].clientX;
        intialDifferenceY = e.touches[0].clientY - e.touches[1].clientY;
        initialDistanceDifference = intialDifferenceY + intialDifferenceY;

    }

});

midBox.addEventListener('touchmove', e =>{

    if(e.touches.length == 2){
        e.preventDefault()

        const relativeDifferenceX = e.touches[0].clientX - e.touches[1].clientX;
        const relativeDifferenceY = e.touches[0].clientY - e.touches[1].clientY;

        const relativeDistance = relativeDifferenceX + relativeDifferenceY;

        const changeInDistance = initialDistanceDifference - relativeDistance;
        
        
        if(changeInDistance > 0){//mwheeldown
            scaleAmount = -0.02;
            
        }else{//mwheelup
            scaleAmount = 0.02;
    
        }

        var matrix = "matrix(" + (contentScale + scaleAmount) + ",0,0," + (contentScale + scaleAmount) + ",0,0)";
        contentScale = contentScale + scaleAmount;
        content.style.transform = matrix;
      

    }

});



beforeText.addEventListener('click', e => {
    
    createNewTextElement(selectedElementRightClick,"BEFORE");
});


afterText.addEventListener('click', e => {
    createNewTextElement(selectedElementRightClick,"AFTER");
});

deleteOption.addEventListener('click', e => {
    selectedElementRightClick.remove();
    selectedObjectTreeElementRightClick.remove();
});

var rightClickMenuChildren = [];
rightClickMenuChildren.push(getAllElements(rightClickMenu, rightClickMenuChildren));
rightClickMenuChildren = rightClickMenuChildren.slice(1, rightClickMenuChildren.length - 1);

var listwrappers = [];

for(let i = 0; i < rightClickMenuChildren.length; i++){
    if(rightClickMenuChildren[i].classList.contains("listwrapper")){
        listwrappers.push(rightClickMenuChildren[i]);
    }
    
}

window.addEventListener('click', e => {
    hideContextMenu();
});

function hideContextMenu(){
    rightClickMenu.classList.add("hidden");
    for(let i = 0; i < listwrappers.length; i++){
        if(!listwrappers[i].classList.contains("rootchild")){
            listwrappers[i].classList.add("hidden");
        }
        
    }
}


for(let i = 0; i < rightClickMenuChildren.length; i++){ 
    console.log("loop");
    rightClickMenuChildren[i].addEventListener('mouseover', e => {
        e.stopPropagation();

        if(rightClickMenuChildren[i].children.length > 0){
            rightClickMenuChildren[i].children[0].classList.remove("hidden");

        
        }
       
        var allSiblingElements = Array.from(rightClickMenuChildren[i].parentElement.children);
        
        var siblingElements = [];
        //remove current item from list of siblings
        for(let j = 0; j < allSiblingElements.length; j++){
            if(allSiblingElements[j] != rightClickMenuChildren[i]){
                siblingElements.push(allSiblingElements[j]);
            }
        }


        var siblingElementOpen;

        //find sibling elements that have children visible
        for(let i = 0; i < siblingElements.length; i++){
            if(siblingElements[i].children.length > 0){
                const childElement = siblingElements[i].children[0];
               if(!childElement.classList.contains("hidden")){
                siblingElementOpen = siblingElements[i];
               }
                
            }
           
        }

        //hide all child elements
        if(siblingElementOpen != null){
            var allChildElements = [];
            allChildElements.push(getAllElements(siblingElementOpen,allChildElements));
            allChildElements = allChildElements.slice(1, allChildElements.length - 1);
            
            for(let i = 0; i < allChildElements.length; i++){
                if(allChildElements[i].classList.contains("listwrapper")){
                    allChildElements[i].classList.add("hidden");
                }
                
            }

        }

    });

}

function createNewTextElement(selectedElementRightClick, insertPosition){

    const parentElement = selectedObjectTreeElementRightClick.parentElement.parentElement;
    const insertBeforeElement = selectedObjectTreeElementRightClick.parentElement;

    const newObjectTreeElement = document.createElement('li');
    const newObjectTreeElementDiv = document.createElement('div');
    newObjectTreeElementDiv.innerHTML = "P";
    newObjectTreeElementDiv.style.padding
    newObjectTreeElement.appendChild(newObjectTreeElementDiv);




    const newText = document.createElement('p');
    newText.innerHTML = "Newly added text";
    newText.style.margin = 0;

    if(insertPosition == "BEFORE"){
        
        parentElement.insertBefore(newObjectTreeElement, insertBeforeElement);
        selectedElementRightClick.parentElement.insertBefore(newText, selectedElementRightClick);
    }else{
        parentElement.insertBefore(newObjectTreeElement, insertBeforeElement.nextElementSibling);
        selectedElementRightClick.parentElement.insertBefore(newText, selectedElementRightClick.nextElementSibling);
    }
    
    addEventListenersToSelectedPage(newObjectTreeElementDiv, newText);

    elementSelect(newObjectTreeElementDiv, newText);

    return newText;
}


function savePage(){

    //remove contenteditable tag on currently selected element
    const currentlySelected = document.querySelector('.objecttreeselectoutline');

    if(currentlySelected != null){
        currentlySelected.classList.remove('objecttreeselectoutline');
        currentlySelected.contentEditable = false;
    }

    //if currently selected element is a label add the for property back before saving
    if(currentlySelected.tagName == "LABEL"){
        currentlySelected.htmlFor = labelFor;
    }

    const newBody = document.createElement('body');
    console.log(newBody);
    const newBodyElements = document.querySelector('.content').children;
    var parser = new DOMParser();   


    for(let i = 0; i < newBodyElements.length; i++){
        const copyOfElementDocument = parser.parseFromString(newBodyElements[i].outerHTML, 'text/html');
        var copyOfElement;
        if(copyOfElementDocument.querySelector('body').childElementCount == 0){
            copyOfElement = copyOfElementDocument.querySelector('head').firstChild;
        }else{
            copyOfElement = copyOfElementDocument.querySelector('body').firstChild;
        }
        //console.log(copyOfElement);
        newBody.appendChild(copyOfElement);
    }

    //console.log(newBody);

    console.log(editableDocument.querySelector('head'));
    
    //add header info to newPageHTML
    
   
    const newHead = document.createElement('head');
    const newHeadElements = editableDocument.querySelector('head').children;
    console.log(editableDocument.querySelector('head'));
    //create link tags

    //remove style elements



    const editableDocumentHead =  editableDocument.querySelector('head');

    for(let i = 0; i < newHeadElements.length; i++){

        //check if link already exist in document
        if(newHeadElements[i].tagName != "STYLE"){
            newHead.appendChild(getCopyOfElement(newHeadElements[i]));
           
        }
        
    }

    
    // console.log(getCopyOfElement(newHead).parentNode);

    const fontsInUseNoDuplicates = Array.from(new Set(fontsInUse));

    console.log(fontsInUseNoDuplicates.length);
    
    for(let i = 0; i < fontsInUseNoDuplicates.length; i++){
        const link = document.createElement('link');
        link.rel = "stylesheet";
        link.href = 'https://fonts.googleapis.com/css?family=' + fontsInUseNoDuplicates[i];
        link.id = fontsInUseNoDuplicates[i].replace(" ", "");

        newHead.appendChild(link); 
    }

    //newPageHTML headerinfo plus bodgy info

    var newPageHTML = document.createElement('html');
    newPageHTML.appendChild(newHead);
    newPageHTML.appendChild(newBody);

    console.log(newPageHTML);

    editableContentValue.value = "<!DOCTYPE html>"  + newPageHTML.outerHTML;
    fileNameValue.value = selectedFile;

    console.log(editableContentValue.value);
    asyncAlert(fileNameValue.value + " has been saved");
    editableContentValue.form.submit();
    
}

async function asyncAlert($message){
    alert($message);
}


function moveRightSlider(moveToX){

    rightWidth = innerWidth - moveToX;
    midWidth = innerWidth - leftWidth - (innerWidth - moveToX);

    contentManagerWrapper.style.gridTemplateColumns = leftWidth + 'px ' + midWidth + 'px ' + rightWidth + 'px';

    //move slide
    draggableRight.style.right = innerWidth - moveToX + 'px';
        
}

function moveLeftSlider(moveToX){

    leftWidth = innerWidth - (innerWidth - moveToX);
    midWidth = innerWidth - (innerWidth - (innerWidth - moveToX)) - rightWidth;


    contentManagerWrapper.style.gridTemplateColumns = leftWidth + 'px ' + midWidth + 'px ' + rightWidth + 'px';

    //move slide
    draggableLeft.style.right = innerWidth - moveToX + 'px';
}


function wrapDivTextInPTag(editableDocument){
    
    getAllElements(editableDocument, allEditableDocumentElements);

    for(let i = 0; i < allEditableDocumentElements.length; i++){
        if(allEditableDocumentElements[i].tagName == 'DIV'){
            
            var elementInnerHTML = allEditableDocumentElements[i].innerHTML;
            const elementChildren = allEditableDocumentElements[i].children;

            for(let i = 0; i < elementChildren.length; i++){
                
                elementInnerHTML = elementInnerHTML.replaceAll(elementChildren[i].outerHTML, "");
                
            }
            
            if(elementInnerHTML.trim().length > 0){
         
                const textWrappedInPTag = document.createElement('p');
                textWrappedInPTag.style.margin = 0;
                textWrappedInPTag.style.padding = 0;
                textWrappedInPTag.innerHTML = elementInnerHTML;

                allEditableDocumentElements[i].innerHTML = allEditableDocumentElements[i].innerHTML.replace(elementInnerHTML, textWrappedInPTag.outerHTML);
            
            }   
        }
    }
}


//Used to print out elements in console as console.log is pass by reference not value
function getCopyOfElement(element){

    const copyOfElementDocument = parser.parseFromString(element.outerHTML, 'text/html');
    var copyOfElement;
    if(copyOfElementDocument.querySelector('body').childElementCount == 0){
        copyOfElement = copyOfElementDocument.querySelector('head').firstChild;
    }else{
        copyOfElement = copyOfElementDocument.querySelector('body').firstChild;
    }
    return copyOfElement;
}

function getCSSFiles(){

    //remove links from previously selected file
    for(let i = 0; i < selectedFileLinks.length; i++){
        
        head.removeChild(selectedFileLinks[i]);
    }
  
    const selectedFileHead = editableDocument.querySelector('head');

    selectedFileLinks = selectedFileHead.querySelectorAll('link');
    fontsInUse = [];
    

    for(let i = 0; i < selectedFileLinks.length; i++){
        
        head.appendChild(selectedFileLinks[i]);

        if(selectedFileLinks[i].href.startsWith("https://fonts.googleapis.com/css?family=")){
            
            //const font = selectedFileLinks[i].href.replace("https://fonts.googleapis.com/css?family=", "").replace("%20", " ");

            //fontsInUse.push(font);
        }else{
            //add copy of link element back to orignal
            selectedFileHead.appendChild(getCopyOfElement(selectedFileLinks[i]));
        }

    }

    //get all fonts in use

    for(let i = 0; i < allSelectedPageElements.length; i++){

        if(editableElements.includes(allSelectedPageElements[i].tagName)){
            fontsInUse.push(window.getComputedStyle(allSelectedPageElements[i], null).getPropertyValue('font-family').replaceAll('"', ""));
        }
    }


    console.log(fontsInUse);

}

function selectOnChange(){

    selectedFile = selectPage.value;
   
}

function generateObjectTree(){


    const root = editableDocument.querySelector('body');

    var parentElement = root;

    objectTreeDom.replaceChildren(getChildElements(parentElement, 1));

    document.querySelector('.objecttree').innerHTML = objectTreeDom.innerHTML;

    //add event listeners to newly generated elements
    let objectTreeExpandableLists = document.querySelectorAll('.expandablelist');

    for(let i = 0; i < objectTreeExpandableLists.length; i++){
        objectTreeExpandableLists[i].addEventListener('click', e => {
            objectTreeExpandableLists[i].nextElementSibling.classList.toggle("nested");
        });
    }
    
    allObjectTreeElements = [];
    allSelectedPageElements = [];
   
    //get all object tree elements in array
    allObjectTreeElements.push(getAllElements(document.querySelector('.objecttree'), allObjectTreeElements));

    var filteredAllObjectTreeElements = allObjectTreeElements.filter(i => i.tagName != 'UL' && i.tagName != 'LI');
    filteredAllObjectTreeElements = filteredAllObjectTreeElements.slice(1, filteredAllObjectTreeElements.length - 1); //removes object tree wrapper 
    
    
    //get all corrosponding elements in selected page in array
    allSelectedPageElements.push(getAllElements(document.querySelector('.content'), allSelectedPageElements));

    const filteredAllSelectedTreeElements = allSelectedPageElements.slice(0, allSelectedPageElements.length - 1);


    //adds event listeners to object tree to interact with corrosponding selected page element
    for(let i = 0; i < filteredAllSelectedTreeElements.length; i++){

        addEventListenersToSelectedPage(filteredAllObjectTreeElements[i], filteredAllSelectedTreeElements[i]);
    }
}

function addEventListenersToSelectedPage(objectTreeElement, selectedPageElement){

    objectTreeElement.addEventListener('mouseover', e => {
        e.stopPropagation();
        selectedPageElement.classList.add('objecttreehoveroutline');
       
    });

    objectTreeElement.addEventListener('mouseout', e => {
        e.stopPropagation();
        selectedPageElement.classList.remove('objecttreehoveroutline');
       
    });

    objectTreeElement.addEventListener('click', e => {
        e.stopPropagation();
        elementSelect(objectTreeElement, selectedPageElement);
        rightClickMenu.classList.add("hidden");

    });

    selectedPageElement.addEventListener('click', e => {
        e.stopPropagation(selectedPageElement);

        hideContextMenu();

        labelDoubleClick(selectedPageElement);

        elementSelect(objectTreeElement, selectedPageElement);
       
    });

    objectTreeElement.addEventListener('contextmenu', (e) => {
        e.preventDefault();//stops context menu showing
        if(objectTreeElement.innerHTML.replaceAll(" ", "").replace("v", "") != "BODY"){
            selectedElementRightClick = selectedPageElement;
            selectedObjectTreeElementRightClick = objectTreeElement;
            rightClickMenu.style.left = e.clientX + "px";
            rightClickMenu.style.top = e.clientY + "px";
            rightClickMenu.classList.remove("hidden");
        }
     
    });

    selectedPageElement.addEventListener('contextmenu', (e) => {
        e.stopPropagation(selectedPageElement);
        e.preventDefault();//stops context menu showing

        //check if element is selected
        if(selectedPageElement.classList.contains("objecttreeselectoutline") && !selectedPageElement.classList.contains("content")){
            console.log(selectedPageElement);
            selectedElementRightClick = selectedPageElement;
            selectedObjectTreeElementRightClick = objectTreeElement;
            rightClickMenu.style.left = e.clientX + "px";
            rightClickMenu.style.top = e.clientY + "px";
            rightClickMenu.classList.remove("hidden");
        }
     
    });
}





function labelDoubleClick(element){
    const currentlySelected = document.querySelector('.objecttreeselectoutline');

    if(element.tagName == "LABEL"){

        if(currentlySelected != null && currentlySelected.tagName == "LABEL"){
            currentlySelected.htmlFor = labelFor;
        }

        labelFor = element.htmlFor;
        element.htmlFor = "";

    }else if(currentlySelected != null && currentlySelected.tagName == "LABEL"){
        currentlySelected.htmlFor = labelFor;
    }


}

//selects element in editable window and in object tree
function elementSelect(objectTreeElement, selectedElement){

    //highlight element in editable window
    highlightSelectedElementEditableWindow(selectedElement);
     
    //highlight element in object tree
    highlightSelectedElementObjectTree(objectTreeElement)

    //update attribute window
    generateAttributes(selectedElement);
   
}

function highlightSelectedElementEditableWindow(element){


    const currentlySelected = document.querySelector('.objecttreeselectoutline');
  
    //remove highlighting and content editable from previouosly selected element 
    if(currentlySelected != null){
        currentlySelected.classList.remove('objecttreeselectoutline');
        currentlySelected.contentEditable = false;

    }

    //add highlighting to selected element
    element.classList.add('objecttreeselectoutline');

    //make element editable
    if(editableElements.includes(element.tagName)){
        element.contentEditable = true;
        element.focus();
    }
}


function highlightSelectedElementObjectTree(objectTreeElement){

    //deselect currently selected
     currentlySelectedElement = document.querySelector('.listitemselected');
     if(currentlySelectedElement != null){
         currentlySelectedElement.classList.toggle('listitemselected');
     }
     
     //highlight newly selected item
     objectTreeElement.classList.toggle('listitemselected');

     //make newly selected item in object tree visible.

     var elementToCheck = getObjectTreeParentElement(objectTreeElement);
     var elementToMakeVisible = ulToAddVisibleTo(objectTreeElement);

     while(elementToCheck != document.querySelector('.selectpagewrapper')){
        elementToMakeVisible.classList = 'visible';
        elementToCheck = getObjectTreeParentElement(elementToCheck);
        elementToMakeVisible = ulToAddVisibleTo(elementToMakeVisible);
     }

}

function generateAttributes(selectedElement){

    const attributesWrapper = document.createElement('div');

    const elementName = document.createElement('div');
    elementName.innerHTML = selectedElement.tagName;
    attributesWrapper.appendChild(elementName);


    //get appearance attributes

    attributesWrapper.appendChild(generateAppearanceAttributes(selectedElement));
    //get dimension attributes

   
    //update attributes windows
    rightBox.replaceChildren(attributesWrapper);


    //add event listener to colour picker

    const backgroundColorPicker = document.getElementById("backgroundcolourpicker");
    backgroundColorPicker.addEventListener('input', e =>{
        selectedElement.style.backgroundColor = getBackgroundColor(backgroundColorPicker.value, backgroundAlphaPicker.value);
    });

    const backgroundAlphaPicker = document.getElementById("backgroundalphapicker");
    backgroundAlphaPicker.addEventListener('input', e =>{
        selectedElement.style.backgroundColor = getBackgroundColor(backgroundColorPicker.value, backgroundAlphaPicker.value);
    });
    //If text element
    if(editableElements.includes(selectedElement.tagName)){
        const fontColorPicker = document.getElementById("fontcolourpicker");
        fontColorPicker.addEventListener('input', e =>{
            selectedElement.style.color = getBackgroundColor(fontColorPicker.value, fontAlphaPicker.value);
        });

        const fontAlphaPicker = document.getElementById("fontalphapicker");
        fontAlphaPicker.addEventListener('input', e =>{
            console.log("fontalphapicker");
            selectedElement.style.color = getBackgroundColor(fontColorPicker.value, fontAlphaPicker.value);
        });


        const fontSize = document.getElementById("fontsize");
        fontSize.addEventListener('input', e =>{
            console.log(fontSize.value);
            selectedElement.style.fontSize = fontSize.value + 'px';
        });

        const fontFamily = document.getElementById("fontfamilyselector");
        fontFamily.addEventListener('change', e =>{
            setFontFamily(selectedElement, e.target.value);
        });

    }

 
}

//AIzaSyCEPmGmIT73SR0LLqVXxpAS11L_Q3FmJL8

function setFontFamily(selectedElement, fontFamily){


    console.log(fontFamily);

    var selectedElementAttributes = window.getComputedStyle(selectedElement);

    //remove current font from list

    currentFont = selectedElementAttributes.fontFamily;
    currentFont = currentFont.replaceAll('"', "");
    var indexOfCurrentFont = fontsInUse.indexOf(currentFont);
    if(indexOfCurrentFont != -1){
        fontsInUse.splice(indexOfCurrentFont,1);
    }

    //check if link for new font is already a child of the head tag

    var link = head.querySelector("#" + fontFamily.replace(" ", ""));


    if(link == null){
        link = document.createElement('link');
        link.rel = "stylesheet";
        link.id = fontFamily.replace(" ", "");
        link.href = "https://fonts.googleapis.com/css?family=" + fontFamily;
        head.appendChild(link);
    }


    // check if any other elements are using that font
    indexOfCurrentFont = fontsInUse.indexOf(currentFont);

    if(indexOfCurrentFont == -1){
        //remove link form head
        const link = head.querySelector('#' + currentFont.replace(' ', ''));

        //if link tag exist for font
        if(link != null){
            head.removeChild(link);
        }
    }

    //add newly selected font to list
    fontsInUse.push(fontFamily);

    console.log(fontsInUse);

    selectedElement.style.fontFamily = fontFamily;

}

function getBackgroundColor(RGB, alpha){

    return RGB + eightBitToHex(alpha);

}

function getAlphaValue(color){

    var rgba = getRGBAValues(color);
    if(rgba.length == 3){
        return 255;
    }

    return rgba[3] * 255;
}

function hexToDecimal(hex){

    var total;

    for(let i = 0; i < hex.length; i++){
        //is number
        if(hex.charCodeAt(i) < 58){
            total += hex.charCodeAt(i) * 16;
        }else{
            total += hex.charCodeAt(i) - 64;
        }
    }

    return total + '';

}


function generateAppearanceAttributes(selectedElement){

    const appearanceAttributeWrapper = document.createElement('div');
    
    var selectedElementAttributes = window.getComputedStyle(selectedElement);
    

    //background colour
    label = document.createElement('label');
    label.innerHTML = "Background Colour";
    label.htmlFor = "backgroundcolour";

    backgroundColourPicker = document.createElement('input');
    backgroundColourPicker.id = "backgroundcolourpicker"
    backgroundColourPicker.name = "backgroundcolour";
    backgroundColourPicker.type = 'color';
    backgroundColourPicker.value = convertRGBToHex(selectedElementAttributes.backgroundColor);
    //console.log(css);

    backgroundAlphaPicker = document.createElement('input');
    backgroundAlphaPicker.id = "backgroundalphapicker";
    backgroundAlphaPicker.type = "range";
    backgroundAlphaPicker.min = 0;
    backgroundAlphaPicker.max = 255;
    backgroundAlphaPicker.value = getAlphaValue(selectedElementAttributes.backgroundColor);

    appearanceAttributeWrapper.appendChild(label);
    appearanceAttributeWrapper.appendChild(backgroundColourPicker);
    appearanceAttributeWrapper.appendChild(backgroundAlphaPicker);

    //If text element
    if(editableElements.includes(selectedElement.tagName)){


        label = document.createElement('label');
        label.innerHTML = "Font Colour";
        label.htmlFor = "fontcolourpicker";
    
        fontColourPicker = document.createElement('input');
        fontColourPicker.id = "fontcolourpicker"
        fontColourPicker.name = "fontcolour";
        fontColourPicker.type = 'color';
        fontColourPicker.value = convertRGBToHex(selectedElementAttributes.color);
        //console.log(css);
    
        fontAlphaPicker = document.createElement('input');
        fontAlphaPicker.id = "fontalphapicker";
        fontAlphaPicker.type = "range";
        fontAlphaPicker.min = 0;
        fontAlphaPicker.max = 255;
        fontAlphaPicker.value = getAlphaValue(selectedElementAttributes.color);

        
        appearanceAttributeWrapper.appendChild(label);
        appearanceAttributeWrapper.appendChild(fontColourPicker);
        appearanceAttributeWrapper.appendChild(fontAlphaPicker);



        
        label = document.createElement('label');
        label.innerHTML = "Font Size";
        label.htmlFor = "fontsize";
    
        fontSize = document.createElement('input');
        fontSize.id = "fontsize"
        fontSize.name = "fontsize";
        fontSize.type = 'number';
        fontSize.value = selectedElementAttributes.fontSize.replace("px", "");


        appearanceAttributeWrapper.appendChild(label);
        appearanceAttributeWrapper.appendChild(fontSize);


        label = document.createElement('label');
        label.innerHTML = "Font Family";
        label.htmlFor = "fontfamilyselector";
    
        fontFamilySelector = document.createElement('select');
        fontFamilySelector.id = "fontfamilyselector"
        fontFamilySelector.name = "fontfamilyselector";
        fontFamilySelector.type = 'text';

        if(fontFamilys == 0){
            getFontFamilys(fontFamilySelector, selectedElementAttributes);
        }else{
            generateFontFamilyOptions(fontFamilySelector, selectedElementAttributes);
        }

        appearanceAttributeWrapper.appendChild(label);
        appearanceAttributeWrapper.appendChild(fontFamilySelector);

    }
    //add event listener to colour picker
    return appearanceAttributeWrapper;
}   

function generateFontFamilyOptions(fontFamilySelector, selectedElementAttributes){

    for(let i = 0; i < fontFamilys.length; i++){
        const option = document.createElement('option');
        option.value = fontFamilys[i];
        option.innerHTML = fontFamilys[i];

        if(option.value == selectedElementAttributes.fontFamily.replaceAll('"', "")){
            option.selected = "selected";
        }

        fontFamilySelector.appendChild(option);
    }
}


async function getFontFamilys(fontFamilySelector, selectedElementAttributes){

    if(fontFamilys.length == 0){

        fontFamilys.push("fetching fonts");

        const url = "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyCEPmGmIT73SR0LLqVXxpAS11L_Q3FmJL8";

        var response = await fetch(url);
        var json = await response.json();
        var fonts = json['items'];
       
        fontFamilys = [];

        for(let i = 0; i < fonts.length; i++){
            
            fontFamilys.push(fonts[i]['family']);
           
        }

        generateFontFamilyOptions(fontFamilySelector, selectedElementAttributes);

        console.log(fontFamilys);

        
    }


}

function eightBitToHex(number){

    const hexValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];

    hex = "";
    hex = hex + hexValues[Math.floor(number/16)];
    hex = hex + hexValues[number%16];

    return hex;

}

function getRGBAValues (color){

    var elementColour = color.replaceAll(" ", "");

    var rgba = [];
    
    var indexOfComma;

    const numberOfColourChannels = elementColour.length - elementColour.replaceAll(",", "").length + 1;

    //get rgba integer values
    for(let i = 0; i < numberOfColourChannels; i++){
        indexOfComma = 0;
        indexOfComma = elementColour.indexOf(",");
        if(indexOfComma == -1){
            rgba.push(elementColour.substring(0, elementColour.length - 1));
        }else{
            rgba.push(elementColour.substring(0, indexOfComma).replace(/\D/g,''));
        }
        
        elementColour = elementColour.substring(indexOfComma + 1, elementColour.length);

    }

    return rgba;
}

function convertRGBToHex(color){

    var rgba = getRGBAValues(color);

    //convert integer rgba values to hex

    var hex = "";
    const hexValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
    
    for(let i = 0; i < 3; i++){
        hex = hex + hexValues[Math.floor(rgba[i]/16)];
        hex = hex + hexValues[rgba[i]%16];
    }

    return '#' + hex;
}


function getObjectTreeParentElement(element){
    return element.parentElement.parentElement.parentElement.children[0];
}

function ulToAddVisibleTo(element){
    return element.parentElement.parentElement;
}


function getAllElements(element, array){

    array.push(element);

    if(element.children.length > 0){
       
        //loop through children
        for(let i = 0; i < element.children.length; i++){
           
            getAllElements(element.children[i], array);       
        
        } 
       
    }else{
        return element;
        
    }
    return element;
}


function getChildElements(element, layer){

    const listItemElement = document.createElement('li');
    

    if(element.children.length > 0){
        //add expandable div to tree
        const expandableDivElement = document.createElement('div');
        expandableDivElement.className = 'expandablelist listitem';
        expandableDivElement.innerHTML = 'v ' + element.tagName;
        expandableDivElement.style.paddingLeft = 15 * layer + 'px';


        listItemElement.appendChild(expandableDivElement);

        var unorderedList = document.createElement('ul');
        unorderedList.className = "nested"; 

        //loop through children
        for(let i = 0; i < element.children.length; i++){
       
            unorderedList.appendChild(getChildElements(element.children[i], layer + 1));
           
        } 

        listItemElement.appendChild(unorderedList);

        
    }else{
        const divTextHolder = document.createElement('div');
        divTextHolder.className = "listitem";
        divTextHolder.style.paddingLeft = 15 * layer + 'px';
        divTextHolder.innerHTML = element.tagName;
        listItemElement.appendChild(divTextHolder);
        return listItemElement;
        
    }

    return listItemElement;
}
