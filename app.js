console.log('Drawing App');

const display = document.querySelector("canvas"),
    btnTool = document.querySelectorAll('.tool'),
    fillColor = document.getElementById("fill-color"),
    sizeSlider = document.getElementById("size-slider"),
    btnColors = document.querySelectorAll(".colors .option"),
    colorPicker = document.getElementById("color-picker"),
    clearDisplay = document.querySelector(".clear-canvas"),
    saveImg = document.querySelector(".save-img")

context = display.getContext("2d");

let prevMouseX,
    prevMouseY,
    snapShot,
    isDrawing = false,
    selectedTool = "brush",
    selectedColor = "#000",
    brushwidth = 5;

const setDisplayBackground = () => {
    // setting whole display background to white, so the download img background will be white
    context.fillStyle = "#fff";
    context.fillRect(0, 0, display.width, display.height);
    // setting fillstyle back to the selectedcolor, it'll be the brush color
    context.fillStyle = selectedColor;
}

window.addEventListener("load", () => {
    // offsetHeight/Width returns viewable width/height of an element
    display.width = display.offsetWidth;
    display.height = display.offsetHeight;
    setDisplayBackground();
})

const startDraw = (e) => {
    isDrawing = true;
    // Passing current mouseX position as prevMouseX value
    prevMouseX = e.offsetX;
    // Passing current mouseY position as prevMouseY value
    prevMouseY = e.offsetY;
    // Creating new path to draw
    context.beginPath();
    // passing brushsize as line width
    context.lineWidth = brushwidth;
    // passing selected color as stroke style
    context.strokeStyle = selectedColor;
    // passing selected color as fill style
    context.fillStyle = selectedColor;
    // coping display data & passing as snapshot value..this avoids dragging the image
    snapShot = context.getImageData(0, 0, display.width, display.height);
}

const stopDraw = () => {
    isDrawing = false;
}

const drawRect = (e) => {
    // if fillColor isn't checked draw a rectangle with border else draw rectangle with background
    if (!fillColor.checked) {
        // creating rectangle according to the mouse pointer
        return context.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    else {
        context.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
}

const drawCircle = (e) => {
    // Creating a new path to draw circle
    context.beginPath();
    // getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    context.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    // if fillColor isn't checked draw a circle with border else draw circle with background
    fillColor.checked ? context.fill() : context.stroke();
}

const drawTriangle = (e) => {
    // Creating a new path to draw triangle
    context.beginPath();
    // moving triangle to the mouse pointer
    context.moveTo(prevMouseX, prevMouseY);
    // Creating first line according to the mouse pointer
    context.lineTo(e.offsetX, e.offsetY);
    // Creating bottom line of the triangle
    context.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    // closing path for draw third line and close triangle
    context.closePath();
    // if fillColor isn't checked draw a triangle with border else draw triangle with background
    fillColor.checked ? context.fill() : context.stroke();

}

const drawing = (e) => {
    // if IsDrawing is false return from here
    if (!isDrawing) return;
    // adding copied display data on this display 
    context.putImageData(snapShot, 0, 0);

    if (selectedTool === "brush" || selectedTool === "eraser") {
        // if selected tool is eraser then set strokestyle to white 
        // tp put white color on to the existing display content else set the stroke color to selected color
        context.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        // creating line according to the mouse pointer
        context.lineTo(e.offsetX, e.offsetY);
        // drawing/filling line with color
        context.stroke();
    }
    else if (selectedTool === "rectangle") {
        drawRect(e);
    }
    else if (selectedTool === "circle") {
        drawCircle(e);
    }
    else {
        drawTriangle(e);
    }
}

btnTool.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(selectedTool)
    });
});

// Passing Slider Value as brushsize
sizeSlider.addEventListener("change", () => brushwidth = sizeSlider.value);

// Fill Colors in Draw
btnColors.forEach((btn) => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // Passing Selected btn backgound color as selected color value
        selectedColor = window.getComputedStyle(btn).
            getPropertyValue("background-color");
    });
});

// Pick a Color in last option 
colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

// Clear Display 
clearDisplay.addEventListener("click", () => {
    // Clearing Whole Display
    context.clearRect(0, 0, display.width, display.height);
    setDisplayBackground();
});

// Save Image
saveImg.addEventListener("click", () => {
    const link = document.createElement("a");
    // passing current date as link download value
    link.download = `${Date.now()}.jpg`;
    // passing displayData as link href value
    link.href = display.toDataURL();
    // Clicking link to download image
    link.click();
});

display.addEventListener('mousedown', startDraw);
display.addEventListener('mousemove', drawing);
display.addEventListener('mouseup', stopDraw);