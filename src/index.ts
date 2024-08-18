import app from './app'
import '~/jobs' 

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send('Server working')
})

app.listen(PORT, () => {
    console.log(`Server listengin on port ${PORT}`)
})
