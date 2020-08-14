const wiki = require('wikijs').default;


wiki({ apiUrl: 'https://id.wikipedia.org/w/api.php'})
.page('Carex insularis')
.then(page => {
  console.log(page)
  return page.fullInfo()
  })
.then(info => {
  console.log(info);
  return Object.keys(info).includes("regnum")
})
.then(console.log)
