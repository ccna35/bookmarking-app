import React from "react";
import TodoItem from "./TodoItem";
import { Todo } from "@/app/(tabs)";
import { View } from "react-native";

interface TodoProps {
  tasks: Todo[];
}

const TodoList: React.FC<TodoProps> = ({ tasks }) => {
  const taskList = tasks
    .sort(
      (a, b) =>
        new Date(b.timeAdded).getTime() - new Date(a.timeAdded).getTime()
    )
    .map((task) => <TodoItem key={task.id} task={task} />);

  return (
    <View
      style={{
        marginTop: 20,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch",
        gap: 10,
      }}
    >
      {taskList}
    </View>
  );
};

export default TodoList;
