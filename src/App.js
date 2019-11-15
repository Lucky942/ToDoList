import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {Button, Card, CloseButton, Container, FormControl, InputGroup, Jumbotron, ListGroup} from "react-bootstrap";
import axios from 'axios';

const App = () => {

    const [toDoList, setToDoList] = useState({todos: []});
    const newToDo = useRef("");
    //const [add, setAdd] = useState(false);
    //const [remove, setRemove] = useState(false);

    useEffect(() => {

        getToDoList();

    }, []);

    const getToDoList = async () => {
        let result =  await axios.get('http://localhost:1200/');
        setToDoList(result.data);
    };

    const addNewTodo = async () => {
        await axios.post('http://localhost:1200/create', {
            item: newToDo.current.value
        });
        getToDoList();
        //setAdd(!add);
    };

    const deleteToDo = async (id) => {
        await axios.delete(`http://localhost:1200/delete?id=${id}`);
        getToDoList();
        //setRemove(!remove);
    };

    return (
        <div>
            <Jumbotron>
                <Container>
                    <h1>Hello!</h1>
                    <p>This is a simple ToDoList created by Vadik</p>
                </Container>
            </Jumbotron>
            <Container>
                <Container>
                    <InputGroup>
                        <FormControl placeholder="What needs to be done" ref={newToDo}/>
                    </InputGroup>
                    <Button onClick={addNewTodo} variant="primary" size="sm">
                        Add new Todo
                    </Button>
                </Container>
                <Container className="cards">
                    <Card>
                        <ListGroup>
                            {toDoList.todos.map((elem) => <ListGroup.Item
                                key={elem._id}>{elem.item}<CloseButton onClick={() => deleteToDo(elem._id)}/>  </ListGroup.Item>)}
                        </ListGroup>
                    </Card>
                </Container>
            </Container>
        </div>
    );
};

export default App;
