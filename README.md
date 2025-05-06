<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Pixel Art com Paleta</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 20px;
      font-family: 'Segoe UI', sans-serif;
      background-color: #fafafa;
      color: #333;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    h1 {
      font-size: 1.5rem;
      margin-bottom: 10px;
    }

    label {
      display: block;
      font-weight: 600;
      margin: 15px 0 5px;
    }

    input[type="file"] {
      width: 100%;
      padding: 10px;
      background: #fff;
      border: 1px solid #ccc;
      border-radius: 8px;
    }

    button {
      background: #4CAF50;
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.3s;
    }

    button:hover {
      background: #45a049;
    }

    canvas {
      margin-top: 20px;
      border: 2px solid #ccc;
      border-radius: 10px;
      max-width: 100%;
    }

    #preview {
      image-rendering: pixelated;
    }

    .container {
      width: 100%;
      max-width: 400px;
    }

    .button-row {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Pixel Art com Paleta</h1>

    <label for="paletteInput">1. Enviar paleta de cores</label>
    <input type="file" id="paletteInput" accept="image/*">

    <label for="imageInput">2. Enviar imagem para converter</label>
    <input type="file" id="imageInput" accept="image/*">

    <div class="button-row">
      <button onclick="download()">Baixar Resultado</button>
      <button onclick="copyToClipboard()">Copiar para Área de Transferência</button>
    </div>

    <canvas id="canvas" style="display: none;"></canvas>
    <canvas id="preview"></canvas>
  </div>

  <script>
    const paletteInput = document.getElementById('paletteInput');
    const imageInput = document.getElementById('imageInput');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let palette = [];

    paletteInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;

      const img = new Image();
      img.onload = () => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        const tctx = tempCanvas.getContext('2d');
        tctx.drawImage(img, 0, 0);
        const imageData = tctx.getImageData(0, 0, img.width, img.height).data;

        const colorSet = new Set();
        for (let i = 0; i < imageData.length; i += 4) {
          const r = imageData[i], g = imageData[i + 1], b = imageData[i + 2];
          const hex = rgbToHex(r, g, b);
          colorSet.add(hex);
        }

        palette = Array.from(colorSet).map(hexToRgb);
        alert(`Paleta carregada com ${palette.length} cores.`);
      };
      img.src = URL.createObjectURL(file);
    });

    imageInput.addEventListener('change', e => {
      if (palette.length === 0) {
        alert("Envie a imagem da paleta primeiro.");
        return;
      }

      const file = e.target.files[0];
      if (!file) return;

      const img = new Image();
      img.onload = () => {
        const w = img.width;
        const h = img.height;

        canvas.width = w;
        canvas.height = h;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = w;
        tempCanvas.height = h;
        const tctx = tempCanvas.getContext('2d');
        tctx.drawImage(img, 0, 0, w, h);

        const imgData = tctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2];
          const [nr, ng, nb] = getClosestColor(r, g, b);
          data[i] = nr;
          data[i + 1] = ng;
          data[i + 2] = nb;
        }

        tctx.putImageData(imgData, 0, 0);
        const ectx = canvas.getContext('2d');
        ectx.drawImage(tempCanvas, 0, 0, w, h);

        const preview = document.getElementById('preview');
        const zoom = 10;
        preview.width = w * zoom;
        preview.height = h * zoom;
        const pctx = preview.getContext('2d');
        pctx.imageSmoothingEnabled = false;
        pctx.drawImage(tempCanvas, 0, 0, preview.width, preview.height);
      };
      img.src = URL.createObjectURL(file);
    });

    function rgbToHex(r, g, b) {
      return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    }

    function hexToRgb(hex) {
      const bigint = parseInt(hex.replace('#', ''), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return [r, g, b];
    }

    function getClosestColor(r, g, b) {
      let minDist = Infinity;
      let closest = [r, g, b];
      for (const [pr, pg, pb] of palette) {
        const dist = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2;
        if (dist < minDist) {
          minDist = dist;
          closest = [pr, pg, pb];
        }
      }
      return closest;
    }

    function download() {
      const link = document.createElement('a');
      link.download = 'pixel-art.png';
      link.href = canvas.toDataURL();
      link.click();
    }

    function copyToClipboard() {
      if (!navigator.clipboard || !window.ClipboardItem) {
        alert("Função de copiar imagem não suportada neste navegador.");
        return;
      }

      canvas.toBlob(blob => {
        const item = new ClipboardItem({ 'image/png': blob });
        navigator.clipboard.write([item])
          .then(() => alert("Imagem copiada para a área de transferência!"))
          .catch(err => alert("Erro ao copiar: " + err));
      });
    }
  </script>
</body>
</html>
