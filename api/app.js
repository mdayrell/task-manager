const express = require('express');
const app = express();

const { mongoose } = require('./db/mongoose');

const bodyParser = require('body-parser');

//Load Mongoose models
const { List, Task } = require('./db/models');

//Load Middleware (BodyParser)
app.use(bodyParser.json());

//CORS HEADERS MIDDLEWARE
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.header('Access-Control-Allow-Methods', 'GET, POST, HEAD, OPTIONS, PUT, DELETE, PATCH');
        return res.status(200).json({});
    };
    next();
});

/* Rotas */

/* Lista de Rotas */

/**
 * GET /lists
 * Purpose: Get all lists
 */
app.get('/lists', (req, res) => {
    // retornar um array de todas as listas do banco de dados
    List.find({}).then((lists) => {
        res.send(lists);
    }).catch((e) => {
        res.send(e);
    });
});

/**
 * POST /lists
 * Purpose: Create a list
 */
app.post('/lists', (req, res) => {
    // criar uma nova lista e retornar uma nova lista para o usuário que tenha o id
    // the list information (fields) will passed in via the JSON request body
    let title = req.body.title;

    let newList = new List({
        title
    });
    newList.save().then((listDoc) => {
        // the full list document is returned (incl, id)
        res.send(listDoc);
    });
});

/**
 * PATCH /lists/:id
 * Purpose: atualizar lista especifica
 */
app.patch('/lists/:id', (req, res) => {
    // atualizar uma lista especifica com novos valores especificados no JSON
    List.findOneAndUpdate({ _id: req.params._id}, {
        $set: req.body 
    }).then(() => {
        res.sendStatus(200);
    });
});

/**
 * DELETE /lists/:id
 * Purpose: deletar lista especifica
 */
app.delete('/lists/:id', (req, res) => {
    // atualizar uma lista especifica com novos valores especificados no JSON
    List.findOneAndRemove({
        _id: req.params.id
    }).then((removedListDoc) => {
        res.send(removedListDoc)
    });
});

app.get('/lists/:listId/tasks', (req, res) => {
    Task.find({
        _listId: req.params.listId
    }).then((tasks) => {
        res.send(tasks);
    })
}); 

app.get('/lists/:listId/tasks/taskId', (req, res) => {
    Task.findOne({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((task) => {
        res.send(task);
    })
});

app.post('/lists/:listId/tasks', (req, res) => {
    let newTask = new Task({
        title: req.body.title,
        _listId: req.params.listId
    });
    newTask.save().then((newTaskDoc) => {
        res.send(newTaskDoc);
    });
});

app.patch('/lists/:listId/tasks/:taskId ', (req, res) => {
    Task.findOneAndUpdate({ 
        _id: req.params.taskId,
        _listId: req.params._listId
    }, {
        $set: req.body 
    }).then(() => {
        res.send({message: "Updated successfully"})
    });
});

app.delete('/lists/:listId/tasks/:taskId', (req, res) => {
    // atualizar uma lista especifica com novos valores especificados no JSON
    Task.findOneAndRemove({
        _id: req.params.id,
        _listId: req.params._listId
    }).then((removedTaskDoc) => {
        res.send(removedTaskDoc)
    });
});

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
})