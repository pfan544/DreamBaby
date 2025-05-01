document.getElementById('GenerateButton').addEventListener('click', async () => {
    const parent1 = document.getElementById('Parent1Input').files[0];
    const parent2 = document.getElementById('Parent2Input').files[0];
    const email1 = document.getElementById('Email1Input').value;
    const email2 = document.getElementById('Email2Input').value;

    if (!parent1 || !parent2 || !email1) {
        alert('Please upload both photos and provide at least one email.');
        return;
    }

    const formData = new FormData();
    formData.append('parent1', parent1);
    formData.append('parent2', parent2);
    formData.append('email1', email1);
    if (email2) formData.append('email2', email2);

   try {
        const response = await fetch('https://ai-news-now.app.n8n.cloud/webhook-test/dreambaby', {
            method: 'POST',
            body: formData
        });
        console.log('Response status:', response.status, response.statusText);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Text: ${errorText}`);
        }
        const data = await response.json();
        console.log('Response data:', data);

        document.getElementById('BabyImage').src = data.babyUrl;
        document.getElementById('BabyNames').innerHTML = data.names.map(name => `<li>${name}</li>`).join('');
        document.getElementById('BabyTraits').innerText = data.traits;

        document.getElementById('ResultsGroup').style.display = 'block';
    } catch (error) {
        alert('Something went wrong! Error: ' + error.message);
        console.error('Error details:', error);
    }
});
