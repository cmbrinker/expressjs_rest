const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json()); //middleware

function validateCourse (course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

const courses = [
    {id: 1, name: 'Issac Asimov'},
    {id: 2, name: 'Frank Herbert'},
    {id: 3, name: 'Dan Simmons'}
];

app.get('/', (req, res) => {
    res.send(`Now we're writing with express!`);
});

//GET DATA ON SEVERAL COURSES
app.get('/api/courses', (req, res) => {
    res.send(courses);
});

//GET DATA ON A SINGLE COURSE
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(a => a.id === parseInt(req.params.id));
    if(!course) res.status(404).send(`The course was not found`);
    res.send(course);
});

//RETURN PARAMETERS SET BY HTTP REQUEST
app.get('/api/posts/:year/:month', (req, res) => {
    res.send(req.params);
});

//ADD COURSE TO COURSES
app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);
    if(error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

//UPDATE COURSE DATA
app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.error(404).send('The course was not found');
    const { error } = validateCourse(req.body);
    if(error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    course.name = req.body.name; //update other properties if they exist
    res.send(course);
});

//DELETE COURSE DATA
app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send('The course was not found');

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));