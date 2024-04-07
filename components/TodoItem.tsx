import { Todo } from "@/app/(tabs)";
import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

interface TodoProps {
  task: Todo;
}

const TodoItem: React.FC<TodoProps> = ({ task }) => {
  const toggleCompleted = () => {
    // Update task completion status (explained later)
  };

  return (
    <TouchableOpacity onPress={toggleCompleted}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 10,
          borderRadius: 10,
          backgroundColor: "#333",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: 5,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              textDecorationLine: task.completed ? "line-through" : "none",
              color: "#00a6fb",
            }}
          >
            {task.text}
          </Text>
          <Text style={{ color: "#fff", fontSize: 12 }}>
            {task.timeAdded?.toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </Text>
        </View>
        <Text style={{ color: task.completed ? "green" : "red" }}>
          {task.completed ? "✓" : "✗"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default TodoItem;
