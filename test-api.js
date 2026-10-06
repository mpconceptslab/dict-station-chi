const API_KEY = 'AIzaSyBQQ2BGMPHZchJAvtBfakbewEOr6vusaMc';

async function testAPI() {
  try {
    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [{
          image: { content: '' },
          features: [{ type: 'TEXT_DETECTION' }]
        }]
      })
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAPI();
