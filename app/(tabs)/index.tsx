import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, View, Image, TextInput, Button } from "react-native";
import image from "../../assets/images/background-image.png";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TabOneScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState("");

  const addTodo = () => {
    if (!newTodoText) return;
    const id = todos.length === 0 ? 0 : todos[todos.length - 1].id + 1;
    setTodos((prev) => [...prev, { id, text: newTodoText, completed: false }]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo List</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Add a new todo"
        value={newTodoText}
        onChangeText={setNewTodoText}
      />
      <Button title="Add Todo" onPress={addTodo} />
      <TodoList todos={todos} setTodos={setTodos} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  textInput: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  todoText: {
    fontSize: 16,
  },
});
