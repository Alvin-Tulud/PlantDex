import express from "express"
import path from "path"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

app.set('view engine', 'ejs')

// Serve static files from the 'public' directory
// path.join(__dirname, 'public') ensures the path is correct regardless of the OS
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',(req, res) => {
    console.log('here')
    res.render("home")
})

app.listen(6767)