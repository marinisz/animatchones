const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const clearBtn = document.getElementById('clearCanvas');

let drawing = false;
let currentColor = colorPicker.value;
let currentSize = brushSize.value;
let isErasing = false;


ctx.fillStyle = '#fff';
ctx.fillRect(0, 0, canvas.width, canvas.height);

canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener('mousemove', (e) => {
    if (drawing) {
        ctx.strokeStyle = isErasing ? '#fff' : currentColor;
        ctx.lineWidth = currentSize;
        ctx.lineCap = 'round';
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    }
});
const eraserBtn = document.getElementById('eraserBtn');
if (eraserBtn) {
    eraserBtn.addEventListener('click', () => {
        isErasing = !isErasing;
        eraserBtn.textContent = isErasing ? 'Draw' : 'Eraser';
    });
}

canvas.addEventListener('mouseup', () => {
    drawing = false;
    ctx.beginPath();
});

canvas.addEventListener('mouseleave', () => {
    drawing = false;
    ctx.beginPath();
});


colorPicker.addEventListener('input', (e) => {
    currentColor = e.target.value;
});

brushSize.addEventListener('input', (e) => {
    currentSize = e.target.value;
});

clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

const framesColumn = document.getElementById('framesColumn');
const saveFrameBtn = document.getElementById('saveFrame');

if (framesColumn && saveFrameBtn) {
    saveFrameBtn.addEventListener('click', () => {
        const img = new Image();
        img.src = canvas.toDataURL();
        img.style.width = "100px";
        img.style.height = "75px";
        img.style.display = "block";
        img.style.marginBottom = "10px";
        framesColumn.appendChild(img);
    });
}

const playAnimationBtn = document.getElementById('playAnimation');
if (playAnimationBtn) {
    playAnimationBtn.addEventListener('click', () => {
        const frameImages = Array.from(framesColumn.querySelectorAll('img'));
        if (frameImages.length === 0) {
            alert('Nenhum frame salvo!');
            return;
        }
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.background = '#fff';
        popup.style.border = '2px solid #333';
        popup.style.padding = '20px';
        popup.style.zIndex = '9999';
        popup.style.boxShadow = '0 0 20px rgba(0,0,0,0.3)';
        const animImg = document.createElement('img');
        animImg.style.width = '400px';
        animImg.style.height = '300px';
        animImg.style.display = 'block';
        animImg.style.margin = '0 auto 20px auto';
        popup.appendChild(animImg);
        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = 'Download Animation';
        downloadBtn.style.display = 'block';
        downloadBtn.style.margin = '0 auto 10px auto';
        popup.appendChild(downloadBtn);
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.display = 'block';
        closeBtn.style.margin = '0 auto';
        closeBtn.onclick = () => document.body.removeChild(popup);
        popup.appendChild(closeBtn);
        document.body.appendChild(popup);
        let idx = 0;
        animImg.src = frameImages[0].src;
        let interval = setInterval(() => {
            idx = (idx + 1) % frameImages.length;
            animImg.src = frameImages[idx].src;
        }, 200);
        closeBtn.addEventListener('click', () => clearInterval(interval));
        downloadBtn.addEventListener('click', async () => {
            console.log("Download Animation button clicked");
            const gif = new window.GIF({ workers: 2, quality: 10, width: 400, height: 300, workerScript: "https://cdn.jsdelivr.net/npm/gif.js.optimized/dist/gif.worker.js" });
            for (const frame of frameImages) {
                const tempImg = document.createElement('img');
                tempImg.src = frame.src;
                await new Promise(r => { tempImg.onload = r; });
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = 400;
                tempCanvas.height = 300;
                const tempCtx = tempCanvas.getContext('2d');
                tempCtx.drawImage(tempImg, 0, 0, 400, 300);
                gif.addFrame(tempCtx, {copy: true, delay: 200});
            }
            gif.on('finished', function(blob) {
                console.log("GIF finished, starting download");
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'animation.gif';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
            gif.render();
        });
    });
}