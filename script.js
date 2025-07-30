document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('portfolioCanvas');
    const ctx = canvas.getContext('2d');
    const projectTextInput = document.getElementById('projectText');
    const generateBtn = document.getElementById('generateImageBtn');
    const outputImage = document.getElementById('generatedPortfolioImage');
    const downloadLink = document.getElementById('downloadLink');

    const audio = new Audio('audio/Mysterious-Rise.mp3'); // Adjust path if needed
    audio.loop = true;
    audio.volume = 0.6;

    // Colors from your CSS (or define them directly)
    const primaryColor = '#0a192f';
    const secondaryColor = '#64ffda';
    const lightBgColor = '#112240';
    const textColorLight = '#ccd6f6';
    const textColor = '#8892b0';

    function drawPortfolioImage(projectText = "P") {
        ctx.fillStyle = primaryColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = textColor;
        ctx.lineWidth = 0.3;
        ctx.globalAlpha = 0.15;
        for (let i = 0; i < canvas.width; i += 25) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 25) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }
        ctx.globalAlpha = 1.0;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const orbRadius = Math.min(canvas.width, canvas.height) / 4.5;

        const glowGradient = ctx.createRadialGradient(centerX, centerY, orbRadius * 0.4, centerX, centerY, orbRadius * 1.3);
        glowGradient.addColorStop(0, secondaryColor + 'AA');
        glowGradient.addColorStop(0.6, secondaryColor + '44');
        glowGradient.addColorStop(1, primaryColor + '00');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, orbRadius * 1.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(centerX, centerY, orbRadius, 0, Math.PI * 2);
        ctx.fillStyle = lightBgColor;
        ctx.fill();
        ctx.strokeStyle = secondaryColor;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, orbRadius * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = secondaryColor;
        ctx.fill();

        ctx.strokeStyle = secondaryColor;
        ctx.lineWidth = 1.8;
        const numSpikes = 8;
        for (let i = 0; i < numSpikes; i++) {
            const angle = (i / numSpikes) * Math.PI * 2 + (Math.PI / numSpikes);
            const lenMultiplier = (i % 2 === 0) ? 1.2 : 0.8;

            const startX = centerX + Math.cos(angle) * (orbRadius + 3);
            const endX = centerX + Math.cos(angle) * (orbRadius + 15 * lenMultiplier);
            const startY = centerY + Math.sin(angle) * (orbRadius + 3);
            const endY = centerY + Math.sin(angle) * (orbRadius + 15 * lenMultiplier);

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(endX, endY, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = secondaryColor;
            ctx.fill();
        }

        ctx.fillStyle = textColorLight;
        ctx.font = `bold ${orbRadius * 0.55}px 'SF Mono', Consolas, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = secondaryColor;
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillText(projectText, centerX, centerY + 2);
        ctx.shadowBlur = 0;

        ctx.strokeStyle = secondaryColor + '66';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(1.25, 1.25, canvas.width - 2.5, canvas.height - 2.5);
    }

    generateBtn.addEventListener('click', () => {
        const textToDraw = projectTextInput.value || "P";
        drawPortfolioImage(textToDraw);

        const dataURL = canvas.toDataURL('image/png');
        outputImage.src = dataURL;
        outputImage.style.display = 'block';
        downloadLink.href = dataURL;
        downloadLink.download = `portfolio-thumbnail-${textToDraw.replace(/\s+/g, '_')}.png`;
        downloadLink.style.display = 'inline-block';

        // Start audio on first interaction
        if (audio.paused) {
            audio.play().catch(err => console.warn('Audio play failed:', err));
        }
    });

    // Draw initial
    drawPortfolioImage(projectTextInput.value || "P1");
    const initialDataURL = canvas.toDataURL('image/png');
    outputImage.src = initialDataURL;
    outputImage.style.display = 'block';
    downloadLink.href = initialDataURL;
    downloadLink.download = `portfolio-thumbnail-${(projectTextInput.value || "P1").replace(/\s+/g, '_')}.png`;
    downloadLink.style.display = 'inline-block';
});
