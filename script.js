window.addEventListener('DOMContentLoaded', (event) => {
    const uploadInput = document.getElementById('uploadInput');
    const imageContainer = document.getElementById('imageContainer');
    const ringWidthInput = document.getElementById('ringWidth');
    const ringColorInput = document.getElementById('ringColor');
    const downloadButton = document.getElementById('downloadButton');

    let image;
    let canvas;
    let ctx;

    // Listen for file upload event
    uploadInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            image = new Image();
            image.src = e.target.result;

            // Perform cropping and display after image is loaded
            image.onload = function() {
                canvas = document.createElement('canvas');
                ctx = canvas.getContext('2d');
                const size = Math.min(image.width, image.height);
                canvas.width = size;
                canvas.height = size;

                // Crop to circular image
                ctx.beginPath();
                ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(image, 0, 0, size, size);

                // Display circular image in image container
                imageContainer.style.backgroundImage = `url(${canvas.toDataURL()})`;

                // Update ring style
                updateRingStyle();
            };
        };

        reader.readAsDataURL(file);
    });

    // Listen for ring width adjustment event
    ringWidthInput.addEventListener('input', function() {
        updateRingStyle();
    });

    // Listen for ring color selection event
    ringColorInput.addEventListener('input', function() {
        updateRingStyle();
    });

    // Listen for download button click event
    downloadButton.addEventListener('click', function() {
        if (!canvas) {
            return;
        }

        // Create a virtual link and set download attributes
        const link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = 'avatar.png';

        // Simulate click on the download link
        link.click();
    });

    // Update ring style
    function updateRingStyle() {
        if (!ctx) {
            return;
        }

        const ringWidth = parseInt(ringWidthInput.value);
        const ringColor = ringColorInput.value;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw circular image
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Draw the ring
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - ringWidth / 2, 0, 2 * Math.PI);
        ctx.lineWidth = ringWidth;
        ctx.strokeStyle = ringColor;
        ctx.stroke();

        // Update background image of the image container
        imageContainer.style.backgroundImage = `url(${canvas.toDataURL()})`;
    }
});