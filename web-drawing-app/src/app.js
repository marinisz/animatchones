const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const clearBtn = document.getElementById('clearCanvas');

let drawing = false;
let currentColor = colorPicker.value;
let currentSize = brushSize.value;
let isErasing = false;


// Define o fundo do canvas como branco puro
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
// Botão de borracha
const eraserBtn = document.getElementById('eraserBtn');
if (eraserBtn) {
    eraserBtn.addEventListener('click', () => {
        isErasing = !isErasing;
        eraserBtn.textContent = isErasing ? 'Desenhar' : 'Borracha';
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

// Adiciona funcionalidade de salvar frame
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

// Função para mostrar animação dos frames em um pop-up
const playAnimationBtn = document.getElementById('playAnimation');
if (playAnimationBtn) {
    playAnimationBtn.addEventListener('click', () => {
        // Coleta todos os frames
        const frameImages = Array.from(framesColumn.querySelectorAll('img'));
        if (frameImages.length === 0) {
            alert('Nenhum frame salvo!');
            return;
        }
        // Cria pop-up
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
        // Área da animação
        const animImg = document.createElement('img');
        animImg.style.width = '400px';
        animImg.style.height = '300px';
        animImg.style.display = 'block';
        animImg.style.margin = '0 auto 20px auto';
        popup.appendChild(animImg);
        // Botão fechar
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Fechar';
        closeBtn.style.display = 'block';
        closeBtn.style.margin = '0 auto';
        closeBtn.onclick = () => document.body.removeChild(popup);
        popup.appendChild(closeBtn);
        document.body.appendChild(popup);
        // Animação dos frames
        let idx = 0;
        animImg.src = frameImages[0].src;
        let interval = setInterval(() => {
            idx = (idx + 1) % frameImages.length;
            animImg.src = frameImages[idx].src;
        }, 200); // 300ms por frame
        // Limpa intervalo ao fechar
        closeBtn.addEventListener('click', () => clearInterval(interval));
    });
}