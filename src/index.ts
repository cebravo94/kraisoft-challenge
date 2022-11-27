let parentDiv = document.getElementById("parent");
let draggableObject = document.getElementById("draggable");

draggableObject.addEventListener('mousedown', onMouseDown);

const draggableObjectSize = 50;

// Window properties
var screenHeight = window.innerHeight;
var screenWidth = window.innerWidth;
var leftBound = screenWidth*0.1
var rightBound = screenWidth*0.9
var topBound = screenHeight*0.1
var lowerBound = screenHeight*0.9

// Object properties
var draggablePositionX: number;
var draggablePositionY: number;

const screenObserver = new ResizeObserver(entries => {
    entries.forEach(entry => {
        let draggablePositionRelativeToParentHeight = draggablePositionY / screenHeight;
        let draggablePositionRelativeToParentWidth = draggablePositionX / screenWidth;

        screenHeight = entry.contentRect.height;
        screenWidth = entry.contentRect.width;
        leftBound = screenWidth*0.1;
        rightBound = screenWidth*0.9;
        topBound = screenHeight*0.1;
        lowerBound = screenHeight*0.9;

        let newXCoordinates = draggablePositionRelativeToParentWidth * screenWidth;
        let newYCoordinates = draggablePositionRelativeToParentHeight * screenHeight;
        draggableObject.style.top = (newYCoordinates + 'px');
        draggableObject.style.left = (newXCoordinates + 'px');
        draggablePositionX = newXCoordinates;
        draggablePositionY = newYCoordinates;
    });
});
screenObserver.observe(parentDiv)

function onMouseDown(event: any) {
    let rect = event.target.getBoundingClientRect();
    let startingX = event.clientX;
    let startingY = event.clientY;

    event.target.rectX = rect.left;
    event.target.rectY = rect.top;
    event.target.startingX = startingX;
    event.target.startingY = startingY;

    document.addEventListener('mousemove', onMouseMove);
}

function onMouseMove(event: any) {
    let currentX = event.clientX;
    let currentY = event.clientY;
    event.target.style.position = 'absolute';

    let newXPosition = event.target.rectX + currentX - event.target.startingX;
    let newYPosition = event.target.rectY + currentY - event.target.startingY;

    if (newXPosition + draggableObjectSize < rightBound && newXPosition > leftBound) {
        event.target.style.left = (newXPosition + 'px');
        draggablePositionX = newXPosition;
    }
    if (newYPosition + draggableObjectSize < lowerBound && newYPosition > topBound) {
        event.target.style.top = (newYPosition + 'px');
        draggablePositionY = newYPosition;
    }

    event.target.addEventListener('mouseup', cleanUpListeners);
    event.target.addEventListener('mouseleave', cleanUpListeners);
}

function cleanUpListeners(event: any) {
    document.removeEventListener('mousemove', onMouseMove);
    event.target.removeEventListener('mouseup', onMouseMove);
    event.target.removeEventListener('mouseleave', onMouseMove);
}