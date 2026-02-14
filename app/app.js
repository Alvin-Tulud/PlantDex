const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Index route
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// upload route
const uploadRouter = require('./routes/upload');
app.use('/upload', uploadRouter);








app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
