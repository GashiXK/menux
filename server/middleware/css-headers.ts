export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  const path = url.pathname
  
  // Set correct Content-Type for CSS files
  if (path.endsWith('.css')) {
    setHeader(event, 'Content-Type', 'text/css; charset=utf-8')
  }
})

