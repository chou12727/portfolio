import { useState } from "react";


export default function Grocery({ g, removeGrocery, updateGrocery }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: g.name, quantity: g.quantity });
    const startEdit = () => {
        setIsEditing(true);
        setEditData({ name: g.name, quantity: g.quantity });
    };

    const cancelEdit = () => {
        setIsEditing(false);
    };

    const saveEdit = () => {
        updateGrocery(g._id, editData);
        setIsEditing(false);
    };
    return (
        <>
            <li>
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <input
                            type="number"
                            value={editData.quantity}
                            onChange={(e) => setEditData(prev => ({ ...prev, quantity: e.target.value }))}
                        />
                        <button onClick={saveEdit}>保存</button>
                        <button onClick={cancelEdit}>キャンセル</button>
                    </>
                ) : (
                    <>
                        <span onClick={startEdit} >
                            {g.name} - {g.quantity}
                        </span>
                        <button onClick={removeGrocery}>削除</button>
                    </>
                )}
            </li>

        </>
    )
}