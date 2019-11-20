import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {
    Card,
    CloseButton,
    Container,
    FormCheck,
    FormControl,
    InputGroup,
    Jumbotron,
    ListGroup
} from "react-bootstrap";
import axios from 'axios';
import OutsideClickHandler from "react-outside-click-handler/esm/OutsideClickHandler";

const App = () => {

    const [toDoList, setToDoList] = useState({todos: []});
    const [edit, setEdit] = useState(null);
    const newToDo = useRef("");

    //const [editingValue, setEdititingValue] = useState("");
    const editingValue = useRef("");


    useEffect(() => {
        getToDoList();
    }, []);

    const getToDoList = async () => {
        let result = await axios.get('http://localhost:1200/');
        setToDoList(result.data);
    };

    const addNewTodo = async (event) => {
        if (event.keyCode === 13) {
            await axios.post('http://localhost:1200/create', {
                item: newToDo.current.value
            });
            getToDoList();
            newToDo.current.value = "";
        }
    };

    const editToDo = async (event, id) => {
        if (event.keyCode === 27)
            setEdit(null);

        if (event.keyCode === 13) {
            await axios.put('http://localhost:1200/updateitemname', {
                item: editingValue.current.value,
                id
            });
            await getToDoList();
            setEdit(null)
        }
    };

    const deleteToDo = async (id, index) => {
        await axios.delete(`http://localhost:1200/delete?id=${id}`);
        getToDoList();
    };

    const handleDone = async (id) => {
        await axios.put(`http://localhost:1200/updateitemcompletion`, {
            id
        });
        getToDoList();
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
                        <FormControl autoFocus={true} placeholder="What needs to be done"
                                     onKeyUp={(event) => addNewTodo(event)}
                                     ref={newToDo}/>
                    </InputGroup>
                    {/*                    <Button onClick={addNewTodo} variant="primary" size="sm">
                        Add new Todo
                    </Button>*/}
                </Container>
                <Container className="cards">
                    <Card>
                        <ListGroup>
                            {toDoList.todos.map((elem, index) =>
                                (edit === index && <OutsideClickHandler key={elem._id} onOutsideClick={() =>
                                    setEdit(null)
                                }><InputGroup className="mb-3">
                                    <FormControl
                                        autoFocus={true}
                                        defaultValue={elem.item}
                                        ref={editingValue}
                                        onKeyUp={(event) => editToDo(event, elem._id)}
                                    />
                                </InputGroup></OutsideClickHandler>) ||
                                (<ListGroup.Item onDoubleClick={() => setEdit(index)} key={elem._id}>
                                    <FormCheck onClick={() => handleDone(elem._id)} inline/>
                                    <span className={elem.completed ? "toDo" : null}>{elem.item}</span>
                                    <CloseButton onClick={() => deleteToDo(elem._id, index)}/>
                                </ListGroup.Item>))
                            }
                        </ListGroup>
                    </Card>
                </Container>
            </Container>
        </div>
    );
};

export default App;
