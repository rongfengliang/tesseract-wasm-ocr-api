document.getElementById('file-upload').addEventListener('change', function(e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        var img = document.createElement('img');
        img.src = e.target.result;
        document.getElementById('image-display').innerHTML = '';
        document.getElementById('image-display').appendChild(img);

        // Create a FormData object
        var formData = new FormData();
        formData.append('file', file);
        // Send the AJAX request
        fetch('/ocr', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Display the recognized text in the text-display div
            document.getElementById('text-display').innerText = data.text;
        })
        .catch(error => console.error('Error:', error));
    };
    reader.readAsDataURL(file);
});