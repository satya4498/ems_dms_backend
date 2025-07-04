
(async function runner () {
  console.time('---------------------------------------------COMPLETED')
  for (let index = 0; index < +process.argv[2] || 1; index++) {
    console.time('---------------------------------------------START ' + index)
    console.timeEnd('---------------------------------------------START ' + index)
  }
  console.timeEnd('---------------------------------------------COMPLETED')
}())
