const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');

const app = express();

// Middleware
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
	res.send('Hello world');
});

app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRoutes);

// Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server is running at ${port}`);
});
