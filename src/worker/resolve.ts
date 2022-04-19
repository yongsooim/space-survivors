
for (let i = 0; i < 10; i++) {
  console.log('executed in worker')
}

postMessage('worker done')
onmessage = event => {
  console.log(event + ' received from main')
}
