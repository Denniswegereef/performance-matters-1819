let buttons = document.querySelectorAll('button')
let similairContainer = document.getElementById('similair')
window.location.hash = '#'

function chooseSingle(current) {
  let li = current.parentElement
  let ul = current.parentElement.parentElement.children

  for (let item of ul) {
    console.log(item)
    console.dir(item)
    item.classList.add('hide')
  }

  li.classList.remove('hide')
  li.classList.add('middle')
  // console.log(`All items are ${ul.length}`)
  // console.log(`items are ${current.nodeType}`)

  console.dir(li)
  // for (var item of ul) {
  //   i++
  //   if (i === ul.childElementCount) {
  //     console.log('FOUND DUPLICATE')
  //     return
  //   } else {
  //     item.classList.add('remove')
  //   }
  // }
}

async function getNewSimilair() {
  chooseSingle(this)

  let url = `http://localhost:8080/getSimilair/${this.value}`

  let oldButtons = document.querySelectorAll('button')

  for (let item of oldButtons) {
    item.remove()
  }

  let data = await fetch(url).then(response => {
    return response.text()
  })
  console.log(data)
  similairContainer.insertAdjacentHTML('beforeend', data)

  let newbuttons = document.querySelectorAll('button')

  for (let item of newbuttons) {
    item.addEventListener('click', getNewSimilair)
  }
  //window.location.hash = '#'
  setTimeout(() => {
    window.location.hash = '#'
    window.location.hash = '#end'
  }, 400)
}

for (let item of buttons) {
  item.addEventListener('click', getNewSimilair)
}

// artistSingle
//   .getElementsByTagName('button')
