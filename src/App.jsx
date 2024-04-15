import { useState, useEffect } from 'react';
import styles from './App.module.css';
import { Form } from './components/Form/Form';
import { TodoItem } from './components/TodoItem/TodoItem';
import { getSubheading } from './utils/getSubheading';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable as Droppable } from './helpers/StrictModeDroppable';

function App() {
    const [isFormShown, setIsFormShown] = useState(false);
    const [todos, setTodos] = useState(() => {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            return JSON.parse(savedTodos);
        } else {
            return [
                { name: 'Wykonaj zadania rekrutacyjne', done: true, id: '1' },
                { name: 'Uzupełnij zawartość w plikach README.md', done: true, id: '2' },
                { name: 'Odpal wersje demonstracyjne', done: true, id: '3' },
                { name: 'Poinformuj Michaline o wykonaniu zadań', done: false, id: '4' },
            ];
        }
    });

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const handleOnDragEnd = result => {
        if (!result.destination) return;
        const items = Array.from(todos);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setTodos(items);
    };

    const addItem = newTodoName => {
        const trimmedName = newTodoName.trim();

        if (!trimmedName) {
            return;
        }
        setTodos(prevTodos => [
            ...prevTodos,
            {
                name: trimmedName,
                done: false,
                id: Math.random().toString(),
            },
        ]);
        setIsFormShown(false);
    };

    const deleteItem = id => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    };

    const toggleTodo = id => {
        setTodos(prevTodos =>
            prevTodos.map(todo => {
                if (todo.id === id) {
                    return { ...todo, done: !todo.done };
                }

                return {
                    ...todo,
                };
            })
        );
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 class={styles.title}>To-Do List</h1>
                    <h2 class={styles.subtitle}>{getSubheading(todos.length)}</h2>
                </div>
                {!isFormShown && (
                    <button
                        onClick={() => setIsFormShown(true)}
                        className={styles.button}>
                        +
                    </button>
                )}
            </header>
            {isFormShown && <Form onFormSubmit={newTodoName => addItem(newTodoName)} />}
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId='todos'>
                    {(provided, snapshot) => (
                        <section
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={snapshot.isDraggingOver ? styles.draggingOver : styles.restingOver}>
                            {todos.map(({ id, name, done }, index) => (
                                <Draggable
                                    key={id}
                                    draggableId={id}
                                    index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={provided.draggableProps.style}
                                            className={snapshot.isDragging ? styles.dragging : styles.resting}>
                                            <TodoItem
                                                name={name}
                                                done={done}
                                                onDeleteButtonClick={() => deleteItem(id)}
                                                onDoneButtonClick={() => toggleTodo(id)}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </section>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}

export default App;
