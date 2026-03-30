const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/recent-articles',
  method: 'GET',
  headers: {
    'Cache-Control': 'no-cache'
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const articles = JSON.parse(data);
      console.log('Total articles:', articles.length);
      
      // Filter for Burnout category
      const burnoutArticles = articles.filter(article => article.category === 'Burnout');
      console.log('Burnout articles:', burnoutArticles.length);
      
      // Sort by date
      const sortedBurnoutArticles = burnoutArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
      console.log('Top 5 Burnout articles:');
      sortedBurnoutArticles.slice(0, 5).forEach(article => {
        console.log(`${article.title} (${article.date})`);
      });
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  });
});

req.on('error', (error) => {
  console.error('Error making request:', error);
});

req.end();