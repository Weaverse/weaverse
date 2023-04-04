export let loadScript = (src: string) => {
  return new Promise((resolve, reject) => {
    let script = document.createElement("script")
    script.src = src
    script.onload = resolve
    script.onerror = reject
    script.defer = true
    document.body.appendChild(script)
  })
}

export default loadScript
