document.getElementById('GenerateButton').addEventListener('click', async () => {
    console.log('GenerateButton clicked');

    const parent1 = document.getElementById('Parent1Input')?.files[0];
    const parent2 = document.getElementById('Parent2Input')?.files[0];
    const email1 = document.getElementById('Email1Input')?.value;
    const email2 = document.getElementById('Email2Input')?.value;

    console.log('Inputs:', { parent1, parent2, email1, email2 });

    if (!parent1 || !parent2 || !email1) {
        alert('Please upload both photos and provide at least one email.');
        return;
    }

    const formData = new FormData();
    formData.append('parent1', parent1);
    formData.append('parent2', parent2);
    formData.append('email1', email1);
    if (email2) formData.append('email2', email2);

    console.log('FormData prepared');

    try {
        console.log('Starting fetch request');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // Timeout after 30 seconds

        const response = await fetch('https://ai-news-now.app.n8n.cloud/webhook/dreambaby', {
            method: 'POST',
            body: formData,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        console.log('Response status:', response.status, response.statusText);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Text: ${errorText}`);
        }
        const data = await response.json();
        console.log('Response data:', data);

        if (!data.success) {
            throw new Error(data.error || 'Unknown error occurred');
        }

        const babyImage = document.getElementById('BabyImage');
        const babyNames = document.getElementById('BabyNames');
        const babyTraits = document.getElementById('BabyTraits');
        const resultsGroup = document.getElementById('ResultsGroup');

        if (!babyImage || !babyNames || !babyTraits || !resultsGroup) {
            throw new Error('Required DOM elements not found');
        }

        babyImage.src = data.babyUrl;
        babyNames.innerHTML = data.names.map(name => `<li>${name}</li>`).join('');
        babyTraits.innerText = data.traits;

        resultsGroup.style.display = 'block';
    } catch (error) {
        alert('Something went wrong! Error: ' + error.message);
        console.error('Error details:', error);
    }
});
