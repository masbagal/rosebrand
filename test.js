const wiki = require('wikijs').default;


wiki({ apiUrl: 'https://id.wikipedia.org/w/api.php'})
.page('Ceresium flavipes')
.then(page => {
  console.log(page)
  return page.fullInfo()
  })
.then(console.log)
