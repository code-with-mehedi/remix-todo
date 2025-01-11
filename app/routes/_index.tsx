import { json, LoaderFunction, ActionFunction, MetaFunction } from "@remix-run/node";
import { useFetcher, Form, useLoaderData, redirect, useActionData } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import { useEffect, useRef } from "react";
import { useState } from "react";

export const meta: MetaFunction = () => {
    return [
        { title: "New Remix App" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

const prisma = new PrismaClient();

export const loader: LoaderFunction = async () => {
    const todos = await prisma.todo.findMany();
    return json({ todos: todos || [] });
}
export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const actionType = formData.get("actionType");
    const id = formData.get("id");
    const title = formData.get("title");

    if (actionType === "add") {
        if (typeof title !== "string" || !title.trim()) {
            throw new Error("Invalid title");
        }

        await prisma.todo.create({
            data: {
                title: title.trim(),
                completed: false,
            },
        });

        return redirect("/");
    }

    if (actionType === "update") {
        if (typeof id !== "string" || typeof title !== "string" || !id || !title.trim()) {
            throw new Error("Invalid data for update");
        }

        await prisma.todo.update({
            where: { id: parseInt(id, 10) },
            data: { title: title.trim() },
        });

        return redirect("/");
    }

    if (actionType === "delete") {
        if (typeof id !== "string" || !id) {
            throw new Error("Invalid id for delete");
        }

        await prisma.todo.delete({
            where: { id: parseInt(id, 10) },
        });

        return redirect("/");
    }
};

export default function Index() {
    const loaderData = useLoaderData<{ todos: { id: number; title: string; completed: boolean }[] }>() || { todos: [] };
    const { todos } = loaderData;
    const formRef = useRef<HTMLFormElement>(null);
    useEffect(() => {
        if (formRef.current) {
            formRef.current?.reset();
        }
    });
    const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
    return (
        <div className="p-6 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold text-center mb-4">Todo App</h1>
            <ul className="space-y-4">
                {todos.map((todo) => (
                    <li key={todo.id} className="flex items-center justify-between p-4 bg-gray-100 rounded shadow">
                        <span className="text-lg text-black">{todo.title}</span>
                        <div className="flex items-center space-x-2">
                            {editingTodoId === todo.id ? (
                                <Form method="post" className="flex w-full space-x-2" onSubmit={() => setEditingTodoId(null)}>
                                    <input type="hidden" name="id" value={todo.id} />
                                    <input
                                        type="text"
                                        name="title"
                                        defaultValue={todo.title}
                                        className="flex-grow px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
                                    />
                                    <input type="hidden" name="actionType" value="update" />
                                    <button
                                        type="submit"
                                        className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingTodoId(null)}
                                        className="px-3 py-1 text-white bg-gray-500 rounded hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                </Form>
                            ) : (
                                <>
                                    {/*<span className="flex-grow">{todo.title}</span>*/}
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setEditingTodoId(todo.id)}
                                            className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                                        >
                                            Update
                                        </button>
                                        <Form method="post" className="inline-block">
                                            <input type="hidden" name="id" value={todo.id} />
                                            <input type="hidden" name="actionType" value="delete" />
                                            <button
                                                type="submit"
                                                className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </Form>
                                    </div>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
            <Form ref={formRef} method="post" className="mt-6 flex items-center space-x-2">
                <input type="hidden" name="actionType" value="add" />
                <input
                    type="text"
                    name="title"
                    placeholder="Enter todo"
                    className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                    type="submit"
                    className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                >
                    Add Todo
                </button>
            </Form>
        </div>
    );
}
